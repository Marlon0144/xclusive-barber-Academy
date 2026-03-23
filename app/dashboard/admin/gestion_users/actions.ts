'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { createAdminClient, createClient } from '@/utils/supabase/server'

type UserRole = 'admin' | 'instructor' | 'student'
const MIN_INVITE_USES = 1
const MAX_INVITE_USES = 50

const VALID_ROLES = new Set<UserRole>(['admin', 'instructor', 'student'])

function parseRole(raw: FormDataEntryValue | null): UserRole | null {
  if (typeof raw !== 'string') return null
  if (!VALID_ROLES.has(raw as UserRole)) return null
  return raw as UserRole
}

function parseMaxUses(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== 'string') return null

  const value = Number(raw)
  if (!Number.isInteger(value)) return null
  if (value < MIN_INVITE_USES || value > MAX_INVITE_USES) return null

  return value
}

async function assertAdmin(): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { ok: false, error: 'No autorizado: debes iniciar sesion.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { ok: false, error: 'No autorizado: solo administradores.' }
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

  const role = parseRole(formData.get('role_to_assign'))
  if (!role) {
    return
  }

  const maxUses = parseMaxUses(formData.get('max_uses'))
  if (maxUses === null) {
    return
  }

  const supabaseAdmin = createAdminClient()

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = generateInviteCode(8)

    const { error } = await supabaseAdmin.from('invitations').insert({
      code,
      is_active: true,
      used_count: 0,
      max_uses: maxUses,
      role_to_assign: role,
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

  const inviteId = formData.get('invite_id')
  const nextActive = formData.get('next_active')

  if (typeof inviteId !== 'string' || !inviteId) {
    return
  }

  if (nextActive !== 'true' && nextActive !== 'false') {
    return
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('invitations')
    .update({ is_active: nextActive === 'true' })
    .eq('id', inviteId)

  if (error) return

  revalidatePath('/dashboard/admin/gestion_users')
}

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const userId = formData.get('user_id')
  const role = parseRole(formData.get('role'))

  if (typeof userId !== 'string' || !userId) {
    return
  }

  if (!role) {
    return
  }

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

  const inviteId = formData.get('invite_id')
  if (typeof inviteId !== 'string' || !inviteId) return

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('invitations')
    .delete()
    .eq('id', inviteId)

  if (error) return

  revalidatePath('/dashboard/admin/gestion_users')
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const adminCheck = await assertAdmin()
  if (!adminCheck.ok) return

  const targetUserId = formData.get('user_id')
  if (typeof targetUserId !== 'string' || !targetUserId) return

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
