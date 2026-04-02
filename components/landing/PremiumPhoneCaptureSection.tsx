'use client'

import PhoneLeadCaptureForm from '@/components/landing/PhoneLeadCaptureForm'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

type PremiumPhoneCaptureSectionProps = {
  className?: string
  tone?: 'mobile' | 'desktop'
}

export default function PremiumPhoneCaptureSection({
  className,
  tone = 'desktop',
}: PremiumPhoneCaptureSectionProps) {
  const { dictionary } = useLanguage()
  const premiumCapture = dictionary.landing.premiumCapture

  const isMobile = tone === 'mobile'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-sm bg-[#1d1d1d] shadow-[0px_16px_32px_rgba(0,0,0,0.35)]',
        isMobile ? 'px-3 py-3' : 'px-5 py-5 md:px-7 md:py-6',
        className,
      )}
    >
      <div className="relative z-10 space-y-2">
        <p
          className={cn(
            'font-sans uppercase tracking-[0.14em] text-[#FFFF]',
            isMobile ? 'text-[9px]' : 'text-[10px] md:text-[11px]',
          )}
        >
          {premiumCapture.quickContact}
        </p>

        <h3
          className={cn(
            'font-sans font-semibold text-[#d3cbba] leading-[1.25]',
            isMobile ? 'text-[10px]' : 'text-xs md:text-sm',
          )}
        >
          {premiumCapture.heading}
        </h3>

        <PhoneLeadCaptureForm />
      </div>
    </div>
  )
}
