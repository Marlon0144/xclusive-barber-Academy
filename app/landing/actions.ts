'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createAdminClient } from '@/utils/supabase/server'
import { normalizePhoneNumber } from '@/utils/phone'
import { getServerDictionary } from '@/lib/i18n/server'

export type CapturePhoneLeadState = {
  error?: string | null
  success?: boolean
}

function buildCapturePhoneSchema(messages: {
  phoneRequired: string
  invalidPhone: string
  invalidCountryCode: string
}) {
  return z.object({
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
  const cookieStore = await cookies()
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.landing
  const capturePhoneSchema = buildCapturePhoneSchema(messages)

  const parsed = capturePhoneSchema.safeParse({
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

  const phoneWithCountryCode = parsed.data.phone.startsWith('+')
    ? parsed.data.phone
    : `${parsed.data.countryCode} ${parsed.data.phone}`

  const normalized = normalizePhoneNumber(phoneWithCountryCode)
  if (!normalized.isValid) {
    return { error: messages.phoneWithCountryCode, success: false }
  }

  const supabaseAdmin = createAdminClient()
  const now = new Date().toISOString()

  const { data: existingLead, error: existingLeadError } = await supabaseAdmin
    .from('crm_leads')
    .select('id, profile_id, stage1_entered_at')
    .eq('phone_number', normalized.value)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existingLeadError) {
    return { error: messages.registerFailed, success: false }
  }

  if (existingLead) {
    const { error: updateError } = await supabaseAdmin
      .from('crm_leads')
      .update({
        source: 'landing_phone_capture',
        status: 'new',
        stage1_entered_at: existingLead.stage1_entered_at ?? now,
        updated_at: now,
      })
      .eq('id', existingLead.id)

    if (updateError) {
      return { error: messages.registerFailed, success: false }
    }

    cookieStore.set('tracked_lead_phone', normalized.value, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    })

    revalidatePath('/')
    return { success: true, error: null }
  }

  const { error: insertError } = await supabaseAdmin.from('crm_leads').insert({
    full_name: null,
    email: null,
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
      return {
        error: messages.duplicatePhone,
        success: false,
      }
    }

    return { error: messages.registerFailed, success: false }
  }

  cookieStore.set('tracked_lead_phone', normalized.value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  })

  revalidatePath('/')
  return { success: true, error: null }
}
