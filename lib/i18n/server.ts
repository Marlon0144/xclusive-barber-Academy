import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  PATHNAME_HEADER,
  isSupportedLanguage,
  resolveLanguageFromAcceptLanguage,
  type Language,
} from '@/lib/i18n/config'
import { getDictionary, type Dictionary } from '@/lib/i18n/dictionaries'
import { htmlLangForPath, languageForPath } from '@/lib/i18n/routes'

export const getServerLanguage = cache(async (): Promise<Language> => {
  const headerStore = await headers()

  // Public marketing pages: the URL decides the language (/en/... → en, / → es), so each
  // language has its own indexable URL. The cookie only matters for pages without a pair
  // (qualify, apply, login, dashboard…).
  const urlLanguage = languageForPath(headerStore.get(PATHNAME_HEADER))
  if (urlLanguage) return urlLanguage

  const cookieStore = await cookies()
  const cookieLanguage = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value

  if (isSupportedLanguage(cookieLanguage)) {
    return cookieLanguage
  }

  const detected = resolveLanguageFromAcceptLanguage(headerStore.get('accept-language'))
  return detected ?? DEFAULT_LANGUAGE
})

export const getServerDictionary = cache(async (): Promise<Dictionary> => {
  const language = await getServerLanguage()
  return getDictionary(language)
})

/** Value for `<html lang>` (es-AU / en-AU / pt-AU). */
export const getHtmlLang = cache(async (): Promise<string> => {
  const headerStore = await headers()
  const language = await getServerLanguage()
  return htmlLangForPath(headerStore.get(PATHNAME_HEADER), language)
})
