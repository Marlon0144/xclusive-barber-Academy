import type {
  CallWillingness,
  CareerStartWindow,
  DiscoverySource,
  FinancialPreparedness,
  IncomeGoal,
  LeadAnswers,
  LeadScoringResult,
  LongTermAmbition,
} from '@/types/crm'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { type Language } from '@/lib/i18n/config'

const FINANCIAL_POINTS: Record<FinancialPreparedness, number> = {
  yes: 30,
  payment_plan: 16,
  not_yet: 0,
}

const START_WINDOW_POINTS: Record<CareerStartWindow, number> = {
  immediately: 20,
  within_3_months: 14,
  within_6_months: 8,
  just_researching: 2,
}

const CALL_POINTS: Record<CallWillingness, number> = {
  yes: 15,
  maybe: 7,
  no: 0,
}

const INCOME_POINTS: Record<IncomeGoal, number> = {
  '50k_70k': 4,
  '70k_100k': 6,
  '100k_plus': 8,
  own_shop: 10,
}

const AMBITION_POINTS: Record<LongTermAmbition, number> = {
  senior_barber: 6,
  open_shop: 10,
  personal_brand: 8,
  educator: 9,
  not_sure: 2,
}

const YES_NO_POINTS: Record<DiscoverySource, number> = {
  yes: 5,
  no: 2,
}

const MAX_POINTS = 125

export function computeLeadScore(
  answers: LeadAnswers,
  language: Language = 'es',
): LeadScoringResult {
  const messages = getDictionary(language).actions.crmScoring
  const seriousnessPoints = Math.max(0, Math.min(10, answers.seriousness)) * 3

  const rawPoints =
    seriousnessPoints +
    FINANCIAL_POINTS[answers.financialPreparedness] +
    START_WINDOW_POINTS[answers.careerStartWindow] +
    CALL_POINTS[answers.callWillingness] +
    INCOME_POINTS[answers.incomeGoal] +
    AMBITION_POINTS[answers.longTermAmbition] +
    YES_NO_POINTS[answers.hasCutHairBefore] +
    YES_NO_POINTS[answers.consideredOtherPrograms] +
    YES_NO_POINTS[answers.followsBarberPages]

  const score = Math.round((rawPoints / MAX_POINTS) * 100)

  const rationale: string[] = []
  if (answers.financialPreparedness === 'yes') rationale.push(messages.readyToInvest)
  if (answers.careerStartWindow === 'immediately') rationale.push(messages.startImmediately)
  if (answers.callWillingness === 'yes') rationale.push(messages.callAvailable)
  if (answers.longTermAmbition === 'open_shop') rationale.push(messages.ownBusinessGoal)

  return { score, rationale }
}
