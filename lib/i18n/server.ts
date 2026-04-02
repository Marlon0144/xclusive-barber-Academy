import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  isSupportedLanguage,
  resolveLanguageFromAcceptLanguage,
  type Language,
} from '@/lib/i18n/config'
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries'

export const getServerLanguage = cache(async (): Promise<Language> => {
  const cookieStore = await cookies()
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value

  if (isSupportedLanguage(cookieLanguage)) {
    return cookieLanguage
  }

  const headerStore = await headers()
  const detected = resolveLanguageFromAcceptLanguage(headerStore.get('accept-language'))
  return detected ?? DEFAULT_LANGUAGE
})

export const getServerDictionary = cache(async (): Promise<Dictionary> => {
  const language = await getServerLanguage()
  return getDictionary(language)
})
