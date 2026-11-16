'use server'

import { z } from 'zod'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getServerDictionary } from '@/lib/i18n/server'

export type ActionState = {
  success?: boolean
  error?: string | null
}

/** Límite de caracteres para títulos (es y en). */
const TITLE_MAX = 200
const DESC_MAX = 1000

const titleSchema = z
  .string()
  .trim()
  .min(1, { message: 'Required' })
  .max(TITLE_MAX)

const titleEnSchema = z
  .union([z.string().trim().max(TITLE_MAX), z.literal(''), z.null()])
  .transform((v) => (v ? v.trim() : null))

const descriptionEnSchema = z
  .union([z.string().trim().max(DESC_MAX), z.literal(''), z.null()])
  .transform((v) => (v ? v.trim() : null))

// Cliente Admin "Puro" (Sin cookies, solo llave maestra) — se crea dentro de
// cada acción tras la verificación de identidad/rol con el cliente normal.
type AdminResult = { ok: true } | { ok: false; error: string }

/**
 * REQ-SEC-001: verificar sesión y rol con el cliente normal → mutar con el
 * Admin client. Guard exclusivo de administradores para el CRUD de cursos y
 * títulos traducidos (`_en`).
 */
async function assertAdmin(): Promise<AdminResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'No autorizado: debes iniciar sesión.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { ok: false, error: 'No tienes permisos de administrador.' }
  }

  return { ok: true }
}

// --- MÓDULOS ---

export async function createModule(
  title: string,
  opts?: { title_en?: string | null; description_en?: string | null },
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const titleParsed = titleSchema.safeParse(title)
  if (!titleParsed.success) return { error: messages.createModuleError }

  const titleEnParsed = titleEnSchema.safeParse(opts?.title_en ?? null)
  const descEnParsed = descriptionEnSchema.safeParse(opts?.description_en ?? null)
  if (!titleEnParsed.success || !descEnParsed.success) {
    return { error: messages.createModuleError }
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('modules')
    .insert({
      title: titleParsed.data,
      order_index: 99,
      title_en: titleEnParsed.data,
      description_en: descEnParsed.data,
    })

  if (error) {
    console.error("❌ Error creando módulo:", error.message)
    return { error: messages.createModuleError }
  }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function deleteModule(moduleId: string): Promise<ActionState> {
  const message = 'Error eliminando módulo'
  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) return { error: message }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

// --- LECCIONES ---

export async function createLesson(
  moduleId: string,
  title: string,
  opts?: { title_en?: string | null },
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const titleParsed = titleSchema.safeParse(title)
  if (!titleParsed.success) return { error: messages.createLessonError }

  const titleEnParsed = titleEnSchema.safeParse(opts?.title_en ?? null)
  if (!titleEnParsed.success) return { error: messages.createLessonError }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: titleParsed.data,
      title_en: titleEnParsed.data,
      content: '',
      video_url: '',
    })

  if (error) return { error: messages.createLessonError }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function deleteLesson(lessonId: string): Promise<ActionState> {
  const message = 'Error eliminando lección'
  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) return { error: message }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function updateModuleTitle(
  moduleId: string,
  newTitle: string,
  opts?: { title_en?: string | null; description_en?: string | null },
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const titleParsed = titleSchema.safeParse(newTitle)
  if (!titleParsed.success) return { error: messages.updateModuleTitleError }

  // Solo se actualizan los campos `_en` si vienen definidos en `opts`.
  const patch: Record<string, unknown> = { title: titleParsed.data }
  if (opts && Object.prototype.hasOwnProperty.call(opts, 'title_en')) {
    const parsed = titleEnSchema.safeParse(opts.title_en ?? null)
    if (!parsed.success) return { error: messages.updateModuleTitleError }
    patch.title_en = parsed.data
  }
  if (opts && Object.prototype.hasOwnProperty.call(opts, 'description_en')) {
    const parsed = descriptionEnSchema.safeParse(opts.description_en ?? null)
    if (!parsed.success) return { error: messages.updateModuleTitleError }
    patch.description_en = parsed.data
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('modules')
    .update(patch)
    .eq('id', moduleId)

  if (error) return { error: messages.updateModuleTitleError }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function updateLessonTitle(
  lessonId: string,
  newTitle: string,
  opts?: { title_en?: string | null },
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const titleParsed = titleSchema.safeParse(newTitle)
  if (!titleParsed.success) return { error: messages.updateLessonTitleError }

  const patch: Record<string, unknown> = { title: titleParsed.data }
  if (opts && Object.prototype.hasOwnProperty.call(opts, 'title_en')) {
    const parsed = titleEnSchema.safeParse(opts.title_en ?? null)
    if (!parsed.success) return { error: messages.updateLessonTitleError }
    patch.title_en = parsed.data
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('lessons')
    .update(patch)
    .eq('id', lessonId)

  if (error) return { error: messages.updateLessonTitleError }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function reorderLessonsInModule(
  moduleId: string,
  orderedLessonIds: string[],
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  if (!moduleId || orderedLessonIds.length === 0) {
    return { error: messages.reorderInvalidData }
  }

  const uniqueIds = new Set(orderedLessonIds)
  if (uniqueIds.size !== orderedLessonIds.length) {
    return { error: messages.reorderDuplicate }
  }

  const supabaseAdmin = createAdminClient()
  const { data: moduleLessons, error: fetchError } = await supabaseAdmin
    .from('lessons')
    .select('id')
    .eq('module_id', moduleId)

  if (fetchError) return { error: fetchError.message }

  const moduleLessonIds = new Set((moduleLessons ?? []).map((lesson) => lesson.id))

  // Validar que el array recibido represente exactamente las lecciones de ese módulo.
  if (
    moduleLessonIds.size !== orderedLessonIds.length ||
    orderedLessonIds.some((id) => !moduleLessonIds.has(id))
  ) {
    return { error: messages.reorderMismatch }
  }

  const updates = orderedLessonIds.map((lessonId, index) =>
    supabaseAdmin
      .from('lessons')
      .update({ order_index: index + 1 })
      .eq('id', lessonId)
      .eq('module_id', moduleId),
  )

  const results = await Promise.all(updates)
  const failed = results.find((result) => result.error)

  if (failed?.error) return { error: failed.error.message }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

/**
 * Asigna o desasigna la competencia de un módulo.
 * Al cambiar la competencia, el progreso del estudiante se recalcula
 * automáticamente en el siguiente request (a través de getStudentProgress).
 */
export async function updateModuleCompetency(
  moduleId: string,
  competency: string | null,
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin
    .from('modules')
    .update({ competency })
    .eq('id', moduleId)

  if (error) return { error: messages.updateModuleCompetencyError }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}