import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation' // Importamos notFound por si el ID está mal
import EditLessonForm from './EditLessonForm'

// Asegúrate de que el tipo de props sea correcto para Next.js 15
interface PageProps {
  params: Promise<{ lessonId: string }>
}

export default async function EditLessonPage({ params }: PageProps) {
  // Await params (Requerido en Next.js 15)
  const { lessonId } = await params
  
  const supabase = await createClient()

  // 1. Verificación de Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch de la Lección
  // ⚠️ AQUÍ ESTABA EL ERROR: Faltaba pedir 'video_url'
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, title, content, video_url') // <--- AGREGADO AQUI
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return notFound() // Muestra página 404 si no existe
  }

  return (
    <div>
      <EditLessonForm lesson={lesson} />
    </div>
  )
}