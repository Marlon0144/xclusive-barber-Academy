'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
// Asegúrate de que esta ruta sea correcta, si no la tienes, comenta la línea de IA temporalmente para probar
import { generateAIFeedback } from '@/utils/openai'
import { getServerDictionary, getServerLanguage } from '@/lib/i18n/server'

interface Grades {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

// Definimos un tipo de retorno para que el frontend sepa qué esperar
export type GradeState = {
  success?: boolean
  error?: string
}

export async function submitGrade(submissionId: string, grades: Grades): Promise<GradeState> {
  try {
    const language = await getServerLanguage()
    const dictionary = await getServerDictionary()
    const messages = dictionary.actions.grading
    const supabase = await createClient()

    // 1. Verificar Usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: messages.unauthenticated }

    // 2. Verificar Permisos (Doble chequeo: Código + RLS)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'instructor')) {
      return { error: messages.instructorOnly }
    }

    // 3. Obtener datos para la IA
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('cut_type')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) return { error: messages.submissionMissing }

    // 4. Generar Feedback IA (Manejo de errores específico)
    let feedback: string = messages.manualPending
    try {
      if (submission.cut_type) {
        feedback = await generateAIFeedback(submission.cut_type, grades, language)
      }
    } catch (aiError) {
      console.error("Error generando IA:", aiError)
      feedback = messages.aiError
      // No detenemos el proceso, guardamos la nota aunque falle la IA
    }

    // 5. Actualizar en Base de Datos
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        scores: grades, // Asegúrate que tu columna en Supabase sea tipo JSONB
        status: 'reviewed',
        feedback_ai: feedback,
        graded_at: new Date().toISOString(), // Opcional: útil para saber cuándo se calificó
        grader_id: user.id // Opcional: saber quién calificó
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error("Error DB Update:", updateError)
      return { error: messages.saveFailed }
    }

    revalidatePath('/dashboard/grading')
    return { success: true }

  } catch (err) {
    const dictionary = await getServerDictionary()
    const fallbackError = dictionary.actions.grading.unexpectedError
    const error = err instanceof Error ? err.message : fallbackError
    console.error("Error inesperado en submitGrade:", error)
    return { error }
  }
}