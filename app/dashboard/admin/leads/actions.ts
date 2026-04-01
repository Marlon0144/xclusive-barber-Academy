'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient, createClient } from '@/utils/supabase/server'

const statusSchema = z.enum(['new', 'contacted', 'qualified', 'lost', 'converted'])

async function assertAdmin(): Promise<{ ok: true; userId: string } | { ok: false }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { ok: false }

  return { ok: true, userId: user.id }
}

export async function updateLeadReviewAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin()
  if (!admin.ok) return

  const leadId = formData.get('leadId')
  const statusRaw = formData.get('status')
  const notesRaw = formData.get('reviewNotes')

  if (typeof leadId !== 'string' || !leadId) return

  const statusParsed = statusSchema.safeParse(statusRaw)
  if (!statusParsed.success) return

  const reviewNotes = typeof notesRaw === 'string' ? notesRaw.trim().slice(0, 500) : null

  const supabaseAdmin = createAdminClient()
  const now = new Date().toISOString()

  const { error } = await supabaseAdmin
    .from('crm_leads')
    .update({
      status: statusParsed.data,
      review_notes: reviewNotes || null,
      reviewed_by: admin.userId,
      reviewed_at: now,
      updated_at: now,
    })
    .eq('id', leadId)

  if (error) return

  revalidatePath('/dashboard/admin/leads')
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin()
  if (!admin.ok) return

  const leadId = formData.get('leadId')
  if (typeof leadId !== 'string' || !leadId) return

  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin
    .from('crm_leads')
    .delete()
    .eq('id', leadId)

  if (error) return

  revalidatePath('/dashboard/admin/leads')
}
