'use client'

import { useActionState, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { submitLeadQualification, type QualifyState } from './actions'

const initialState: QualifyState = {
  error: null,
}

type AnswerKey =
  | 'citySuburb'
  | 'hasCutHairBefore'
  | 'mainGoal'
  | 'consideredOtherPrograms'
  | 'seriousness'
  | 'incomeGoal'
  | 'followsBarberPages'
  | 'financialPreparedness'
  | 'careerStartWindow'
  | 'longTermAmbition'
  | 'callWillingness'

type Answers = Record<AnswerKey, string>

type Step = {
  key: AnswerKey
  indexLabel: string
  title: string
  hint?: string
  type: 'text' | 'choice' | 'scale'
  options?: Array<{ value: string; label: string; badge?: string }>
}

const steps: Step[] = [
  {
    key: 'citySuburb',
    indexLabel: '1',
    title: 'City/Suburb you currently live in?*',
    type: 'text',
  },
  {
    key: 'hasCutHairBefore',
    indexLabel: '2',
    title: 'Have you ever cut hair before?*',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes', badge: 'Y' },
      { value: 'no', label: 'No', badge: 'N' },
    ],
  },
  {
    key: 'mainGoal',
    indexLabel: '3',
    title: 'What is your main goal after completing the academy?*',
    type: 'text',
  },
  {
    key: 'consideredOtherPrograms',
    indexLabel: '4',
    title: 'Have you considered other barber programs before applying?*',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes', badge: 'Y' },
      { value: 'no', label: 'No', badge: 'N' },
    ],
  },
  {
    key: 'seriousness',
    indexLabel: '5',
    title: 'How serious are you about becoming a barber?*',
    hint: 'Selecciona un numero del 1 al 10.',
    type: 'scale',
  },
  {
    key: 'incomeGoal',
    indexLabel: '6',
    title: 'What income would you like to be earning as a barber?*',
    type: 'choice',
    options: [
      { value: '50k_70k', label: '$50k - $70k', badge: 'A' },
      { value: '70k_100k', label: '$70k - $100k', badge: 'B' },
      { value: '100k_plus', label: '$100k+', badge: 'C' },
      { value: 'own_shop', label: 'Own my own shop', badge: 'D' },
    ],
  },
  {
    key: 'followsBarberPages',
    indexLabel: '7',
    title: 'Do you currently follow barbers or barbering pages online?*',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes', badge: 'Y' },
      { value: 'no', label: 'No', badge: 'N' },
    ],
  },
  {
    key: 'financialPreparedness',
    indexLabel: '8',
    title: 'Are you financially prepared to invest in your education?*',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes', badge: 'A' },
      { value: 'payment_plan', label: 'I need payment plan option', badge: 'B' },
      { value: 'not_yet', label: 'Not yet', badge: 'C' },
    ],
  },
  {
    key: 'careerStartWindow',
    indexLabel: '9',
    title: 'When are you looking to start your barber career?*',
    type: 'choice',
    options: [
      { value: 'immediately', label: 'Immediately', badge: 'A' },
      { value: 'within_3_months', label: 'Within 3 months', badge: 'B' },
      { value: 'within_6_months', label: 'Within 6 months', badge: 'C' },
      { value: 'just_researching', label: 'Just researching', badge: 'D' },
    ],
  },
  {
    key: 'longTermAmbition',
    indexLabel: '10',
    title: 'Do you have long-term ambitions in the barber industry?*',
    type: 'choice',
    options: [
      { value: 'senior_barber', label: 'Become a senior barber', badge: 'A' },
      { value: 'open_shop', label: 'Open my own shop', badge: 'B' },
      { value: 'personal_brand', label: 'Build a personal brand', badge: 'C' },
      { value: 'educator', label: 'Become an educator', badge: 'D' },
      { value: 'not_sure', label: 'Not sure yet', badge: 'E' },
    ],
  },
  {
    key: 'callWillingness',
    indexLabel: '11',
    title: 'If accepted, are you willing to jump on a short call with our team?*',
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes', badge: 'A' },
      { value: 'maybe', label: 'Maybe', badge: 'B' },
      { value: 'no', label: 'No', badge: 'C' },
    ],
  },
]

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full h-12 rounded-sm bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.18em] text-xs hover:bg-[#c2b9a5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'GUARDANDO...' : 'FINALIZAR CALIFICACION'}
    </button>
  )
}

function validateStep(step: Step, value: string): string | null {
  const clean = value.trim()

  if (!clean) return 'Esta pregunta es obligatoria.'

  if (step.key === 'seriousness') {
    const numeric = Number(clean)
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > 10) {
      return 'Selecciona un valor entre 1 y 10.'
    }
  }

  return null
}

