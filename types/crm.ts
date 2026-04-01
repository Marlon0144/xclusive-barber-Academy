export type LeadSegment = 'curioso' | 'interesado' | 'muy_interesado'

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
  segment: LeadSegment
  rationale: string[]
}
