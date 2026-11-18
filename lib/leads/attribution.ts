/**
 * Server side of lead attribution: reads the visitor's attribution from a form
 * submission (hidden `attr_*` fields) or, failing that, from the `xba_attr`
 * cookie, and stores it with the lead.
 *
 * Storage: rows in `crm_lead_answers` (question_key `attr_<name>`), which needs
 * no schema change and already appears next to each lead in the admin panel.
 * Saving is best-effort: attribution must NEVER make a lead submission fail.
 */

import {
  ATTRIBUTION_KEYS,
  parseAttribution,
  sanitizeValue,
  type Attribution,
} from '@/lib/analytics/attribution'
import type { createAdminClient } from '@/utils/supabase/server'

type AdminClient = ReturnType<typeof createAdminClient>

/** Hidden form fields win (they travelled with this very submission); the cookie is the fallback. */
export function readAttribution(formData: FormData, cookieValue: string | null | undefined): Attribution {
  const fromForm: Attribution = {}
  for (const key of ATTRIBUTION_KEYS) {
    const value = sanitizeValue(formData.get(`attr_${key}`))
    if (value) fromForm[key] = value
  }

  return Object.keys(fromForm).length > 0 ? fromForm : parseAttribution(cookieValue)
}

export function attributionAnswerRows(leadId: string, attribution: Attribution) {
  return ATTRIBUTION_KEYS.flatMap((key) => {
    const value = attribution[key]
    return value ? [{ lead_id: leadId, question_key: `attr_${key}`, answer_text: value }] : []
  })
}

/** Upserts the attribution rows for a lead. Never throws. */
export async function saveLeadAttribution(
  admin: AdminClient,
  leadId: string,
  attribution: Attribution,
): Promise<void> {
  const rows = attributionAnswerRows(leadId, attribution)
  if (rows.length === 0) return

  try {
    const { error } = await admin.from('crm_lead_answers').upsert(rows, { onConflict: 'lead_id,question_key' })
    if (error) console.error('saveLeadAttribution error:', error.message)
  } catch (error) {
    console.error('saveLeadAttribution failed:', error)
  }
}
