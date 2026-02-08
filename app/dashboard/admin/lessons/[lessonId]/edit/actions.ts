'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Tipo de retorno para manejo de errores en el cliente
export type ActionState = {
  success?: boolean
  error?: string | null
}

export async function updateLessonContent(
  lessonId: string, 
  htmlContent: string
): Promise<ActionState> {
  const supabase = await createClient()

  // 1. Verificación de Seguridad (Autenticación y Rol)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado. Debes iniciar sesión.' }
  }

  // Opcional: Verificar si es admin explícitamente en la tabla profiles
  // Esto es doble seguridad además del RLS
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'professor') {
     return { error: 'Acceso denegado. Solo administradores o profesores.' }
  }

  // 2. Actualizar el contenido en la DB
  const { error: updateError } = await supabase
    .from('lessons')
    .update({ 
      content: htmlContent,
      // Podríamos agregar un campo 'updated_at': new Date().toISOString() si tu tabla lo tiene
    })
    .eq('id', lessonId)

  if (updateError) {
    console.error('Error updating lesson:', updateError)
    return { error: 'Error al guardar el contenido en la base de datos.' }
  }

  // 3. Revalidar la caché
  // Esto hace que cuando vuelvas a entrar a la lección, veas el cambio instantáneamente
  // Ajusta esta ruta si tu vista de cursos es diferente (ej: /courses/module-id/lesson-id)
  revalidatePath('/courses') 
  revalidatePath(`/dashboard/admin/courses`)

  return { success: true }
}