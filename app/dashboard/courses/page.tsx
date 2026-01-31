import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { BookOpen, PlayCircle, Layers } from 'lucide-react'

export default async function CoursesIndexPage() {
  const supabase = await createClient()

  // 1. Obtenemos los módulos ordenados
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Academia Xclusive
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Domina el arte de la barbería. Selecciona un módulo para comenzar tu aprendizaje.
        </p>
      </div>

      {!modules || modules.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No hay módulos</h3>
          <p className="mt-1 text-sm text-gray-500">El contenido se está cocinando.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div 
              key={module.id} 
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header decorativo de la tarjeta */}
              <div className="h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <BookOpen size={48} className="text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                  {module.description || "Aprende las técnicas avanzadas en este módulo completo."}
                </p>

                {/* Este componente busca la primera lección para que el botón funcione */}
                <GetFirstLessonButton moduleId={module.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente auxiliar para encontrar dónde empieza el módulo
async function GetFirstLessonButton({ moduleId }: { moduleId: string }) {
  const supabase = await createClient()
  
  const { data: firstLesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('module_id', moduleId)
    .order('position', { ascending: true })
    .limit(1)
    .single()

  if (!firstLesson) {
    return (
      <button disabled className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl text-sm font-bold cursor-not-allowed">
        Próximamente
      </button>
    )
  }

  return (
    <Link 
      href={`/dashboard/courses/${moduleId}/${firstLesson.id}`}
      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-blue-600 dark:hover:bg-gray-200 transition-all active:scale-95"
    >
      <PlayCircle size={18} />
      Entrar al Módulo
    </Link>
  )
}