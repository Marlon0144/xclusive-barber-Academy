'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries'
import { type Language } from '@/lib/i18n/config'
import { htmlLangForPath, languageForPath } from '@/lib/i18n/routes'

type LanguageContextValue = {
  language: Language
  dictionary: Dictionary
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language
  children: ReactNode
}) {
  const [preferredLanguage, setLanguage] = useState<Language>(initialLanguage)
  const pathname = usePathname()

  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

  // On public marketing pages the URL decides the language. The root layout (and so
  // `initialLanguage`) isn't re-rendered by client-side navigation, so without this the footer,
  // sticky CTA and every other client component would keep the previous page's language after
  // following a link such as "English version".
  const language = languageForPath(pathname) ?? preferredLanguage

  // Same reason for <html lang>: the server renders it correctly, but a soft navigation doesn't.
  useEffect(() => {
    document.documentElement.lang = htmlLangForPath(pathname, language)
  }, [pathname, language])

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      dictionary: getDictionary(language),
      setLanguage,
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
