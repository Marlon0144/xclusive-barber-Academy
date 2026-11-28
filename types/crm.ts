export type FinancialPreparedness = 'yes' | 'payment_plan' | 'not_yet'
export type CareerStartWindow = 'immediately' | 'within_3_months' | 'within_6_months' | 'just_researching'
export type IncomeGoal = '50k_70k' | '70k_100k' | '100k_plus' | 'own_shop'
export type LongTermAmbition =
  | 'senior_barber'
  | 'open_shop'
  | 'personal_brand'
  | 'educator'
  | 'not_sure'
export type DiscoverySource = 'yes' | 'no'
export type CallWillingness = 'yes' | 'maybe' | 'no'

/**
 * Estado de un lead (REQ-DATA-002 — refleja el ENUM nativo `lead_status_type`
 * creado en la migración 20261128_req_data_002_enums.sql).
 * Valores usados por app/dashboard/admin/leads (page + actions).
 */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'

export type LeadAnswers = {
  citySuburb: string
  hasCutHairBefore: DiscoverySource
  mainGoal: string
  consideredOtherPrograms: DiscoverySource
  seriousness: number
  incomeGoal: IncomeGoal
  followsBarberPages: DiscoverySource
  financialPreparedness: FinancialPreparedness
  careerStartWindow: CareerStartWindow
  longTermAmbition: LongTermAmbition
  callWillingness: CallWillingness
}

export type LeadScoringResult = {
  score: number
  rationale: string[]
}

export type PhoneLeadCapturePayload = {
  phone: string
  source: 'landing_phone_capture'
}
