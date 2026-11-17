'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { submitPublicLeadQualification, type QualifyState } from './actions'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { classifyContactLink } from '@/lib/analytics/contact-links'
import { gtagEventThen } from '@/lib/analytics/gtag'
import type { Dictionary } from '@/lib/i18n/dictionaries'

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

function buildSteps(text: Dictionary['qualifyForm']): Step[] {
  return [
    {
      key: 'citySuburb',
      indexLabel: '1',
      title: text.steps.citySuburb,
      type: 'text',
    },
    {
      key: 'hasCutHairBefore',
      indexLabel: '2',
      title: text.steps.hasCutHairBefore,
      type: 'choice',
      options: [
        { value: 'yes', label: text.options.yes, badge: 'Y' },
        { value: 'no', label: text.options.no, badge: 'N' },
      ],
    },
    {
      key: 'mainGoal',
      indexLabel: '3',
      title: text.steps.mainGoal,
      type: 'text',
    },
    {
      key: 'consideredOtherPrograms',
      indexLabel: '4',
      title: text.steps.consideredOtherPrograms,
      type: 'choice',
      options: [
        { value: 'yes', label: text.options.yes, badge: 'Y' },
        { value: 'no', label: text.options.no, badge: 'N' },
      ],
    },
    {
      key: 'seriousness',
      indexLabel: '5',
      title: text.steps.seriousness,
      hint: text.hintSeriousness,
      type: 'scale',
    },
    {
      key: 'incomeGoal',
      indexLabel: '6',
      title: text.steps.incomeGoal,
      type: 'choice',
      options: [
        { value: '50k_70k', label: text.options.income50to70, badge: 'A' },
        { value: '70k_100k', label: text.options.income70to100, badge: 'B' },
        { value: '100k_plus', label: text.options.income100plus, badge: 'C' },
        { value: 'own_shop', label: text.options.ownShop, badge: 'D' },
      ],
    },
    {
      key: 'followsBarberPages',
      indexLabel: '7',
      title: text.steps.followsBarberPages,
      type: 'choice',
      options: [
        { value: 'yes', label: text.options.yes, badge: 'Y' },
        { value: 'no', label: text.options.no, badge: 'N' },
      ],
    },
    {
      key: 'financialPreparedness',
      indexLabel: '8',
      title: text.steps.financialPreparedness,
      type: 'choice',
      options: [
        { value: 'yes', label: text.options.yes, badge: 'A' },
        { value: 'payment_plan', label: text.options.needPaymentPlan, badge: 'B' },
        { value: 'not_yet', label: text.options.notYet, badge: 'C' },
      ],
    },
    {
      key: 'careerStartWindow',
      indexLabel: '9',
      title: text.steps.careerStartWindow,
      type: 'choice',
      options: [
        { value: 'immediately', label: text.options.immediately, badge: 'A' },
        { value: 'within_3_months', label: text.options.within3Months, badge: 'B' },
        { value: 'within_6_months', label: text.options.within6Months, badge: 'C' },
        { value: 'just_researching', label: text.options.researching, badge: 'D' },
      ],
    },
    {
      key: 'longTermAmbition',
      indexLabel: '10',
      title: text.steps.longTermAmbition,
      type: 'choice',
      options: [
        { value: 'senior_barber', label: text.options.seniorBarber, badge: 'A' },
        { value: 'open_shop', label: text.options.openShop, badge: 'B' },
        { value: 'personal_brand', label: text.options.personalBrand, badge: 'C' },
        { value: 'educator', label: text.options.educator, badge: 'D' },
        { value: 'not_sure', label: text.options.notSure, badge: 'E' },
      ],
    },
    {
      key: 'callWillingness',
      indexLabel: '11',
      title: text.steps.callWillingness,
      type: 'choice',
      options: [
        { value: 'yes', label: text.options.yes, badge: 'A' },
        { value: 'maybe', label: text.options.maybe, badge: 'B' },
        { value: 'no', label: text.options.no, badge: 'C' },
      ],
    },
  ]
}

function SubmitButton({ disabled, busy }: { disabled: boolean; busy: boolean }) {
  const { pending } = useFormStatus()
  const { dictionary } = useLanguage()
  const text = dictionary.qualifyForm

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full h-12 rounded-sm bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.18em] text-xs hover:bg-[#c2b9a5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending || busy ? text.sending : text.finish}
    </button>
  )
}

function validateStep(step: Step, value: string, text: Dictionary['qualifyForm']): string | null {
  const clean = value.trim()

  if (!clean) return text.requiredQuestion

  if (step.key === 'seriousness') {
    const numeric = Number(clean)
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > 10) {
      return text.seriousnessRange
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
  const searchParams = useSearchParams()
  const [state, action] = useActionState(submitPublicLeadQualification, initialState)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS)
  const [localError, setLocalError] = useState<string | null>(null)
  const { dictionary } = useLanguage()
  const text = dictionary.qualifyForm
  const steps = useMemo(() => buildSteps(text), [text])
  const selectedPlan = searchParams.get('plan') ?? ''

  // The action succeeded: it hands back the WhatsApp URL instead of redirecting server-side so
  // the conversion can be reported before the page is unloaded (see QualifyState).
  const redirectUrl = state.redirectUrl
  const redirecting = Boolean(redirectUrl)
  const redirectHandledRef = useRef(false)

  useEffect(() => {
    if (!redirectUrl || redirectHandledRef.current) return
    // Defense in depth: the URL is built server-side, but never send the browser anywhere except WhatsApp.
    if (classifyContactLink(redirectUrl)?.kind !== 'whatsapp') return

    redirectHandledRef.current = true
    gtagEventThen(
      'academy_apply_submit',
      { form: 'qualify', programa: state.programa },
      () => window.location.assign(redirectUrl),
    )
  }, [redirectUrl, state.programa])

  useEffect(() => {
    // Coming back from WhatsApp with the browser's Back button can restore this page from the
    // back/forward cache with the success state (and a disabled button) intact — start fresh.
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted && redirectHandledRef.current) window.location.reload()
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const currentStep = steps[stepIndex]
  const currentValue = answers[currentStep.key]
  const isLastStep = stepIndex === steps.length - 1
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100)

  function updateAnswer(key: AnswerKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setLocalError(null)
  }

  function handleNext() {
    const error = validateStep(currentStep, currentValue, text)
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
          placeholder={text.answerPlaceholder}
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
      <input type="hidden" name="selectedPlan" value={selectedPlan} />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400">
          <span>
            {text.stepPrefix} {stepIndex + 1} / {steps.length}
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
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{currentStep.indexLabel}</p>
          <h3 className="text-3xl md:text-4xl font-semibold leading-tight text-zinc-100">{currentStep.title}</h3>
          {currentStep.hint && <p className="text-sm text-zinc-400">{currentStep.hint}</p>}

          <div className="pt-2">{renderStepControl()}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="h-12 min-w-12 px-3 rounded-sm border border-white/15 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            aria-label={text.back}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {isLastStep ? (
            <SubmitButton
              disabled={Boolean(validateStep(currentStep, currentValue, text)) || redirecting}
              busy={redirecting}
            />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full h-12 rounded-sm bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.18em] text-xs hover:bg-[#c2b9a5] transition-colors inline-flex items-center justify-center gap-2"
            >
              {text.continue}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
