/**
 * Public marketing routes and their language counterparts.
 *
 * The site used to pick its language from a cookie, so `/` could render in
 * either language under the SAME url — which search engines can't index. Each
 * language now has its own URL ("language follows the URL") and this module is
 * the single source of truth for:
 *   - which URL belongs to which language (`languageForPath`),
 *   - the equivalent URL in the other language (`counterpartPath`, used by the
 *     language switcher and by every localized link),
 *   - the hreflang alternates for metadata and the sitemap (`alternatesFor`).
 *
 * Pure and dependency-free so it can run in middleware, server components,
 * client components and unit tests.
 */

import type { Language } from './config'

/** [Spanish path, English path] for every public page that exists in both languages. */
export const ROUTE_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['/', '/en'],
  ['/courses', '/en/courses'],
  ['/courses/starter', '/en/courses/starter'],
  ['/courses/profesional', '/en/courses/professional'],
  ['/courses/elite', '/en/courses/elite'],
  ['/courses/business', '/en/courses/business'],
  ['/aplicar', '/en/apply-now'],
  ['/aplicar/gracias', '/en/apply-now/thank-you'],
  ['/curso-barberia-melbourne', '/en/barber-course-melbourne'],
]

/** Spanish pages that have a Portuguese sibling (hreflang `pt-AU`). */
export const PT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['/curso-barberia-melbourne', '/pt/curso-de-barbeiro-melbourne'],
]

/** Public pages that only exist in one language. */
export const SPANISH_ONLY_PATHS: readonly string[] = [
  '/como-ser-barbero-en-australia',
  '/pt/curso-de-barbeiro-melbourne',
]

/** English course slug (URL) → internal course id used by the dictionary and /qualify?plan=. */
export const EN_COURSE_SLUGS = {
  starter: 'starter',
  professional: 'profesional',
  elite: 'elite',
  business: 'business',
} as const

const ES_PATHS = new Set<string>([...ROUTE_PAIRS.map(([es]) => es), ...SPANISH_ONLY_PATHS])

const EN_TO_ES = new Map<string, string>(ROUTE_PAIRS.map(([es, en]) => [en, es]))
const ES_TO_EN = new Map<string, string>(ROUTE_PAIRS.map(([es, en]) => [es, en]))

/** Drops query/hash and the trailing slash ("/courses/" → "/courses"; "/" stays "/"). */
export function normalizePathname(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/)[0] ?? ''
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) return withoutQuery.slice(0, -1)
  return withoutQuery || '/'
}

/**
 * Language implied by a public marketing URL, or null for pages whose language
 * is a user preference (qualify, apply, login, dashboard…).
 */
export function languageForPath(pathname: string | null | undefined): Language | null {
  if (!pathname) return null
  const path = normalizePathname(pathname)

  if (path === '/en' || path.startsWith('/en/')) return 'en'
  // The Portuguese page reuses Spanish chrome (nav/footer) — its own copy lives in lib/content/pt.ts.
  if (path === '/pt' || path.startsWith('/pt/')) return 'es'
  if (ES_PATHS.has(path)) return 'es'

  return null
}

/** True for any URL that belongs to the public, language-by-URL part of the site. */
export function isMarketingPath(pathname: string | null | undefined): boolean {
  return languageForPath(pathname) !== null
}

/** Value for `<html lang>`: regional tags help search engines target Australia. */
export function htmlLangForPath(pathname: string | null | undefined, language: Language): string {
  if (pathname) {
    const path = normalizePathname(pathname)
    if (path === '/pt' || path.startsWith('/pt/')) return 'pt-AU'
  }
  return language === 'en' ? 'en-AU' : 'es-AU'
}

/** The same page in the other language, or null when there is no equivalent. */
export function counterpartPath(pathname: string, target: Language): string | null {
  const path = normalizePathname(pathname)

  if (target === 'en') return ES_TO_EN.get(path) ?? (EN_TO_ES.has(path) ? path : null)
  return EN_TO_ES.get(path) ?? (ES_TO_EN.has(path) ? path : null)
}

/**
 * Rewrites an internal link so it stays inside the visitor's language
 * (`/courses` → `/en/courses` for English). Paths without a localized pair
 * (/qualify, /login, /dashboard…) are returned unchanged.
 */
export function localizedPath(path: string, language: Language): string {
  const [pathOnly, ...rest] = path.split(/(?=[?#])/)
  const counterpart = counterpartPath(pathOnly ?? path, language)
  return counterpart ? `${counterpart}${rest.join('')}` : path
}

/** Internal course id for an English URL slug, or null when the slug isn't an English course slug. */
export function toInternalCourseSlug(enSlug: string): string | null {
  // hasOwn: a plain lookup would also "find" inherited keys such as "__proto__" or "constructor".
  return Object.prototype.hasOwnProperty.call(EN_COURSE_SLUGS, enSlug)
    ? (EN_COURSE_SLUGS as Record<string, string>)[enSlug]
    : null
}

/** English URL slug for an internal course id. */
export function toEnglishCourseSlug(courseId: string): string | null {
  const entry = Object.entries(EN_COURSE_SLUGS).find(([, internal]) => internal === courseId)
  return entry ? entry[0] : null
}

export type PathAlternates = {
  canonical: string
  /** hreflang → path. Always includes `x-default` (Spanish). */
  languages: Record<string, string>
}

/**
 * hreflang set for a public page. Every page lists ITSELF too (required by
 * Google: alternates must be reciprocal and self-referencing).
 */
export function alternatesFor(pathname: string): PathAlternates {
  const path = normalizePathname(pathname)

  const pair = ROUTE_PAIRS.find(([es, en]) => es === path || en === path)
  const pt = PT_PAIRS.find(([es, ptPath]) => es === path || ptPath === path)

  if (pair || pt) {
    const esPath = pair ? pair[0] : (pt as readonly [string, string])[0]
    const languages: Record<string, string> = { 'es-AU': esPath }
    const enPath = ES_TO_EN.get(esPath)
    if (enPath) languages['en-AU'] = enPath
    const ptPath = PT_PAIRS.find(([es]) => es === esPath)?.[1]
    if (ptPath) languages['pt-AU'] = ptPath
    languages['x-default'] = esPath
    return { canonical: path, languages }
  }

  return { canonical: path, languages: { 'es-AU': path, 'x-default': path } }
}

/** Every public, indexable page (both languages + Portuguese + Spanish-only), for the sitemap. */
export function allIndexablePaths(): string[] {
  const noindex = new Set<string>(['/aplicar/gracias', '/en/apply-now/thank-you'])
  const all = new Set<string>()
  for (const [es, en] of ROUTE_PAIRS) {
    all.add(es)
    all.add(en)
  }
  for (const path of SPANISH_ONLY_PATHS) all.add(path)
  return [...all].filter((path) => !noindex.has(path))
}
