'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { getServerDictionary } from '@/lib/i18n/server'

export type ApplyState = {
  error?: string | null
  success?: boolean
}

function buildApplySchema(messages: {
  invalidEmail: string
  invalidPassword: string
  invalidName: string
  nameTooLong: string
  invalidInviteCode: string
}) {
  return z.object({
    email: z.string().email(messages.invalidEmail),
    password: z.string().min(6, messages.invalidPassword),
    fullName: z.string().trim().min(2, messages.invalidName).max(120, messages.nameTooLong),
    inviteCode: z
      .string()
      .trim()
      .min(3, messages.invalidInviteCode)
      .max(80, messages.invalidInviteCode),
  })
}

export async function applyAccess(prevState: ApplyState, formData: FormData): Promise<ApplyState> {
  const cookieStore = await cookies()
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.apply
  const applySchema = buildApplySchema(messages)

  // Cliente NORMAL (para validar invitación y crear auth user)
  const supabase = await createClient()

  const parsed = applySchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    inviteCode: formData.get('inviteCode'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? messages.invalidForm, success: false }
  }

  const { email, password, fullName, inviteCode } = parsed.data

  // 1. VALIDAR CÓDIGO DE INVITACIÓN
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', inviteCode)
    .eq('is_active', true)
    .single()

  if (inviteError || !invitation || (invitation.used_count >= invitation.max_uses)) {
    return { error: messages.inviteExpired, success: false }
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
      return { error: messages.activationError, success: false }
    }

    const trackedPhone = cookieStore.get('tracked_lead_phone')?.value ?? null
    const invitationLeadId = typeof (invitation as { lead_id?: unknown }).lead_id === 'string'
      ? (invitation as { lead_id: string }).lead_id
      : null
    let leadLinkedByTrackedPhone = false
    const now = new Date().toISOString()

    if (invitationLeadId) {
      const { data: leadFromInvitation } = await supabaseAdmin
        .from('crm_leads')
        .select('id, qualification_completed_at, stage4_entered_at')
        .eq('id', invitationLeadId)
        .maybeSingle()

      if (leadFromInvitation?.id) {
        const { error: linkByInvitationError } = await supabaseAdmin
          .from('crm_leads')
          .update({
            profile_id: authData.user.id,
            full_name: fullName,
            email,
            source: 'apply_registration',
            stage4_entered_at:
              leadFromInvitation.qualification_completed_at && !leadFromInvitation.stage4_entered_at
                ? now
                : leadFromInvitation.stage4_entered_at,
            updated_at: now,
          })
          .eq('id', leadFromInvitation.id)

        if (linkByInvitationError) {
          console.error('Error enlazando lead por invitacion:', linkByInvitationError)
        } else {
          leadLinkedByTrackedPhone = true
        }
      }
    }

    if (!leadLinkedByTrackedPhone && trackedPhone) {
      const { data: preLeadByPhone } = await supabaseAdmin
        .from('crm_leads')
        .select('id, qualification_completed_at, stage4_entered_at')
        .eq('phone_number', trackedPhone)
        .is('profile_id', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (preLeadByPhone?.id) {
        const { error: mergeLeadError } = await supabaseAdmin
          .from('crm_leads')
          .update({
            profile_id: authData.user.id,
            full_name: fullName,
            email,
            source: 'apply_registration',
            stage4_entered_at:
              preLeadByPhone.qualification_completed_at && !preLeadByPhone.stage4_entered_at
                ? now
                : preLeadByPhone.stage4_entered_at,
            updated_at: now,
          })
          .eq('id', preLeadByPhone.id)

        if (mergeLeadError) {
          console.error('Error enlazando pre-lead por telefono:', mergeLeadError)
        } else {
          leadLinkedByTrackedPhone = true
        }
      }
    }

    if (!leadLinkedByTrackedPhone) {
      const { error: crmSeedError } = await supabaseAdmin.from('crm_leads').upsert(
        {
          profile_id: authData.user.id,
          full_name: fullName,
          email,
          source: 'apply_registration',
          updated_at: now,
        },
        { onConflict: 'profile_id' },
      )

      if (crmSeedError) {
        console.error('Error creando lead inicial:', crmSeedError)
      }
    }

    cookieStore.delete('tracked_lead_phone')

    // 4. QUEMAR EL CÓDIGO (incrementar used_count)
    await supabaseAdmin.from('invitations').update({
      used_count: invitation.used_count + 1
    }).eq('id', invitation.id)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')

  return { success: true, error: null }
}
