import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import VideoPlayer from '@/components/courses/VideoPlayer'
import LessonContent from '@/components/courses/LessonContent'

// CAMBIO 1: Definimos params como una Promesa en el tipo
interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  // CAMBIO 2: "Desempaquetamos" la promesa antes de usarla
  // Esperamos a que Next.js nos entregue los datos de la URL
  const { lessonId, courseId } = await params

  // LOGS DE DEBUG (Ahora sí mostrarán los datos reales)
  console.log("------------------------------------------------")
  console.log("🔍 INTENTANDO CARGAR LECCIÓN")
  console.log("🆔 ID extraído:", lessonId)
  console.log("📂 Curso ID:", courseId)

  // 1. Iniciamos Supabase
  const supabase = await createClient() // createClient en v15 a veces requiere await dependiendo de la config, ponle await por si acaso.

  // 2. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 3. Consultamos la Base de Datos
  // Fíjate que ahora usamos la variable 'lessonId' que sacamos del await
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId) 
    .single()

  // 4. Manejo de Errores
  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* SECCIÓN 1: CABECERA */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {lesson.title}
        </h1>
      </div>

      {/* SECCIÓN 2: VIDEO */}
      <div className="mb-8">
        <VideoPlayer url={lesson.video_url} lessonId={lesson.id}/>
      </div>

      {/* SECCIÓN 3: CONTENIDO HTML */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Sobre esta lección
        </h2>
        <LessonContent content={lesson.content} />
      </div>
    </div>
  )
}