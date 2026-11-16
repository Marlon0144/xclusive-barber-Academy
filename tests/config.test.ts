import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  resolveLanguageFromAcceptLanguage,
  resolvePreferredLanguage,
} from '@/lib/i18n/config'

describe('i18n config — language resolution', () => {
  it('DEFAULT_LANGUAGE is es', () => {
    expect(DEFAULT_LANGUAGE).toBe('es')
  })

  describe('isSupportedLanguage', () => {
    it('accepts es and en', () => {
      expect(isSupportedLanguage('es')).toBe(true)
      expect(isSupportedLanguage('en')).toBe(true)
    })

    it('rejects unsupported values (null, empty, pt, fr, 7)', () => {
      expect(isSupportedLanguage(null)).toBe(false)
      expect(isSupportedLanguage(undefined)).toBe(false)
      expect(isSupportedLanguage('')).toBe(false)
      expect(isSupportedLanguage('pt')).toBe(false)
      expect(isSupportedLanguage('fr')).toBe(false)
      expect(isSupportedLanguage(7 as unknown)).toBe(false)
    })
  })

  describe('resolveLanguageFromAcceptLanguage', () => {
    it('defaults to es with no header', () => {
      expect(resolveLanguageFromAcceptLanguage(undefined)).toBe('es')
      expect(resolveLanguageFromAcceptLanguage(null)).toBe('es')
    })

    it('returns es for an es-* locale regardless of position', () => {
      expect(resolveLanguageFromAcceptLanguage('es-ES')).toBe('es')
      expect(resolveLanguageFromAcceptLanguage('en-US, en;q=0.9, es;q=0.8')).toBe('en')
    })

    it('returns en for an en-* locale', () => {
      expect(resolveLanguageFromAcceptLanguage('en-US')).toBe('en')
      expect(resolveLanguageFromAcceptLanguage('en')).toBe('en')
    })

    it('respects weight (q) ordering', () => {
      // es has higher quality than en
      expect(resolveLanguageFromAcceptLanguage('en;q=0.2, es;q=1')).toBe('es')
    })

    it('falls back to es for unsupported locales', () => {
      expect(resolveLanguageFromAcceptLanguage('fr-FR, de-DE')).toBe('es')
    })
  })

  describe('resolvePreferredLanguage (cookie wins)', () => {
    it('cookie overrides accept-language', () => {
      expect(resolvePreferredLanguage('en', 'es-ES')).toBe('en')
      expect(resolvePreferredLanguage('es', 'en-US')).toBe('es')
    })

    it('falls back to accept-language when cookie is absent/invalid', () => {
      expect(resolvePreferredLanguage(null, 'en-US')).toBe('en')
      expect(resolvePreferredLanguage('pt', 'en-US')).toBe('en')
      expect(resolvePreferredLanguage(undefined, undefined)).toBe('es')
    })
  })
})
