import { createClient } from '@/utils/supabase/server'
import EditLessonForm from './EditLessonForm'
import { notFound, redirect } from 'next/navigation'

// CORRECCIÓN NEXT.JS 15:
// Definimos params como una Promesa
interface PageProps {
  params: Promise<{ lessonId: string }>
}

export default async function EditLessonPage({ params }: PageProps) {
  // 1. Desempaquetamos la promesa (¡Esto es lo que faltaba!)
  const { lessonId } = await params

  const supabase = await createClient()
  
  // 2. Verificar sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 3. Traer la lección usando el ID ya resuelto
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, title, content, module_id')
    .eq('id', lessonId) // Ahora sí usamos la variable segura
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Editar Lección</h1>
        <p className="text-gray-500">Editando: {lesson.title}</p>
      </div>

      <EditLessonForm lesson={lesson} />
    </div>
  )
}