import { describe, expect, it } from 'vitest'
import {
  isEmpty,
  localizedText,
  pick,
  type LocalizedText,
} from '@/lib/i18n/localize'

describe('localize — fallback determinista (REQ-REUSE-001 / REQ-REL-001)', () => {
  const esText = 'Curso Avanzado'

  it('pick: language es devuelve siempre el texto base (español)', () => {
    expect(pick('es', { es: esText, en: 'Advanced Course' })).toBe(esText)
    expect(pick('es', { es: esText, en: null })).toBe(esText)
  })

  it('pick: language en con _en poblado muestra el inglés', () => {
    expect(pick('en', { es: esText, en: 'Advanced Course' })).toBe('Advanced Course')
  })

  it('pick: language en con _en null/""/espacios cae a español (fallback)', () => {
    expect(pick('en', { es: esText, en: null })).toBe(esText)
    expect(pick('en', { es: esText, en: '' })).toBe(esText)
    expect(pick('en', { es: esText, en: '   ' })).toBe(esText)
  })

  it('pick: tolera LocalizedText sin rama `en`', () => {
    const onlyEs: LocalizedText = { es: esText }
    expect(pick('en', onlyEs)).toBe(esText)
    expect(pick('es', onlyEs)).toBe(esText)
  })

  it('isEmpty detecta null, undefined, "" y whitespace', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('  ')).toBe(true)
    expect(isEmpty('Hola')).toBe(false)
  })

  it('localizedText mapea columnas crudas de la BD preservando la rama en', () => {
    expect(localizedText('Módulo 1', 'Module 1')).toEqual({
      es: 'Módulo 1',
      en: 'Module 1',
    })
  })

  it('localizedText normaliza NULL de la columna es a cadena vacía', () => {
    expect(localizedText(null, null)).toEqual({ es: '', en: null })
    expect(localizedText(undefined, undefined)).toEqual({ es: '', en: undefined })
  })

  it('composición end-to-end: pick(language, localizedText(cols)) (REQ-INT-003)', () => {
    const enVal = pick('en', localizedText('Fade Clásico', 'Classic Fade'))
    expect(enVal).toBe('Classic Fade')
    expect(pick('en', localizedText('Fade Clásico', null))).toBe('Fade Clásico')
    expect(pick('es', localizedText('Fade Clásico', 'Classic Fade'))).toBe('Fade Clásico')
  })
})
