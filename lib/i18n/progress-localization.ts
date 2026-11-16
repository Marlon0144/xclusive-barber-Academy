/**
 * Localización de competencias y niveles profesionales por idioma activo
 * (REQ-FUNC-010).
 *
 * Las etiquetas viven en el diccionario tipado (`dashboard.competencyLabels` y
 * `dashboard.professionalLevels`); los umbrales de porcentaje (`minPercentage` /
 * `maxPercentage`) y el orden canónico siguen definidos en `types/progress.ts`,
 * por lo que el cálculo de % permanece intacto. Aquí solo se traduce la
 * presentación, sin alterar la lógica de derivación de nivel.
 */
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Language } from '@/lib/i18n/config'
import {
  COMPETENCY_KEYS,
  PROFESSIONAL_LEVEL_KEYS,
  type CompetencyKey,
  type ProfessionalLevel,
  type ProfessionalLevelKey,
} from '@/types/progress'

/** Etiquetas de competencias localizadas para un idioma (Record tipado). */
export function getCompetencyLabels(
  language: Language,
): Record<CompetencyKey, string> {
  return getDictionary(language).dashboard.competencyLabels
}

/** Niveles profesionales localizados, manteniendo los umbrales de % intactos. */
export function getProfessionalLevels(
  language: Language,
): ProfessionalLevel[] {
  const dict = getDictionary(language).dashboard.professionalLevels

  return PROFESSIONAL_LEVEL_KEYS.map((key) => {
    const localized = dict[key]
    return {
      key,
      label: localized.label,
      subtitle: localized.subtitle,
      minPercentage: localizedMinMax[key].min,
      maxPercentage: localizedMinMax[key].max,
    }
  })
}

/** Umbrales (source of truth numérica) para el cálculo de nivel — intactos. */
const localizedMinMax: Record<
  ProfessionalLevelKey,
  { min: number; max: number }
> = {
  talento: { min: 0, max: 24 },
  tecnico: { min: 25, max: 49 },
  avanzado: { min: 50, max: 74 },
  profesional: { min: 75, max: 100 },
}

/** Derivar el nivel profesional según el % general (lógica intacta). */
export function getProfessionalLevelForPercentage(
  language: Language,
  percentage: number,
): ProfessionalLevel {
  const levels = getProfessionalLevels(language)
  return (
    levels.find(
      (level) =>
        percentage >= level.minPercentage && percentage <= level.maxPercentage,
    ) ?? levels[0]
  )
}

export const ALL_COMPETENCY_KEYS: CompetencyKey[] = COMPETENCY_KEYS

// Re-export de tipos usados por el consumidor (pages / componentes).
export type {
  CompetencyKey,
  ProfessionalLevel,
  ProfessionalLevelKey,
}