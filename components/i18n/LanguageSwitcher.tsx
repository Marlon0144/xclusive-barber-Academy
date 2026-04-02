'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setLanguagePreference } from '@/app/i18n/actions'
import { type Language } from '@/lib/i18n/config'
import { useLanguage } from '@/components/i18n/LanguageProvider'

export default function LanguageSwitcher({
  className,
}: {
  className?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const { language, dictionary, setLanguage } = useLanguage()
  const text = dictionary.languageSwitcher

  const onSelectLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return

    setLanguage(nextLanguage)

    startTransition(async () => {
      try {
        await setLanguagePreference(nextLanguage)
      } finally {
        router.refresh()
      }
    })
  }

  return (
    <div
      className={[
        'inline-flex items-center gap-1 rounded-full border border-[#d3cbba]/35 bg-[#0f0f0f]/90 p-1 backdrop-blur-sm',
        className ?? '',
      ].join(' ')}
      role="group"
      aria-label={text.ariaLabel}
    >
      <span className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d3cbba]/75">
        {pending ? text.saving : text.label}
      </span>

      <button
        type="button"
        onClick={() => onSelectLanguage('es')}
        disabled={pending}
        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
          language === 'es'
            ? 'bg-[#d3cbba] text-[#1e3a27]'
            : 'text-[#d3cbba] hover:bg-[#d3cbba]/15'
        }`}
      >
        ES
      </button>

      <button
        type="button"
        onClick={() => onSelectLanguage('en')}
        disabled={pending}
        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
          language === 'en'
            ? 'bg-[#d3cbba] text-[#1e3a27]'
            : 'text-[#d3cbba] hover:bg-[#d3cbba]/15'
        }`}
      >
        EN
      </button>
    </div>
  )
}
