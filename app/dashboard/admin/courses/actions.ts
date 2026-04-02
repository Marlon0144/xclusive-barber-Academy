'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getServerDictionary } from '@/lib/i18n/server'

export type ActionState = {
  success?: boolean
  error?: string | null
}

// Cliente Admin "Puro" (Sin cookies, solo llave maestra)
const supabaseAdmin = createAdminClient()

// --- MÓDULOS ---

export async function createModule(title: string): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  // Usamos supabaseAdmin directamente
  const { error } = await supabaseAdmin
    .from('modules')
    .insert({ title, order_index: 99 })

  if (error) {
    console.error("❌ Error creando módulo:", error.message)
    return { error: messages.createModuleError }
  }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function deleteModule(moduleId: string): Promise<ActionState> {
  const { error } = await supabaseAdmin
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

// --- LECCIONES ---

export async function createLesson(moduleId: string, title: string): Promise<ActionState> {
  const { error } = await supabaseAdmin
    .from('lessons')
    .insert({ 
        module_id: moduleId, 
        title, 
        content: '', 
        video_url: '' 
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function deleteLesson(lessonId: string): Promise<ActionState> {
  const { error } = await supabaseAdmin
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function updateModuleTitle(moduleId: string, newTitle: string): Promise<ActionState> {
  const { error } = await supabaseAdmin
    .from('modules')
    .update({ title: newTitle })
    .eq('id', moduleId)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function updateLessonTitle(lessonId: string, newTitle: string): Promise<ActionState> {
  const { error } = await supabaseAdmin
    .from('lessons')
    .update({ title: newTitle })
    .eq('id', lessonId)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}

export async function reorderLessonsInModule(
  moduleId: string,
  orderedLessonIds: string[],
): Promise<ActionState> {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.adminCourses

  if (!moduleId || orderedLessonIds.length === 0) {
    return { error: messages.reorderInvalidData }
  }

  const uniqueIds = new Set(orderedLessonIds)
  if (uniqueIds.size !== orderedLessonIds.length) {
    return { error: messages.reorderDuplicate }
  }

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
  const { error } = await supabaseAdmin
    .from('modules')
    .update({ competency })
    .eq('id', moduleId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/courses')
  return { success: true }
}