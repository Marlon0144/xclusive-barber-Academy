'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js' // Importamos el cliente básico

export type SignupState = {
  error?: string | null
  success?: boolean
}

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  // Cliente NORMAL (para validar invitación y crear auth user)
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const inviteCode = formData.get('inviteCode') as string

  // 1. VALIDAR CÓDIGO
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', inviteCode)
    .eq('is_active', true)
    .single()

  if (inviteError || !invitation || (invitation.used_count >= invitation.max_uses)) {
    return { error: 'Código de invitación inválido o expirado.', success: false }
  }

  // 2. CREAR USUARIO (Auth)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (authError) {
    return { error: authError.message, success: false }
  }

  // 3. CREAR PERFIL (USANDO ADMIN CLIENT)
  if (authData.user) {
    
    // AQUÍ ESTÁ EL TRUCO: Creamos un mini-cliente con la LLAVE MAESTRA
    // Esto se salta las reglas RLS para asegurar que el perfil se crea sí o sí.
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // <--- Usamos la llave secreta
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      full_name: fullName,
      email: email,
      // AHORA: Usamos el rol que viene definido en la invitación
      role: invitation.role_to_assign, 
    })

    if (profileError) {
      // IMPORTANTE: Dejamos un log en la terminal para que TÚ veas el error real si falla
      console.error("Error creando perfil:", profileError)
      return { error: 'Error creando perfil. Revisa la consola del servidor.', success: false }
    }

    // Quemar código (También con admin por si acaso cerramos permisos luego)
    await supabaseAdmin.from('invitations').update({
      used_count: invitation.used_count + 1
    }).eq('id', invitation.id)
  }

  revalidatePath('/', 'layout')
  redirect('/')
  
  return { success: true, error: null } 
}