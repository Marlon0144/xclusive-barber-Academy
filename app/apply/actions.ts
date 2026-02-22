'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export type ApplyState = {
  error?: string | null
  success?: boolean
}

export async function applyAccess(prevState: ApplyState, formData: FormData): Promise<ApplyState> {
  // Cliente NORMAL (para validar invitación y crear auth user)
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const inviteCode = formData.get('inviteCode') as string

  // Validaciones básicas
  if (!email || !password || !fullName || !inviteCode) {
    return { error: 'Por favor completa todos los campos.', success: false }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.', success: false }
  }

  // 1. VALIDAR CÓDIGO DE INVITACIÓN
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', inviteCode)
    .eq('is_active', true)
    .single()

  if (inviteError || !invitation || (invitation.used_count >= invitation.max_uses)) {
    return { error: 'Código de acceso inválido o expirado.', success: false }
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
  // Utilizamos la llave de servicio para bypasear RLS y asegurar que el perfil se create
  if (authData.user) {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
      // El rol asignado por la invitación
      role: invitation.role_to_assign,
    })

    if (profileError) {
      console.error("Error creando perfil:", profileError)
      return { error: 'Error al activar tu cuenta. Por favor intenta nuevamente.', success: false }
    }

    // 4. QUEMAR EL CÓDIGO (incrementar used_count)
    await supabaseAdmin.from('invitations').update({
      used_count: invitation.used_count + 1
    }).eq('id', invitation.id)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')

  return { success: true, error: null }
}
