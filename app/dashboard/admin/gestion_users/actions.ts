'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import { normalizePhoneNumber } from '@/utils/phone'
import { getServerDictionary } from '@/lib/i18n/server'
import {
  createInvitationSchema,
  deleteInvitationSchema,
  toggleInvitationStatusSchema,
  updateUserRoleSchema,
  uuidSchema,
} from '@/lib/validation/gestion-users'

async function getAdminUserMessages() {
  const dictionary = await getServerDictionary()
  return dictionary.actions.adminUsers
}

async function assertAdmin(): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const messages = await getAdminUserMessages()
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, error: messages.unauthorizedUser }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { ok: false, error: messages.unauthorizedAdmin }
  }

  return { ok: true, userId: user.id }
}

function generateInviteCode(length = 10): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(length)

  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += alphabet[bytes[i] % alphabet.length]
  }

  return `XBA-${code}`
}

export async function createInviteCodeAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return
  const messages = await getAdminUserMessages()

  // REQ-FUNC-003 — validación Zod en lugar de parseo manual de FormData
  const parsed = createInvitationSchema.safeParse({
    role: formData.get('role_to_assign'),
    maxUses: formData.get('max_uses'),
  })
  if (!parsed.success) {
    return
  }

  const { role, maxUses } = parsed.data

  const rawLeadPhone = formData.get('lead_phone')
  const leadPhoneInput = typeof rawLeadPhone === 'string' ? rawLeadPhone.trim() : ''
  const rawCountryCode = formData.get('lead_country_code')
  const leadCountryCode = typeof rawCountryCode === 'string' ? rawCountryCode.trim() : '+61'

  const supabaseAdmin = createAdminClient()

  let leadIdToLink: string | null = null

  if (leadPhoneInput.length > 0) {
    const phoneWithCountryCode = leadPhoneInput.startsWith('+')
      ? leadPhoneInput
      : `${leadCountryCode} ${leadPhoneInput}`

    const normalizedPhone = normalizePhoneNumber(phoneWithCountryCode)
    if (!normalizedPhone.isValid) {
      const inviteError = encodeURIComponent(messages.invalidLeadPhone)
      redirect(`/dashboard/admin/gestion_users?invite_error=${inviteError}`)
    }

    const { data: leadByPhone } = await supabaseAdmin
      .from('crm_leads')
      .select('id')
      .eq('phone_number', normalizedPhone.value)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!leadByPhone?.id) {
      const inviteError = encodeURIComponent(messages.leadPhoneNotFound)
      redirect(`/dashboard/admin/gestion_users?invite_error=${inviteError}`)
    }

    leadIdToLink = leadByPhone.id
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = generateInviteCode(8)

    const { error } = await supabaseAdmin.from('invitations').insert({
      code,
      is_active: true,
      used_count: 0,
      max_uses: maxUses,
      role_to_assign: role,
      lead_id: leadIdToLink,
    })

    if (!error) {
      revalidatePath('/dashboard/admin/gestion_users')
      return
    }

    // Retry if random collision happens.
    if (error.code === '23505') {
      continue
    }

    return
  }
}

export async function toggleInviteStatusAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const parsed = toggleInvitationStatusSchema.safeParse({
    invitationId: formData.get('invite_id'),
    nextActive: formData.get('next_active'),
  })
  if (!parsed.success) {
    return
  }

  const { invitationId, nextActive } = parsed.data

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('invitations')
    .update({ is_active: nextActive === 'true' })
    .eq('id', invitationId)

  if (error) return

  revalidatePath('/dashboard/admin/gestion_users')
}

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const parsed = updateUserRoleSchema.safeParse({
    userId: formData.get('user_id'),
    role: formData.get('role'),
  })
  if (!parsed.success) {
    return
  }

  const { userId, role } = parsed.data

  const supabaseAdmin = createAdminClient()

  const { data: currentProfile, error: currentProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (currentProfileError || !currentProfile) {
    return
  }

  // Prevent accidental lockout by keeping at least one admin in the platform.
  if (currentProfile.role === 'admin' && role !== 'admin') {
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError) return
    if ((count ?? 0) <= 1) {
      return
    }
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    return
  }

  revalidatePath('/dashboard/admin/gestion_users')
}

export async function deleteInvitationAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const parsed = deleteInvitationSchema.safeParse({
    invitationId: formData.get('invite_id'),
  })
  if (!parsed.success) return

  const { invitationId } = parsed.data

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('invitations')
    .delete()
    .eq('id', invitationId)

  if (error) return

  revalidatePath('/dashboard/admin/gestion_users')
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const parsed = uuidSchema.safeParse(formData.get('user_id'))
  if (!parsed.success) return

  const targetUserId = parsed.data

  // Prevent deleting your own active admin account from this panel.
  if (targetUserId === adminCheck.userId) return

  const supabaseAdmin = createAdminClient()

  const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', targetUserId)
    .single()

  if (targetProfileError || !targetProfile) return

  // Keep at least one admin account in the platform.
  if (targetProfile.role === 'admin') {
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError || (count ?? 0) <= 1) return
  }

  // `submissions.grader_id` references auth.users without ON DELETE CASCADE.
  // Null it first to avoid FK violations when removing auth user.
  const { error: clearGraderError } = await supabaseAdmin
    .from('submissions')
    .update({ grader_id: null })
    .eq('grader_id', targetUserId)

  if (clearGraderError) return

  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId)
  if (deleteAuthError) return

  revalidatePath('/dashboard/admin/gestion_users')
}
