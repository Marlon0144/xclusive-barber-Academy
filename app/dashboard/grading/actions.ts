'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
// Asegúrate de que esta ruta sea correcta, si no la tienes, comenta la línea de IA temporalmente para probar
import { generateAIFeedback } from '@/utils/openai'

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
    const supabase = await createClient()

    // 1. Verificar Usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No estás autenticado.' }

    // 2. Verificar Permisos (Doble chequeo: Código + RLS)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'instructor')) {
      return { error: 'No tienes permisos de Instructor para realizar esta acción.' }
    }

    // 3. Obtener datos para la IA
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('cut_type')
      .eq('id', submissionId)
      .single()

    if (fetchError || !submission) return { error: 'No se encontró el envío o no tienes permiso para verlo.' }

    // 4. Generar Feedback IA (Manejo de errores específico)
    let feedback = "Feedback manual pendiente."
    try {
      if (submission.cut_type) {
        feedback = await generateAIFeedback(submission.cut_type, grades)
      }
    } catch (aiError) {
      console.error("Error generando IA:", aiError)
      feedback = "No se pudo generar feedback automático. (Error IA)"
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
      return { error: `Error al guardar: ${updateError.message}` }
    }

    revalidatePath('/dashboard/grading')
    return { success: true }

  } catch (err) {
    const error = err instanceof Error ? err.message : 'Ocurrió un error inesperado en el servidor.'
    console.error("Error inesperado en submitGrade:", error)
    return { error }
  }
}