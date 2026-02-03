'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateAIFeedback } from '@/utils/openai' // <--- Importamos la IA

interface Grades {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

export async function submitGrade(submissionId: string, grades: Grades) {
  const supabase = await createClient()

  // 1. Seguridad (Se mantiene igual)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'professor') {
    throw new Error('No tienes permisos de instructor')
  }

  // 2. OBTENER INFORMACIÓN DEL CORTE (Necesitamos saber el cut_type para la IA)
  const { data: submission } = await supabase
    .from('submissions')
    .select('cut_type')
    .eq('id', submissionId)
    .single()

  if (!submission) throw new Error('Envío no encontrado')

  // 3. GENERAR FEEDBACK CON IA (Aquí ocurre la magia) 🤖
  // Nota: Esto añade unos milisegundos a la carga, pero vale la pena.
  const feedback = await generateAIFeedback(submission.cut_type, grades)

  // 4. ACTUALIZAR BASE DE DATOS (Guardamos notas + feedback + estado)
  const { error } = await supabase
    .from('submissions')
    .update({
      scores: grades,
      status: 'reviewed', // Asegúrate que coincida con tu DB ('reviewed' o 'graded')
      feedback_ai: feedback, // Guardamos lo que dijo la IA
    })
    .eq('id', submissionId)

  if (error) throw error

  revalidatePath('/dashboard/grading')
}