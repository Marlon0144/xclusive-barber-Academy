'use server'

import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { ATTRIBUTION_COOKIE } from '@/lib/analytics/attribution'
import {
  COURSE_CHOICES,
  EXPERIENCE_CHOICES,
  HOW_HEARD_CHOICES,
  getApplicationCopy,
  type CourseChoice,
} from '@/lib/content/application'
import { getServerLanguage } from '@/lib/i18n/server'
import { readAttribution, saveLeadAttribution } from '@/lib/leads/attribution'
import { checkActionRateLimit } from '@/lib/rate-limit'
import { normalizeAuMobile } from '@/lib/validation/au-phone'
import { createAdminClient } from '@/utils/supabase/server'

/** Field values echoed back on errors so the form can refill itself (React 19 resets uncontrolled forms after every action). */
export type ApplicationValues = Partial<
  Record<'fullName' | 'email' | 'whatsapp' | 'course' | 'experience' | 'suburb' | 'howHeard' | 'consent', string>
>

export type ApplicationState = {
  error?: string | null
  /** Set together with `error`: what the visitor typed, so a validation error never costs them their answers. */
  values?: ApplicationValues
  /**
   * New on every failed attempt. <select>s ignore a changed defaultValue after mount, so the form
   * uses this as a React `key` to remount them and show the values echoed back in `values`.
   */
  retryId?: string
  /** True when the form was accepted (also for honeypot hits, which carry no leadId). */
  ok?: boolean
  /** CRM lead id → the conversion's transaction_id. Absent for honeypot hits, so bots never convert. */
  leadId?: string
  /** Program of interest, only when it is one of the four real programs. */
  programa?: Exclude<CourseChoice, 'not_sure'>
  /** The visitor's own contact data, handed back for Google Ads enhanced conversions. */
  userData?: { email: string; phone: string }
}

const PROGRAMS = ['starter', 'profesional', 'elite', 'business'] as const

type ErrorMessages = ReturnType<typeof getApplicationCopy>['errors']

const VALUE_FIELDS = ['fullName', 'email', 'whatsapp', 'course', 'experience', 'suburb', 'howHeard', 'consent'] as const

/** Plain-string copy of the visible fields (length-capped). Never includes attribution or the honeypot. */
function submittedValues(formData: FormData): ApplicationValues {
  const values: ApplicationValues = {}
  for (const field of VALUE_FIELDS) {
    const value = formData.get(field)
    if (typeof value === 'string') values[field] = value.slice(0, 255)
  }
  return values
}

function buildSchema(errors: ErrorMessages) {
  return z.object({
    fullName: z.string().trim().min(2, errors.invalidName).max(120, errors.invalidName),
    email: z.string().trim().email(errors.invalidEmail).max(255, errors.invalidEmail),
    whatsapp: z
      .string()
      .trim()
      .max(30, errors.invalidPhone)
      .refine((value) => normalizeAuMobile(value) !== null, errors.invalidPhone),
    course: z.enum(COURSE_CHOICES, { message: errors.invalidChoice }),
    experience: z.enum(EXPERIENCE_CHOICES, { message: errors.invalidChoice }),
    suburb: z.string().trim().min(2, errors.invalidSuburb).max(120, errors.invalidSuburb),
    howHeard: z.enum(HOW_HEARD_CHOICES, { message: errors.invalidChoice }),
    consent: z.literal('on', { message: errors.consentRequired }),
  })
}

