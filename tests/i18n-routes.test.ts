import { describe, expect, it } from 'vitest'
import {
  PT_PAIRS,
  ROUTE_PAIRS,
  SPANISH_ONLY_PATHS,
  allIndexablePaths,
  alternatesFor,
  counterpartPath,
  htmlLangForPath,
  isMarketingPath,
  languageForPath,
  localizedPath,
  normalizePathname,
  toEnglishCourseSlug,
  toInternalCourseSlug,
} from '@/lib/i18n/routes'
import { PAGE_META } from '@/lib/seo/page-meta'

describe('normalizePathname', () => {
  it('drops query, hash and trailing slash', () => {
    expect(normalizePathname('/courses/')).toBe('/courses')
    expect(normalizePathname('/en?x=1')).toBe('/en')
    expect(normalizePathname('/')).toBe('/')
    expect(normalizePathname('')).toBe('/')
  })
})

describe('languageForPath', () => {
  it('Spanish URLs are Spanish and English URLs are English, regardless of cookie/browser', () => {
    expect(languageForPath('/')).toBe('es')
    expect(languageForPath('/courses/profesional')).toBe('es')
    expect(languageForPath('/en')).toBe('en')
    expect(languageForPath('/en/courses/professional')).toBe('en')
    expect(languageForPath('/en/apply-now/thank-you')).toBe('en')
  })

  it('the Portuguese page and Spanish-only pages use Spanish chrome', () => {
    expect(languageForPath('/pt/curso-de-barbeiro-melbourne')).toBe('es')
    expect(languageForPath('/como-ser-barbero-en-australia')).toBe('es')
  })

  it('returns null for pages whose language is a user preference', () => {
    for (const path of ['/qualify', '/apply', '/login', '/dashboard', '/dashboard/courses', null, undefined, '']) {
      expect(languageForPath(path)).toBeNull()
    }
    expect(isMarketingPath('/qualify')).toBe(false)
    expect(isMarketingPath('/en/courses')).toBe(true)
  })

  it('does not treat look-alike prefixes as English', () => {
    expect(languageForPath('/english')).toBeNull()
    expect(languageForPath('/entry')).toBeNull()
  })
})

describe('htmlLangForPath', () => {
  it('uses regional tags', () => {
    expect(htmlLangForPath('/', 'es')).toBe('es-AU')
    expect(htmlLangForPath('/en', 'en')).toBe('en-AU')
    expect(htmlLangForPath('/pt/curso-de-barbeiro-melbourne', 'es')).toBe('pt-AU')
    expect(htmlLangForPath(null, 'en')).toBe('en-AU')
  })
})

describe('counterpartPath / localizedPath', () => {
  it('maps every pair in both directions', () => {
    for (const [es, en] of ROUTE_PAIRS) {
      expect(counterpartPath(es, 'en')).toBe(en)
      expect(counterpartPath(en, 'es')).toBe(es)
      // already in the target language → unchanged
      expect(counterpartPath(en, 'en')).toBe(en)
      expect(counterpartPath(es, 'es')).toBe(es)
    }
  })

  it('has no counterpart for Spanish-only or unrelated pages', () => {
    expect(counterpartPath('/como-ser-barbero-en-australia', 'en')).toBeNull()
    expect(counterpartPath('/qualify', 'en')).toBeNull()
  })

  it('localizedPath keeps links inside the visitor language and leaves other paths alone', () => {
    expect(localizedPath('/courses', 'en')).toBe('/en/courses')
    expect(localizedPath('/courses/profesional', 'en')).toBe('/en/courses/professional')
    expect(localizedPath('/aplicar', 'en')).toBe('/en/apply-now')
    expect(localizedPath('/en/courses', 'es')).toBe('/courses')
    expect(localizedPath('/qualify?plan=elite', 'en')).toBe('/qualify?plan=elite')
    expect(localizedPath('/courses?x=1', 'en')).toBe('/en/courses?x=1')
  })
})

describe('English course slugs', () => {
  it('maps the English URL slug to the internal id and back', () => {
    expect(toInternalCourseSlug('professional')).toBe('profesional')
    expect(toEnglishCourseSlug('profesional')).toBe('professional')
    expect(toInternalCourseSlug('starter')).toBe('starter')
  })

  it('rejects the Spanish slug and junk under /en', () => {
    expect(toInternalCourseSlug('profesional')).toBeNull()
    expect(toInternalCourseSlug('nope')).toBeNull()
    expect(toInternalCourseSlug('__proto__')).toBeNull()
  })
})

describe('alternatesFor (hreflang)', () => {
  it('is reciprocal and self-referencing for every language pair', () => {
    for (const [es, en] of ROUTE_PAIRS) {
      const fromEs = alternatesFor(es)
      const fromEn = alternatesFor(en)

      expect(fromEs.languages).toEqual(fromEn.languages)
      expect(fromEs.languages['es-AU']).toBe(es)
      expect(fromEs.languages['en-AU']).toBe(en)
      expect(fromEs.languages['x-default']).toBe(es)
      expect(fromEs.canonical).toBe(es)
      expect(fromEn.canonical).toBe(en)
    }
  })

  it('adds pt-AU to the pillar trio', () => {
    for (const [es, pt] of PT_PAIRS) {
      expect(alternatesFor(es).languages['pt-AU']).toBe(pt)
      expect(alternatesFor(pt).languages['es-AU']).toBe(es)
      expect(alternatesFor(pt).canonical).toBe(pt)
    }
  })

  it('Spanish-only pages list only themselves plus x-default', () => {
    expect(alternatesFor('/como-ser-barbero-en-australia').languages).toEqual({
      'es-AU': '/como-ser-barbero-en-australia',
      'x-default': '/como-ser-barbero-en-australia',
    })
  })
})

describe('coverage', () => {
  it('every public page has title/description metadata', () => {
    const all = [...ROUTE_PAIRS.flat(), ...SPANISH_ONLY_PATHS]
    for (const path of all) expect(PAGE_META[path], `missing PAGE_META for ${path}`).toBeDefined()
  })

  it('the sitemap list excludes thank-you pages and includes both languages', () => {
    const paths = allIndexablePaths()
    expect(paths).not.toContain('/aplicar/gracias')
    expect(paths).not.toContain('/en/apply-now/thank-you')
    expect(paths).toEqual(expect.arrayContaining(['/', '/en', '/courses/starter', '/en/courses/starter', '/aplicar', '/en/apply-now']))
    expect(paths).toEqual(
      expect.arrayContaining([
        '/curso-barberia-melbourne',
        '/en/barber-course-melbourne',
        '/pt/curso-de-barbeiro-melbourne',
        '/como-ser-barbero-en-australia',
      ]),
    )
    expect(new Set(paths).size).toBe(paths.length)
  })
})
