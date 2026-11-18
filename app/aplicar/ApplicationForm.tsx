'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { AttributionFields } from '@/components/analytics/AttributionFields'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { getApplicationCopy } from '@/lib/content/application'
import { PENDING_CONVERSION_KEY } from '@/lib/analytics/pending-conversion'
import { localizedPath } from '@/lib/i18n/routes'
import { submitAcademyApplication, type ApplicationState } from './actions'

const initialState: ApplicationState = { error: null }

const fieldClass =
  'h-12 w-full rounded-sm border border-white/20 bg-black/50 px-4 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-[#d3cbba] focus:ring-2 focus:ring-[#d3cbba]/20 focus:outline-none transition-all'
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9ea79f]'

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-sm bg-[#d3cbba] text-xs font-bold uppercase tracking-[0.18em] text-[#1e3a27] transition-colors hover:bg-[#c2b9a5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

/**
 * Short application form (7 visible fields + consent). On success it parks the
 * conversion payload in sessionStorage and moves to the thank-you page, which
 * reports the conversion once (see ThankYouConversion). Reporting there — not
 * here — means a reload of the thank-you page can never count it twice.
 */
export default function ApplicationForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const copy = getApplicationCopy(language)
  const [state, formAction] = useActionState(submitAcademyApplication, initialState)
  const handledRef = useRef(false)
  // React 19 resets uncontrolled forms after every action; the action echoes the values back on errors.
  const values = state.values ?? {}

  useEffect(() => {
    if (!state.ok || handledRef.current) return
    handledRef.current = true

    if (state.leadId) {
      try {
        window.sessionStorage.setItem(
          PENDING_CONVERSION_KEY,
          JSON.stringify({
            transactionId: state.leadId,
            form: 'aplicar',
            programa: state.programa,
            userData: state.userData,
          }),
        )
      } catch {
        // Storage unavailable: the visitor still reaches the thank-you page, just without a conversion.
      }
    }

    router.push(localizedPath('/aplicar/gracias', language))
  }, [state, language, router])

  return (
    <form action={formAction} className="space-y-5" noValidate={false}>
      <AttributionFields />

      {/* Honeypot: invisible to people, irresistible to bots. Must stay empty. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.error ? (
        <div role="alert" className="flex items-start gap-3 border-l-2 border-red-500/50 bg-red-950/20 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-xs leading-relaxed tracking-wide text-red-200/80">{state.error}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="apply-fullName" className={labelClass}>
          {copy.form.fullName}
        </label>
        <input id="apply-fullName" name="fullName" type="text" required autoComplete="name" defaultValue={values.fullName ?? ''} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="apply-email" className={labelClass}>
          {copy.form.email}
        </label>
        <input id="apply-email" name="email" type="email" required autoComplete="email" defaultValue={values.email ?? ''} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="apply-whatsapp" className={labelClass}>
          {copy.form.whatsapp}
        </label>
        <input
          id="apply-whatsapp"
          name="whatsapp"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="0412 345 678"
          defaultValue={values.whatsapp ?? ''}
          aria-describedby="apply-whatsapp-hint"
          className={fieldClass}
        />
        <p id="apply-whatsapp-hint" className="mt-1 text-xs text-zinc-500">
          {copy.form.whatsappHint}
        </p>
      </div>

      <div>
        <label htmlFor="apply-course" className={labelClass}>
          {copy.form.course}
        </label>
        <select key={`course-${state.retryId ?? 'initial'}`} id="apply-course" name="course" required defaultValue={values.course ?? ''} className={fieldClass}>
          <option value="" disabled>
            {copy.form.coursePlaceholder}
          </option>
          {copy.form.courseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="apply-experience" className={labelClass}>
          {copy.form.experience}
        </label>
        <select key={`experience-${state.retryId ?? 'initial'}`} id="apply-experience" name="experience" required defaultValue={values.experience ?? ''} className={fieldClass}>
          <option value="" disabled>
            {copy.form.experiencePlaceholder}
          </option>
          {copy.form.experienceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="apply-suburb" className={labelClass}>
          {copy.form.suburb}
        </label>
        <input id="apply-suburb" name="suburb" type="text" required autoComplete="address-level2" defaultValue={values.suburb ?? ''} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="apply-howHeard" className={labelClass}>
          {copy.form.howHeard}
        </label>
        <select key={`howHeard-${state.retryId ?? 'initial'}`} id="apply-howHeard" name="howHeard" required defaultValue={values.howHeard ?? ''} className={fieldClass}>
          <option value="" disabled>
            {copy.form.howHeardPlaceholder}
          </option>
          {copy.form.howHeardOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-zinc-400">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked={values.consent === 'on'}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#d3cbba]"
        />
        <span>{copy.form.consent}</span>
      </label>

      <SubmitButton label={copy.form.submit} pendingLabel={copy.form.submitting} />
    </form>
  )
}
