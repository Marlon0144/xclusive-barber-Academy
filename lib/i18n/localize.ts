/**
 * Helper de localización de contenido de base de datos (REQ-REUSE-001).
 *
 * Resuelve la columna visible de un campo bilingüe con fallback determinista
 * (REQ-REL-001): la columna base conserva el español como idioma de autoría y
 * la columna `*_en` opcional contiene la traducción al inglés.
 *
 * - `language === 'en'` y `_en` poblado (no `null`/`''`) → devuelve `_en`.
 * - en cualquier otro caso (idioma `es`, o `_en` ausente/vacío) → español.
 *
 * NUESTRA CONVENCIÓN: la columna base (`title`, `description`) es SIEMPRE el
 * español. No existe rama `*_es`; por eso `pick` delega en el texto base cuando
 * no hay traducción o el idioma activo es español (REQ-INT-003).
 */
export type LocalizedText = {
  /** Columna base (español, idioma de autoría) */
  es: string
  /** Columna traducida (`*_en`), opcional. `null`/`''` activan el fallback */
  en?: string | null
}

export function isEmpty(value: string | null | undefined): boolean {
  return value == null || value.trim() === ''
}

/**
 * `pick` — resuelve el valor visible según el idioma activo.
 *
 * @example pick('en', { es: 'Curso', en: 'Course' }) // => 'Course'
 * @example pick('en', { es: 'Curso', en: null })     // => 'Curso'  (fallback)
 * @example pick('es', { es: 'Curso', en: 'Course' }) // => 'Curso'
 */
export function pick(
  language: 'es' | 'en',
  localized: LocalizedText,
): string {
  if (language === 'en' && !isEmpty(localized.en)) {
    return localized.en as string
  }
  return localized.es
}

/**
 * `localizedText` — construye un `LocalizedText` desde columnas crudas de la BD
 * (por ejemplo los resultados de un `select` de `modules`). Evita replicar la
 * lógica de mapeo en cada componente (REQ-REUSE-001).
 */
export function localizedText(
  es: string | null | undefined,
  en: string | null | undefined,
): LocalizedText {
  return { es: es ?? '', en }
}