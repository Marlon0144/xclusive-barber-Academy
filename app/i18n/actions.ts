'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  isSupportedLanguage,
  type Language,
} from '@/lib/i18n/config'

export async function setLanguagePreference(rawLanguage: string): Promise<{ language: Language }> {
  const language = isSupportedLanguage(rawLanguage) ? rawLanguage : DEFAULT_LANGUAGE
  const cookieStore = await cookies()

  cookieStore.set(LANGUAGE_COOKIE_NAME, language, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
  })

  revalidatePath('/', 'layout')
  return { language }
}
