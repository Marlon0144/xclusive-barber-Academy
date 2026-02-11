'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server' // <--- IMPORTAMOS AMBOS
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  error?: string | null
}

export async function updateLessonContent(
  lessonId: string, 
  htmlContent: string,
  videoUrl: string | null 
): Promise<ActionState> {
  
  // 1. CLIENTE NORMAL: Solo para verificar identidad
  const supabaseUser = await createClient()
  const { data: { user }, error: authError } = await supabaseUser.auth.getUser()

  // Verificamos que el usuario exista
  if (authError || !user) {
    return { error: 'No autorizado: Debes iniciar sesión.' }
  }

  // (OPCIONAL PERO RECOMENDADO) Verificamos rol aquí manualmente
  // const role = user.user_metadata?.role || user.app_metadata?.role
  // if (role !== 'admin') return { error: 'No tienes permisos de administrador.' }

  // ---------------------------------------------------------

  // 2. CLIENTE ADMIN: Para escribir en la DB saltando RLS
  const supabaseAdmin = await createAdminClient()

  const { error: updateError } = await supabaseAdmin
    .from('lessons')
    .update({ 
      content: htmlContent,   
      video_url: videoUrl,    
    })
    .eq('id', lessonId)

  if (updateError) {
    console.error('Error updating lesson:', updateError)
    return { error: 'Error DB: ' + updateError.message }
  }

  // 3. Limpiar caché
  revalidatePath('/dashboard/courses') 
  revalidatePath(`/dashboard/admin/lessons/${lessonId}/edit`)

  return { success: true }
}