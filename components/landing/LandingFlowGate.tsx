'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
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

function getLockedSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    // If storage is unavailable, keep the gated experience.
    return true
  }
}

export default function LandingFlowGate({ children, className, forceUnlocked = false }: LandingFlowGateProps) {
  const { dictionary } = useLanguage()
  const flowGate = dictionary.landing.flowGate

  const isLocked = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(CAPTURE_EVENT, onStoreChange)
      window.addEventListener('storage', onStoreChange)

      return () => {
        window.removeEventListener(CAPTURE_EVENT, onStoreChange)
        window.removeEventListener('storage', onStoreChange)
      }
    },
    getLockedSnapshot,
    () => true,
  )

  const shouldLock = forceUnlocked ? false : isLocked

  useEffect(() => {
    function handleCaptureSuccess() {
      try {
        window.localStorage.setItem(STORAGE_KEY, '1')
        window.localStorage.removeItem(LEGACY_STORAGE_KEY)
      } catch {
        // Ignore storage errors and still unlock for current session.
      }

      const nextSection = document.getElementById('landing-features-start')
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener(CAPTURE_EVENT, handleCaptureSuccess)
    return () => window.removeEventListener(CAPTURE_EVENT, handleCaptureSuccess)
  }, [])

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
