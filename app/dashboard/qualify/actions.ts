'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { computeLeadScore } from '@/utils/crm-scoring'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import type { LeadAnswers } from '@/types/crm'
import { getServerDictionary, getServerLanguage } from '@/lib/i18n/server'

export type QualifyState = {
  error?: string | null
}

const qualifySchema = z.object({
  citySuburb: z.string().trim().min(2).max(120),
  hasCutHairBefore: z.enum(['yes', 'no']),
  mainGoal: z.string().trim().min(3).max(250),
  consideredOtherPrograms: z.enum(['yes', 'no']),
  seriousness: z.coerce.number().int().min(1).max(10),
  incomeGoal: z.enum(['50k_70k', '70k_100k', '100k_plus', 'own_shop']),
  followsBarberPages: z.enum(['yes', 'no']),
  financialPreparedness: z.enum(['yes', 'payment_plan', 'not_yet']),
  careerStartWindow: z.enum(['immediately', 'within_3_months', 'within_6_months', 'just_researching']),
  longTermAmbition: z.enum(['senior_barber', 'open_shop', 'personal_brand', 'educator', 'not_sure']),
  callWillingness: z.enum(['yes', 'maybe', 'no']),
})

export async function submitLeadQualification(
  _prevState: QualifyState,
  formData: FormData,
): Promise<QualifyState> {
  const supabase = await createClient()
  const language = await getServerLanguage()
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.qualifyDashboard

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: messages.mustLogin }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: messages.profileMissing }
  }

  if (profile.role !== 'student') {
    redirect('/dashboard')
  }

  const parsed = qualifySchema.safeParse({
    citySuburb: formData.get('citySuburb'),
    hasCutHairBefore: formData.get('hasCutHairBefore'),
    mainGoal: formData.get('mainGoal'),
    consideredOtherPrograms: formData.get('consideredOtherPrograms'),
    seriousness: formData.get('seriousness'),
    incomeGoal: formData.get('incomeGoal'),
    followsBarberPages: formData.get('followsBarberPages'),
    financialPreparedness: formData.get('financialPreparedness'),
    careerStartWindow: formData.get('careerStartWindow'),
    longTermAmbition: formData.get('longTermAmbition'),
    callWillingness: formData.get('callWillingness'),
  })

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? messages.invalidForm
    return { error: firstIssue }
  }

  const answers = {
    citySuburb: parsed.data.citySuburb,
    hasCutHairBefore: parsed.data.hasCutHairBefore,
    mainGoal: parsed.data.mainGoal,
    consideredOtherPrograms: parsed.data.consideredOtherPrograms,
    seriousness: parsed.data.seriousness,
    incomeGoal: parsed.data.incomeGoal,
    followsBarberPages: parsed.data.followsBarberPages,
    financialPreparedness: parsed.data.financialPreparedness,
    careerStartWindow: parsed.data.careerStartWindow,
    longTermAmbition: parsed.data.longTermAmbition,
    callWillingness: parsed.data.callWillingness,
  } satisfies LeadAnswers

  const scoring = computeLeadScore(answers, language)

  const fullName = profile.full_name?.trim() || user.email?.split('@')[0] || 'Sin nombre'
  const email = user.email || profile.email || ''

  if (!email) {
    return { error: messages.invalidEmail }
  }

  const supabaseAdmin = createAdminClient()
  const now = new Date().toISOString()

  const { data: existingLeadByProfile } = await supabaseAdmin
    .from('crm_leads')
    .select('id, phone_number, stage3_entered_at')
    .eq('profile_id', user.id)
    .maybeSingle()

  const payload = {
    profile_id: user.id,
    full_name: fullName,
    email,
    phone_number: existingLeadByProfile?.phone_number ?? null,
    city_suburb: parsed.data.citySuburb,
    auto_score: scoring.score,
    source: 'apply_wizard',
    status: 'contacted',
    stage3_entered_at: existingLeadByProfile?.stage3_entered_at ?? now,
    qualification_completed_at: now,
    updated_at: now,
  }

  const { data: upsertedLead, error: leadError } = await supabaseAdmin
    .from('crm_leads')
    .upsert(payload, { onConflict: 'profile_id' })
    .select('id')
    .single()

  if (leadError || !upsertedLead) {
    return { error: messages.qualificationSaveError }
  }

  const answersRows = [
    { question_key: 'city_suburb', answer_text: answers.citySuburb },
    { question_key: 'has_cut_hair_before', answer_choice: answers.hasCutHairBefore },
    { question_key: 'main_goal', answer_text: answers.mainGoal },
    { question_key: 'considered_other_programs', answer_choice: answers.consideredOtherPrograms },
    { question_key: 'seriousness', answer_number: answers.seriousness },
    { question_key: 'income_goal', answer_choice: answers.incomeGoal },
    { question_key: 'follows_barber_pages', answer_choice: answers.followsBarberPages },
    { question_key: 'financial_preparedness', answer_choice: answers.financialPreparedness },
    { question_key: 'career_start_window', answer_choice: answers.careerStartWindow },
    { question_key: 'long_term_ambition', answer_choice: answers.longTermAmbition },
    { question_key: 'call_willingness', answer_choice: answers.callWillingness },
  ]

  const answersPayload = answersRows.map((row) => ({
    lead_id: upsertedLead.id,
    ...row,
  }))

  const { error: answersError } = await supabaseAdmin
    .from('crm_lead_answers')
    .upsert(answersPayload, { onConflict: 'lead_id,question_key' })

  if (answersError) {
    return { error: messages.answersPartialError }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/admin/leads')
  redirect('/dashboard')
}
