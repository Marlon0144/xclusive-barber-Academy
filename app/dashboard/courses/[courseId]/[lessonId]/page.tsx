import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import VideoPlayer from '@/components/courses/VideoPlayer'
import LessonContent from '@/components/courses/LessonContent'
import { Star, MonitorPlay, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

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

  // helpers
const getCurrentUser = React.cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

const getLessonById = React.cache(async (id: string) => {
  const supabase = await createClient()
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  return { lesson, error }
})

// start both queries in parallel
const [user, lessonResult] = await Promise.all([
  getCurrentUser(),
  getLessonById(lessonId),
])

if (!user) {
  redirect('/login')
}

const { lesson, error } = lessonResult

  // 4. Manejo de Errores con logs detallados
  if (error) {
    console.error('❌ Error Supabase:', error)
    console.error('❌ Detalles:', { message: error.message, code: error.code, details: error.details })
  }

  if (!lesson) {
    console.error('❌ Lección no encontrada para ID:', lessonId)
    return notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

      {/* NAVEGACIÓN DE RETORNO */}
      <div className="mb-8">
        <Link href={`/dashboard/courses`}>
          <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-gold-500 hover:bg-transparent transition-colors group">
            <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            VOLVER AL CURSO
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* COLUMNA IZQUIERDA: TÍTULO Y ESTADO (2/3 del ancho en desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* CABECERA LECCIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              <span className="text-gold-500 text-xs tracking-[0.2em] font-bold uppercase">Lección Actual</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">
              {lesson.title}
            </h1>

            <div className="flex items-center gap-4 pt-2">
              <span className="text-green-500 font-bold flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-full text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                DISPONIBLE
              </span>
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <MonitorPlay size={14} />
                Video Clase
              </span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: VIDEO (1/3 del ancho, más compacto) */}
        <div className="lg:col-span-1">
          <div className="relative group rounded-sm overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black sticky top-8">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <VideoPlayer url={lesson.video_url} lessonId={lesson.id} />

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* FILA INFERIOR: CONTENIDO (Ancho completo) */}
        <div className="lg:col-span-3 mt-8">
          <div className="bg-surface border border-white/5 p-8 md:p-12 rounded-sm hover:border-gold-500/20 transition-colors duration-500">
            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
              <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
              <h2 className="text-2xl font-serif text-white">Notas de la Clase</h2>
            </div>

            <div className="prose prose-lg prose-invert prose-p:text-zinc-300 prose-headings:font-serif prose-headings:text-white prose-a:text-gold-500 prose-strong:text-white max-w-none leading-relaxed">
              {lesson.content ? (
                <LessonContent content={lesson.content} />
              ) : (
                <p className="text-zinc-600 italic text-center py-10">No hay contenido escrito adicional para esta lección.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}