const INITIAL_ANSWERS: Answers = {
  citySuburb: '',
  hasCutHairBefore: '',
  mainGoal: '',
  consideredOtherPrograms: '',
  seriousness: '',
  incomeGoal: '',
  followsBarberPages: '',
  financialPreparedness: '',
  careerStartWindow: '',
  longTermAmbition: '',
  callWillingness: '',
}

export default function QualifyForm() {
  const [state, action] = useActionState(submitLeadQualification, initialState)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS)
  const [localError, setLocalError] = useState<string | null>(null)

  const currentStep = steps[stepIndex]
  const currentValue = answers[currentStep.key]
  const isLastStep = stepIndex === steps.length - 1
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex],
  )

  function updateAnswer(key: AnswerKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setLocalError(null)
  }

  function handleNext() {
    const error = validateStep(currentStep, currentValue)
    if (error) {
      setLocalError(error)
      return
    }

    if (!isLastStep) {
      setStepIndex((prev) => prev + 1)
      setLocalError(null)
    }
  }

  function handleBack() {
    if (stepIndex === 0) return
    setStepIndex((prev) => prev - 1)
    setLocalError(null)
  }

  function renderStepControl() {
    if (currentStep.type === 'text') {
      return (
        <input
          value={currentValue}
          onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Type your answer here..."
          className="h-14 w-full rounded-sm border border-white/20 bg-black/50 px-4 text-xl md:text-2xl text-zinc-100 placeholder:text-zinc-500 focus:border-[#d3cbba] focus:ring-2 focus:ring-[#d3cbba]/20 focus:outline-none transition-all"
        />
      )
    }

    if (currentStep.type === 'scale') {
      return (
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
          {Array.from({ length: 10 }, (_, index) => {
            const value = String(index + 1)
            const selected = currentValue === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateAnswer(currentStep.key, value)}
                className={`h-14 rounded-sm border text-lg font-semibold transition-all ${
                  selected
                    ? 'border-[#d3cbba] bg-[#d3cbba]/10 text-[#d3cbba]'
                    : 'border-white/15 bg-black/40 text-zinc-300 hover:border-white/30'
                }`}
              >
                {value}
              </button>
            )
          })}
        </div>
      )
    }

    return (
      <div className="space-y-2 md:space-y-3">
        {currentStep.options?.map((option) => {
          const selected = currentValue === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateAnswer(currentStep.key, option.value)}
              className={`w-full min-h-14 px-4 py-3 rounded-sm border flex items-center gap-3 text-left transition-all ${
                selected
                  ? 'border-[#d3cbba] bg-[#d3cbba]/10 text-zinc-100'
                  : 'border-white/15 bg-black/40 text-zinc-300 hover:border-white/30'
              }`}
            >
              {option.badge && (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-white/25 text-xs uppercase tracking-[0.08em]">
                  {option.badge}
                </span>
              )}
              <span className="text-base md:text-lg font-medium">{option.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="citySuburb" value={answers.citySuburb} />
      <input type="hidden" name="hasCutHairBefore" value={answers.hasCutHairBefore} />
      <input type="hidden" name="mainGoal" value={answers.mainGoal} />
      <input type="hidden" name="consideredOtherPrograms" value={answers.consideredOtherPrograms} />
      <input type="hidden" name="seriousness" value={answers.seriousness} />
      <input type="hidden" name="incomeGoal" value={answers.incomeGoal} />
      <input type="hidden" name="followsBarberPages" value={answers.followsBarberPages} />
      <input type="hidden" name="financialPreparedness" value={answers.financialPreparedness} />
      <input type="hidden" name="careerStartWindow" value={answers.careerStartWindow} />
      <input type="hidden" name="longTermAmbition" value={answers.longTermAmbition} />
      <input type="hidden" name="callWillingness" value={answers.callWillingness} />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400">
          <span>
            Paso {stepIndex + 1} / {steps.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#d3cbba] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {(state?.error || localError) && (
        <div className="bg-red-950/20 border-l-2 border-red-500/50 p-4 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-200/80 text-xs leading-relaxed tracking-wide">{localError ?? state?.error}</p>
        </div>
      )}

      <div className="min-h-[320px] md:min-h-[360px] flex flex-col justify-between gap-8">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {currentStep.indexLabel}
          </p>
          <h3 className="text-3xl md:text-4xl font-semibold leading-tight text-zinc-100">
            {currentStep.title}
          </h3>
          {currentStep.hint && <p className="text-sm text-zinc-400">{currentStep.hint}</p>}

          <div className="pt-2">{renderStepControl()}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="h-12 min-w-12 px-3 rounded-sm border border-white/15 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {isLastStep ? (
            <SubmitButton disabled={Boolean(validateStep(currentStep, currentValue))} />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full h-12 rounded-sm bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.18em] text-xs hover:bg-[#c2b9a5] transition-colors inline-flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
