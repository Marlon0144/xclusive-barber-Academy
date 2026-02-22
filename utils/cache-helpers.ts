import React from 'react'
import { createClient } from './supabase/server'
import {
  COMPETENCY_KEYS,
  COMPETENCY_LABELS,
  PROFESSIONAL_LEVELS,
  type CompetencyKey,
  type CompetencyProgress,
  type StudentProgressData,
} from '@/types/progress'

/**
 * Cached helper to get the current authenticated user.
 * Deduplicates within the same render/request cycle.
 * Used in: Header, Dashboard, LessonPage
 */
export const getUser = React.cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Cached helper to get user profile (role, etc).
 * Deduplicates within the same render/request cycle.
 * Used in: Dashboard
 */
export const getProfile = React.cache(async (userId: string) => {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return profile
})

/**
 * Cached helper to get lesson details by ID.
 * Deduplicates within the same render/request cycle.
 * Used in: LessonPage
 */
export const getLessonById = React.cache(async (id: string) => {
  const supabase = await createClient()
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  return { lesson, error }
})

// ─── Raw join shape from Supabase for getStudentProgress ─────────────────────
type RawLesson = {
  id: string
  module_id: string
  modules: {
    id: string
    competency: string | null
  } | null
}

/**
 * Cached helper that computes the full StudentProgressData for a student.
 *
 * Performance rules applied (Vercel Best Practices):
 *   - `async-parallel`        : Promise.all() sobre 4 fuentes independientes
 *   - `server-cache-react`    : React.cache() — deduplicación por request
 *   - `js-combine-iterations` : Un solo for-loop para calcular competencias + módulos + progreso general
 *   - `js-set-map-lookups`    : Set<string> para O(1) lookup de lecciones completadas
 *   - `js-index-maps`         : Map<moduleId, ...> para contar módulos completados
 *   - `js-early-exit`         : Guard clauses con defaults en lugar de throws
 *
 * @param userId     - UUID del estudiante autenticado
 * @param userEmail  - Email del auth user (ya disponible de auth.getUser())
 * @param enrolledAt - created_at del auth user (se usa como fecha de inicio)
 */
export const getStudentProgress = React.cache(
  async (
    userId: string,
    userEmail: string,
    enrolledAt: string,
  ): Promise<StudentProgressData> => {
    const supabase = await createClient()

    // ── 4 queries independientes en paralelo: async-parallel (CRITICAL) ──────
    const [profileResult, allLessonsResult, completedProgressResult, submissionsCountResult] =
      await Promise.all([
        // Nombre del estudiante (puede ser null si no lo configuró)
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single(),

        // Todas las lecciones con la competencia de su módulo
        supabase
          .from('lessons')
          .select('id, module_id, modules!inner(id, competency)'),

        // Solo lecciones completadas por este usuario
        supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', userId)
          .eq('completed', true),

        // Conteo de prácticas enviadas
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', userId),
      ])

    // ── Extraer datos con defaults seguros: js-early-exit ────────────────────
    const studentName =
      (profileResult.data as { full_name: string | null } | null)?.full_name ??
      userEmail.split('@')[0]

    const allLessons: RawLesson[] = (allLessonsResult.data as RawLesson[] | null) ?? []
    const completedRows = completedProgressResult.data ?? []
    const submittedPractices = submissionsCountResult.count ?? 0

    // ── O(1) lookup para lecciones completadas: js-set-map-lookups ───────────
    const completedSet = new Set<string>(completedRows.map((r) => r.lesson_id))

    // ── Un solo loop para todo el cómputo: js-combine-iterations + js-index-maps
    const competencyMap = new Map<CompetencyKey, { total: number; completed: number }>()
    const moduleMap = new Map<string, { total: number; completed: number }>()
    let completedLessonsCount = 0

    for (const lesson of allLessons) {
      const moduleId = lesson.module_id
      const competency = lesson.modules?.competency as CompetencyKey | null
      const isDone = completedSet.has(lesson.id)

      if (isDone) completedLessonsCount++

      // -- Progreso por módulo
      const moduleEntry = moduleMap.get(moduleId) ?? { total: 0, completed: 0 }
      moduleEntry.total++
      if (isDone) moduleEntry.completed++
      moduleMap.set(moduleId, moduleEntry)

      // -- Progreso por competencia (solo si el módulo tiene competencia asignada)
      if (competency && COMPETENCY_KEYS.includes(competency)) {
        const compEntry = competencyMap.get(competency) ?? { total: 0, completed: 0 }
        compEntry.total++
        if (isDone) compEntry.completed++
        competencyMap.set(competency, compEntry)
      }
    }

    // ── Módulos completados (todas sus lecciones terminadas) ─────────────────
    let completedModules = 0
    for (const entry of moduleMap.values()) {
      if (entry.total > 0 && entry.completed === entry.total) completedModules++
    }
    const totalModules = moduleMap.size
    const totalLessons = allLessons.length

    // ── Progreso general ─────────────────────────────────────────────────────
    const generalProgressPercentage =
      totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

    // ── Nivel profesional derivado: pura lógica, sin DB ──────────────────────
    const currentLevel =
      PROFESSIONAL_LEVELS.find(
        (l) =>
          generalProgressPercentage >= l.minPercentage &&
          generalProgressPercentage <= l.maxPercentage,
      ) ?? PROFESSIONAL_LEVELS[0]

    const currentLevelIndex = PROFESSIONAL_LEVELS.indexOf(currentLevel)
    const nextLevel =
      currentLevelIndex < PROFESSIONAL_LEVELS.length - 1
        ? PROFESSIONAL_LEVELS[currentLevelIndex + 1]
        : null

    // ── Competencias en orden canónico ────────────────────────────────────────
    const competencies: CompetencyProgress[] = COMPETENCY_KEYS.map((key) => {
      const entry = competencyMap.get(key) ?? { total: 0, completed: 0 }
      const percentage =
        entry.total > 0 ? Math.round((entry.completed / entry.total) * 100) : 0
      return {
        key,
        label: COMPETENCY_LABELS[key],
        completedLessons: entry.completed,
        totalLessons: entry.total,
        percentage,
      }
    })

    return {
      student: {
        name: studentName,
        email: userEmail,
        enrolledAt,
        status: 'Activo',
      },
      competencies,
      metrics: {
        generalProgressPercentage,
        completedModules,
        totalModules,
        submittedPractices,
      },
      currentLevel,
      nextLevel,
    }
  },
)
