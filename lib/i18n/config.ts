export const SUPPORTED_LANGUAGES = ['es', 'en'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'es'
export const LANGUAGE_COOKIE_NAME = 'preferred_language'
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language)
}

export function resolveLanguageFromAcceptLanguage(headerValue?: string | null): Language {
  if (!headerValue) return DEFAULT_LANGUAGE

  const weightedLocales = headerValue
    .split(',')
    .map((part) => {
      const [localePart, qualityPart] = part.trim().split(';q=')
      const locale = localePart?.toLowerCase() ?? ''
      const quality = qualityPart ? Number(qualityPart) : 1
      return {
        locale,
        quality: Number.isNaN(quality) ? 0 : quality,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const entry of weightedLocales) {
    if (entry.locale.startsWith('es')) return 'es'
    if (entry.locale.startsWith('en')) return 'en'
  }

  return DEFAULT_LANGUAGE
}

export function resolvePreferredLanguage(
  cookieLanguage?: string | null,
  acceptLanguage?: string | null,
): Language {
  if (isSupportedLanguage(cookieLanguage)) return cookieLanguage
  return resolveLanguageFromAcceptLanguage(acceptLanguage)
}
