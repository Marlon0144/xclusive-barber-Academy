import { describe, expect, it } from 'vitest'
import {
  ALL_COMPETENCY_KEYS,
  getCompetencyLabels,
  getProfessionalLevelForPercentage,
  getProfessionalLevels,
} from '@/lib/i18n/progress-localization'
import { PROFESSIONAL_LEVELS } from '@/types/progress'

describe('progress-localization — REQ-FUNC-010 (competencias y niveles por idioma)', () => {
  it('etiquetas de competencias en español', () => {
    const labels = getCompetencyLabels('es')
    expect(labels.desarrollo_tecnico).toBe('Desarrollo Técnico')
    expect(labels.aplicacion_estandares).toBe('Aplicación de Estándares')
    expect(labels.atencion_cliente).toBe('Atención al Cliente')
    expect(labels.mentalidad_profesional).toBe('Mentalidad Profesional')
  })

  it('etiquetas de competencias en inglés', () => {
    const labels = getCompetencyLabels('en')
    expect(labels.desarrollo_tecnico).toBe('Technical Development')
    expect(labels.aplicacion_estandares).toBe('Application of Standards')
    expect(labels.atencion_cliente).toBe('Customer Service')
    expect(labels.mentalidad_profesional).toBe('Professional Mindset')
  })

  it('cubre todas las competencias canónicas en ambos idiomas', () => {
    for (const key of ALL_COMPETENCY_KEYS) {
      expect(getCompetencyLabels('es')[key]).toBeTruthy()
      expect(getCompetencyLabels('en')[key]).toBeTruthy()
    }
  })

  it('niveles en inglés con etiquetas localizadas', () => {
    const niveles = getProfessionalLevels('en')
    const byKey = Object.fromEntries(niveles.map((n) => [n.key, n]))
    expect(byKey.talento.label).toBe('Talent in Training')
    expect(byKey.profesional.label).toBe('Xclusive Professional')
  })

  it('mantiene intactos los umbrales de porcentaje (lógica de cálculo sin cambios)', () => {
    const es = getProfessionalLevels('es')
    const esByKey = Object.fromEntries(es.map((n) => [n.key, n]))

    // Comparar contra la fuente de verdad numérica de types/progress.ts
    for (const level of PROFESSIONAL_LEVELS) {
      expect(esByKey[level.key].minPercentage).toBe(level.minPercentage)
      expect(esByKey[level.key].maxPercentage).toBe(level.maxPercentage)
    }
  })

  it('los 4 niveles están en orden canónico y reparten el rango 0-100', () => {
    const niveles = getProfessionalLevels('en')
    expect(niveles.map((n) => n.key)).toEqual([
      'talento',
      'tecnico',
      'avanzado',
      'profesional',
    ])
    expect(niveles[0].minPercentage).toBe(0)
    expect(niveles[niveles.length - 1].maxPercentage).toBe(100)
  })

  it('deriva el nivel correcto según el % en cada idioma', () => {
    // 0-24 → talento ; 75-100 → profesional
    expect(getProfessionalLevelForPercentage('es', 10).key).toBe('talento')
    expect(getProfessionalLevelForPercentage('es', 24).key).toBe('talento')
    expect(getProfessionalLevelForPercentage('en', 25).key).toBe('tecnico')
    expect(getProfessionalLevelForPercentage('en', 50).key).toBe('avanzado')
    expect(getProfessionalLevelForPercentage('es', 99).key).toBe('profesional')
    expect(getProfessionalLevelForPercentage('es', 60).label).toBe('Barbero Avanzado')
  })
})
