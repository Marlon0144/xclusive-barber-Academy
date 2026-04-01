'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { computeLeadScore } from '@/utils/crm-scoring'
import { createAdminClient } from '@/utils/supabase/server'
import type { LeadAnswers } from '@/types/crm'

export type QualifyState = {
  error?: string | null
}

const WHATSAPP_DEAL_NUMBER = '61413891977'
const WHATSAPP_DEAL_MESSAGE = 'Estoy interesado en ser parte de la academia, quiero inscribirme ya'

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

export async function submitPublicLeadQualification(
  _prevState: QualifyState,
  formData: FormData,
): Promise<QualifyState> {
  const cookieStore = await cookies()
  const trackedPhone = cookieStore.get('tracked_lead_phone')?.value ?? null

  if (!trackedPhone) {
    return { error: 'Primero deja tu telefono en la landing para iniciar el proceso.' }
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
    const firstIssue = parsed.error.issues[0]?.message ?? 'Formulario invalido.'
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

  const scoring = computeLeadScore(answers)
  const supabaseAdmin = createAdminClient()
  const now = new Date().toISOString()

  const { data: existingLeadByPhone } = await supabaseAdmin
    .from('crm_leads')
    .select('id, stage3_entered_at')
    .eq('phone_number', trackedPhone)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let leadId = existingLeadByPhone?.id ?? null

  if (!leadId) {
    const { data: insertedLead, error: insertLeadError } = await supabaseAdmin
      .from('crm_leads')
      .insert({
        phone_number: trackedPhone,
        source: 'apply_wizard',
        status: 'contacted',
        auto_score: scoring.score,
        city_suburb: parsed.data.citySuburb,
        stage3_entered_at: now,
        qualification_completed_at: now,
        updated_at: now,
      })
      .select('id')
      .single()

    if (insertLeadError || !insertedLead) {
      return { error: 'No pudimos guardar tu calificacion. Intenta nuevamente.' }
    }

    leadId = insertedLead.id
  } else {
    const { error: updateLeadError } = await supabaseAdmin
      .from('crm_leads')
      .update({
        city_suburb: parsed.data.citySuburb,
        auto_score: scoring.score,
        source: 'apply_wizard',
        status: 'contacted',
        stage3_entered_at: existingLeadByPhone?.stage3_entered_at ?? now,
        qualification_completed_at: now,
        updated_at: now,
      })
      .eq('id', leadId)

    if (updateLeadError) {
      return { error: 'No pudimos guardar tu calificacion. Intenta nuevamente.' }
    }
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
    lead_id: leadId,
    ...row,
  }))

  const { error: answersError } = await supabaseAdmin
    .from('crm_lead_answers')
    .upsert(answersPayload, { onConflict: 'lead_id,question_key' })

  if (answersError) {
    return { error: 'Guardamos parte de tu informacion, pero hubo un error en respuestas.' }
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_DEAL_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEAL_MESSAGE)}`
  redirect(whatsappUrl)
}
