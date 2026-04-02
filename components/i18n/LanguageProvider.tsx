'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries'
import { type Language } from '@/lib/i18n/config'

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
  const [language, setLanguage] = useState<Language>(initialLanguage)

  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

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
