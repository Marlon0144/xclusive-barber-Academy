import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { CheckCircle, PlayCircle } from 'lucide-react' // Asegúrate de tener lucide-react instalado

interface CourseSidebarProps {
  moduleId: string
}

export default async function CourseSidebar({ moduleId }: CourseSidebarProps) {
  const supabase = await createClient()

  // 1. CONSULTA RELACIONAL
  // Pedimos las lecciones Y (dentro de ellas) el progreso del usuario.
  // Gracias a las RLS (Políticas de Seguridad) que configuramos en la BD,
  // 'lesson_progress' solo traerá los datos del usuario conectado. ¡Magia! ✨
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      id, 
      title, 
      position, 
      module_id,
      lesson_progress (
        is_completed
      )
    `)
    .eq('module_id', moduleId)
    .order('position', { ascending: true })

  if (!lessons || lessons.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No hay lecciones disponibles.</div>
  }

  return (
    <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Contenido del Módulo</h3>
        <p className="text-xs text-gray-500 mt-1">
          {lessons.filter((l: any) => l.lesson_progress?.[0]?.is_completed).length} / {lessons.length} completado
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {lessons.map((lesson: any, index) => {
          // Verificamos si existe el array de progreso y si está completado
          const isCompleted = lesson.lesson_progress?.[0]?.is_completed

          return (
            <Link
              key={lesson.id}
              href={`/dashboard/courses/${moduleId}/${lesson.id}`}
              className="block p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="flex items-start gap-3">
                {/* ICONO: Cambia según el estado */}
                <div className={`mt-0.5 flex-shrink-0 transition-colors ${
                  isCompleted ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={20} fill="currentColor" className="text-green-100 dark:text-green-900" />
                  ) : (
                    <PlayCircle size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <span className={`text-sm font-medium transition-colors ${
                    isCompleted 
                      ? 'text-gray-500 dark:text-gray-400 line-through decoration-gray-300' 
                      : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    {lesson.title}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}