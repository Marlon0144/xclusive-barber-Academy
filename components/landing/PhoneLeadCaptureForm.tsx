'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { capturePhoneLead, type CapturePhoneLeadState } from '@/app/landing/actions'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const initialState: CapturePhoneLeadState = {
  error: null,
  success: false,
}

type PhoneLeadCaptureFormProps = {
  submitLabel?: string
  className?: string
}

const COUNTRY_OPTIONS = [
  { value: '+61', label: 'AU +61' },
  { value: '+57', label: 'CO +57' },
  { value: '+52', label: 'MX +52' },
  { value: '+34', label: 'ES +34' },
  { value: '+1', label: 'US +1' },
  { value: '+54', label: 'AR +54' },
  { value: '+56', label: 'CL +56' },
]

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 min-w-[170px] rounded-sm bg-[#1c3123] px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d3cbba] shadow-none hover:bg-[#1c3123] hover:shadow-none"
    >
      {pending ? pendingLabel : label}
    </Button>
  )
}

export default function PhoneLeadCaptureForm({
  submitLabel,
  className,
}: PhoneLeadCaptureFormProps) {
  const { dictionary } = useLanguage()
  const phoneCapture = dictionary.landing.phoneCapture

  const [state, formAction] = useActionState(capturePhoneLead, initialState)
  const resolvedSubmitLabel = submitLabel ?? phoneCapture.defaultSubmit

  useEffect(() => {
    if (!state?.success) return
    window.dispatchEvent(new CustomEvent('lead-capture:success'))
  }, [state?.success])

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      <form action={formAction} className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-2">
        <div className="w-full md:w-auto md:min-w-[118px]">
          <label htmlFor="lead-country-code" className="sr-only">
            {phoneCapture.countryCodeLabel}
          </label>
          <select
            id="lead-country-code"
            name="countryCode"
            defaultValue="+61"
            className="h-11 w-full rounded-sm border border-[#d4af37]/30 bg-[#161616] px-2 text-[11px] tracking-[0.06em] text-[#d3cbba]"
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#161616] text-[#d3cbba]">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="lead-phone" className="sr-only">
            {phoneCapture.phoneLabel}
          </label>
          <Input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={phoneCapture.phonePlaceholder}
            className="h-11 rounded-sm border border-[#d4af37]/30 bg-[#161616] px-3 text-[11px] tracking-[0.08em] text-[#d3cbba] placeholder:text-[#d3cbba]/50"
          />
        </div>

        <input
          name="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          className="hidden"
          aria-hidden
        />

        <SubmitButton label={resolvedSubmitLabel} pendingLabel={phoneCapture.pending} />
      </form>

      {state?.error ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-red-300">{state.error}</p>
      ) : null}

      {state?.success ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#d3cbba]">
          {phoneCapture.success}
        </p>
      ) : (
        <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[#d3cbba]/70">
          {phoneCapture.helper}
        </p>
      )}
    </div>
  )
}
