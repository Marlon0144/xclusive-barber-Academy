'use server'

import { z } from 'zod'
import { createAdminClient } from '@/utils/supabase/server'
import { normalizePhoneNumber } from '@/utils/phone'
import { getServerDictionary } from '@/lib/i18n/server'
import { checkActionRateLimit } from '@/lib/rate-limit'

export type CapturePhoneLeadState = {
  error?: string | null
  success?: boolean
  /** Teléfono normalizado — el cliente lo usa para setear la cookie de tracking. */
  phone?: string | null
}

function buildCapturePhoneSchema(messages: {
  invalidEmail: string
  phoneRequired: string
  invalidPhone: string
  invalidCountryCode: string
}) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.invalidEmail)
      .email(messages.invalidEmail)
      .max(255, messages.invalidEmail),
    phone: z.string().trim().min(8, messages.phoneRequired).max(25, messages.invalidPhone),
    countryCode: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{0,3}$/, messages.invalidCountryCode)
      .default('+61'),
    company: z.string().optional(),
  })
}

export async function capturePhoneLead(
  _prevState: CapturePhoneLeadState,
  formData: FormData,
): Promise<CapturePhoneLeadState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.landing
  const capturePhoneSchema = buildCapturePhoneSchema(messages)

  // Public, unauthenticated form — minimal abuse protection before scaling ad spend.
  const rateLimit = await checkActionRateLimit('capturePhoneLead', 5, 10 * 60 * 1000)
  if (!rateLimit.allowed) {
    return { error: messages.rateLimited, success: false }
  }

  const parsed = capturePhoneSchema.safeParse({
    email: formData.get('email'),
    phone: formData.get('phone'),
    countryCode: formData.get('countryCode') ?? '+61',
    company: formData.get('company') ?? '',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? messages.invalidData, success: false }
  }

  // Honeypot anti-spam: bots suelen completar este campo oculto.
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return { success: true, error: null }
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase()

  const phoneWithCountryCode = parsed.data.phone.startsWith('+')
    ? parsed.data.phone
    : `${parsed.data.countryCode} ${parsed.data.phone}`

  const normalized = normalizePhoneNumber(phoneWithCountryCode)
  if (!normalized.isValid) {
    return { error: messages.phoneWithCountryCode, success: false }
  }

  const supabaseAdmin = createAdminClient()
  const now = new Date().toISOString()

  const { data: phoneLead, error: phoneLeadError } = await supabaseAdmin
    .from('crm_leads')
    .select('id, email, stage1_entered_at')
    .eq('phone_number', normalized.value)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (phoneLeadError) {
    return { error: messages.registerFailed, success: false }
  }

  if (phoneLead) {
    const { data: emailConflict, error: emailConflictError } = await supabaseAdmin
      .from('crm_leads')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (emailConflictError) {
      return { error: messages.registerFailed, success: false }
    }

    if (emailConflict && emailConflict.id !== phoneLead.id) {
      return { error: messages.duplicateEmail, success: false }
    }

    const { error: updateError } = await supabaseAdmin
      .from('crm_leads')
      .update({
        email: normalizedEmail,
        source: 'landing_phone_capture',
        status: 'new',
        stage1_entered_at: phoneLead.stage1_entered_at ?? now,
        updated_at: now,
      })
      .eq('id', phoneLead.id)

    if (updateError) {
      return { error: messages.registerFailed, success: false }
    }

    return { success: true, error: null, phone: normalized.value }
  }

  const { data: emailLead, error: emailLeadError } = await supabaseAdmin
    .from('crm_leads')
    .select('id, phone_number, stage1_entered_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (emailLeadError) {
    return { error: messages.registerFailed, success: false }
  }

  if (emailLead) {
    if (emailLead.phone_number && emailLead.phone_number !== normalized.value) {
      return { error: messages.duplicatePhone, success: false }
    }

    const { error: updateError } = await supabaseAdmin
      .from('crm_leads')
      .update({
        phone_number: normalized.value,
        source: 'landing_phone_capture',
        status: 'new',
        stage1_entered_at: emailLead.stage1_entered_at ?? now,
        updated_at: now,
      })
      .eq('id', emailLead.id)

    if (updateError) {
      return { error: messages.registerFailed, success: false }
    }

    return { success: true, error: null, phone: normalized.value }
  }

  const { error: insertError } = await supabaseAdmin.from('crm_leads').insert({
    full_name: null,
    email: normalizedEmail,
    phone_number: normalized.value,
    source: 'landing_phone_capture',
    status: 'new',
    stage1_entered_at: now,
    auto_score: 0,
    updated_at: now,
  })

  if (insertError) {
    console.error('capturePhoneLead insertError:', insertError)

    const isNotNullViolation = insertError.code === '23502'
    const isUniqueViolation = insertError.code === '23505'

    if (isNotNullViolation) {
      return {
        error: messages.migrationMissing,
        success: false,
      }
    }

    if (isUniqueViolation) {
      const rawDetails = `${insertError.message ?? ''} ${insertError.details ?? ''}`.toLowerCase()

      if (rawDetails.includes('email')) {
        return {
          error: messages.duplicateEmail,
          success: false,
        }
      }

      return {
        error: messages.duplicatePhone,
        success: false,
      }
    }

    return { error: messages.registerFailed, success: false }
  }

  return { success: true, error: null, phone: normalized.value }
}