export async function submitAcademyApplication(
  _prevState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const language = await getServerLanguage()
  const errors = getApplicationCopy(language).errors
  // Echoed back with every error below (see ApplicationValues / retryId).
  const retry = { values: submittedValues(formData), retryId: randomUUID() }

  // 1. Honeypot — a real person never sees this field. Pretend success, write nothing, return no
  //    leadId (so no conversion is ever reported for a bot).
  const trap = formData.get('website')
  if (typeof trap === 'string' && trap.trim().length > 0) {
    return { ok: true }
  }

  // 2. Public, unauthenticated form: abuse protection before spending on ads.
  const rateLimit = await checkActionRateLimit('submitAcademyApplication', 5, 10 * 60 * 1000)
  if (!rateLimit.allowed) {
    return { error: errors.rateLimited, ...retry }
  }

  // 3. Validate.
  const parsed = buildSchema(errors).safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    whatsapp: formData.get('whatsapp'),
    course: formData.get('course'),
    experience: formData.get('experience'),
    suburb: formData.get('suburb'),
    howHeard: formData.get('howHeard'),
    consent: formData.get('consent'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? errors.invalidChoice, ...retry }
  }

  const { fullName, course, experience, suburb, howHeard } = parsed.data
  const email = parsed.data.email.toLowerCase()
  const phone = normalizeAuMobile(parsed.data.whatsapp)
  if (!phone) return { error: errors.invalidPhone, ...retry }

  // 4. Save: reuse the lead if this phone/email already exists (the landing capture creates one),
  //    otherwise create it.
  const admin = createAdminClient()
  const now = new Date().toISOString()

  type LeadRow = {
    id: string
    full_name: string | null
    email: string | null
    phone_number: string | null
    city_suburb: string | null
    stage1_entered_at: string | null
  }
  const leadColumns = 'id, full_name, email, phone_number, city_suburb, stage1_entered_at'

  const findLead = async (): Promise<LeadRow | null> => {
    const { data: byPhone } = await admin
      .from('crm_leads')
      .select(leadColumns)
      .eq('phone_number', phone)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (byPhone) return byPhone as LeadRow

    const { data: byEmail } = await admin.from('crm_leads').select(leadColumns).eq('email', email).maybeSingle()
    return (byEmail as LeadRow | null) ?? null
  }

  let lead = await findLead()
  let leadId = lead?.id ?? null

  if (lead) {
    // Fill what is missing; never overwrite identity data the lead already has.
    const { error: updateError } = await admin
      .from('crm_leads')
      .update({
        full_name: lead.full_name ?? fullName,
        city_suburb: lead.city_suburb ?? suburb,
        phone_number: lead.phone_number ?? phone,
        stage1_entered_at: lead.stage1_entered_at ?? now,
        updated_at: now,
      })
      .eq('id', lead.id)
    if (updateError) {
      console.error('submitAcademyApplication update error:', updateError.message)
      return { error: errors.saveFailed, ...retry }
    }

    if (!lead.email) {
      // Best-effort: the email column is UNIQUE, so it can legitimately conflict with another lead.
      await admin.from('crm_leads').update({ email }).eq('id', lead.id)
    }
  } else {
    const { data: inserted, error: insertError } = await admin
      .from('crm_leads')
      .insert({
        full_name: fullName,
        email,
        phone_number: phone,
        city_suburb: suburb,
        source: 'aplicar_form',
        status: 'new',
        stage1_entered_at: now,
        auto_score: 0,
        updated_at: now,
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      // Two simultaneous submissions can race on the UNIQUE phone/email: use the winner's row.
      lead = insertError?.code === '23505' ? await findLead() : null
      leadId = lead?.id ?? null
      if (!leadId) {
        console.error('submitAcademyApplication insert error:', insertError?.message)
        return { error: errors.saveFailed, ...retry }
      }
    } else {
      leadId = inserted.id
    }
  }

  if (!leadId) return { error: errors.saveFailed, ...retry }

  // 5. Answers (reuses the key `selected_plan` that the /qualify wizard already writes).
  const answers = [
    { lead_id: leadId, question_key: 'course_interest', answer_choice: course },
    { lead_id: leadId, question_key: 'experience_level', answer_choice: experience },
    { lead_id: leadId, question_key: 'how_heard', answer_choice: howHeard },
    { lead_id: leadId, question_key: 'privacy_consent', answer_choice: 'accepted' },
    { lead_id: leadId, question_key: 'application_submitted_at', answer_text: now },
    ...((PROGRAMS as readonly string[]).includes(course)
      ? [{ lead_id: leadId, question_key: 'selected_plan', answer_choice: course }]
      : []),
  ]
  const { error: answersError } = await admin
    .from('crm_lead_answers')
    .upsert(answers, { onConflict: 'lead_id,question_key' })
  if (answersError) {
    // The lead itself is saved; losing the extra answers must not lose the lead.
    console.error('submitAcademyApplication answers error:', answersError.message)
  }

  // 6. Where did this lead come from? (gclid / UTM / landing page / referrer) — best-effort.
  const cookieStore = await cookies()
  await saveLeadAttribution(admin, leadId, readAttribution(formData, cookieStore.get(ATTRIBUTION_COOKIE)?.value))

  return {
    ok: true,
    leadId,
    programa: (PROGRAMS as readonly string[]).includes(course) ? (course as ApplicationState['programa']) : undefined,
    userData: { email, phone },
  }
}
