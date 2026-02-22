/**
 * Types para la feature de Progreso Profesional.
 * Fuente de verdad para page, actions y cache-helpers.
 * Sprint 6 — 2026-02-21
 */

// ─── Competencias ────────────────────────────────────────────────────────────

export type CompetencyKey =
  | 'desarrollo_tecnico'
  | 'aplicacion_estandares'
  | 'atencion_cliente'
  | 'mentalidad_profesional'

export const COMPETENCY_LABELS: Record<CompetencyKey, string> = {
  desarrollo_tecnico: 'Desarrollo Técnico',
  aplicacion_estandares: 'Aplicación de Estándares',
  atencion_cliente: 'Atención al Cliente',
  mentalidad_profesional: 'Mentalidad Profesional',
}

/** Todas las competencias válidas en orden canónico */
export const COMPETENCY_KEYS: CompetencyKey[] = [
  'desarrollo_tecnico',
  'aplicacion_estandares',
  'atencion_cliente',
  'mentalidad_profesional',
]

export interface CompetencyProgress {
  key: CompetencyKey
  label: string
  /** Lecciones completadas dentro de módulos con esta competencia */
  completedLessons: number
  /** Total de lecciones en módulos con esta competencia */
  totalLessons: number
  /**
   * 0–100. Si totalLessons === 0, es 0.
   * Una competencia llega al 100% cuando el alumno termina
   * TODOS los módulos asociados a ella.
   */
  percentage: number
}

// ─── Niveles Profesionales ────────────────────────────────────────────────────

export type ProfessionalLevelKey =
  | 'talento'
  | 'tecnico'
  | 'avanzado'
  | 'profesional'

export interface ProfessionalLevel {
  key: ProfessionalLevelKey
  label: string
  subtitle: string
  /** Porcentaje mínimo de progreso general para alcanzar este nivel (inclusive) */
  minPercentage: number
  /** Porcentaje máximo (inclusive) */
  maxPercentage: number
}

/** Definición inmutable de los 4 niveles */
export const PROFESSIONAL_LEVELS: ProfessionalLevel[] = [
  {
    key: 'talento',
    label: 'Talento en Formación',
    subtitle: 'Comenzando el camino',
    minPercentage: 0,
    maxPercentage: 24,
  },
  {
    key: 'tecnico',
    label: 'Técnico en Desarrollo',
    subtitle: 'Construyendo habilidades',
    minPercentage: 25,
    maxPercentage: 49,
  },
  {
    key: 'avanzado',
    label: 'Barbero Avanzado',
    subtitle: 'Dominando el oficio',
    minPercentage: 50,
    maxPercentage: 74,
  },
  {
    key: 'profesional',
    label: 'Profesional Xclusive',
    subtitle: 'Excelencia alcanzada',
    minPercentage: 75,
    maxPercentage: 100,
  },
]

// ─── Objeto Raíz para la página ───────────────────────────────────────────────

export interface StudentProgressData {
  /** Datos personales del estudiante (HU1) */
  student: {
    name: string
    email: string
    /** ISO timestamp — se toma de profiles.created_at */
    enrolledAt: string
    /** Derivado: autenticado = 'Activo' */
    status: 'Activo'
  }
  /** Desglose por competencia (HU2) */
  competencies: CompetencyProgress[]
  /** Métricas numéricas (HU3) */
  metrics: {
    /** % de lecciones completadas sobre el total */
    generalProgressPercentage: number
    /** Módulos donde TODAS sus lecciones están completadas */
    completedModules: number
    totalModules: number
    /** Prácticas enviadas (submissions) */
    submittedPractices: number
  }
  /** Nivel profesional derivado del progreso general (HU4) */
  currentLevel: ProfessionalLevel
  /** El nivel inmediato siguiente; null si ya es Profesional Xclusive */
  nextLevel: ProfessionalLevel | null
}
