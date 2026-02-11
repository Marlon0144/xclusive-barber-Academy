'use server'

// CAMBIO CRÍTICO: Usamos la librería base, NO la de SSR
import { createClient } from '@supabase/supabase-js' 
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  error?: string | null
}

// Cliente Admin "Puro" (Sin cookies, solo llave maestra)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false, // No necesitamos refrescar tokens
      persistSession: false    // No guardar sesión en memoria
    }
  }
)

// --- MÓDULOS ---

export async function createModule(title: string): Promise<ActionState> {
  // Usamos supabaseAdmin directamente
  const { error } = await supabaseAdmin
    .from('modules')
    .insert({ title, order_index: 99 })

  if (error) {
    console.error("❌ Error creando módulo:", error.message)
    return { error: "Error DB: " + error.message }
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