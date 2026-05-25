'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import PhoneLeadCaptureForm from '@/components/landing/PhoneLeadCaptureForm'
import { useLanguage } from '@/components/i18n/LanguageProvider'

type LandingFlowGateProps = {
  children: ReactNode
  className?: string
  forceUnlocked?: boolean
}

const STORAGE_KEY = 'landing_phone_captured_v2'
const LEGACY_STORAGE_KEY = 'landing_phone_captured_v1'
const CAPTURE_EVENT = 'lead-capture:success'

export default function LandingFlowGate({ children, className, forceUnlocked = false }: LandingFlowGateProps) {
  const { dictionary } = useLanguage()
  const flowGate = dictionary.landing.flowGate

  // Start locked (matches server render → no hydration mismatch).
  // On mount we immediately check localStorage to avoid a visible flash.
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    // 1. Check if already unlocked from a previous visit
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') {
        setTimeout(() => {
          setIsLocked(false)
        }, 0)
        return
      }
    } catch {
      // localStorage unavailable — keep gated
    }

    // 2. Listen for the capture success event fired by PhoneLeadCaptureForm
    function handleCaptureSuccess() {
      // Persist unlock for future visits
      try {
        window.localStorage.setItem(STORAGE_KEY, '1')
        window.localStorage.removeItem(LEGACY_STORAGE_KEY)
      } catch {
        // Storage unavailable — still unlock for this session via state
      }

      // Unlock immediately — this is the single source of truth
      setIsLocked(false)

      // Scroll to the newly revealed content
      const nextSection = document.getElementById('landing-features-start')
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // Cross-tab sync: si otro tab desbloquea via localStorage, también desbloqueamos aquí
    function handleStorageChange(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue === '1') {
        setIsLocked(false)
      }
    }

    window.addEventListener(CAPTURE_EVENT, handleCaptureSuccess)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener(CAPTURE_EVENT, handleCaptureSuccess)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const shouldLock = forceUnlocked ? false : isLocked

  return (
    <section className={cn('relative', className)}>
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          shouldLock ? 'pointer-events-none select-none blur-[3px] opacity-65 md:blur-[4px]' : 'blur-0 opacity-100',
        )}
      >
        {children}
      </div>

      {shouldLock ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-start justify-center bg-black/25 px-4 pt-10 md:pt-14">
          <div className="pointer-events-auto w-full max-w-2xl rounded-sm border border-[#d4af37]/20 bg-[#161616] p-4 text-center shadow-[0_18px_45px_rgba(0,0,0,0.55)] md:p-7">
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#FFFF] md:text-[11px]">
              {flowGate.unlockTitle}
            </p>
            <p className="mt-2 font-sans text-[12px] leading-relaxed text-[#d3cbba] md:text-sm">
              {flowGate.unlockDescription}
            </p>

            <PhoneLeadCaptureForm className="mx-auto mt-4" submitLabel={flowGate.submitLabel} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
