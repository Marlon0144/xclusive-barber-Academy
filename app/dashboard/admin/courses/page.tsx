import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminCourseList from './AdminCourseList'
import { Settings, Star } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  // 1. Verificación de Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Traer Módulos y sus Lecciones (Query Anidada Potente)
  const { data: modules, error } = await supabase
    .from('modules')
    .select(`
      id, 
      title, 
      order_index,
      lessons (
        id, 
        title, 
        order_index
      )
    `)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error cargando estructura:', error)
    return <div className="text-red-500 p-8 text-center font-bold">Error cargando el curso. Revisa la consola del servidor.</div>
  }

  // 3. Ordenamiento en JS (Seguridad extra para los hijos)
  // Supabase ordena bien el padre, pero a veces los hijos vienen desordenados
  const sortedModules = modules?.map(mod => ({
    ...mod,
    lessons: Array.isArray(mod.lessons)
      ? mod.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      : []
  }))

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto space-y-12">

      {/* HEADER DE LA PÁGINA */}
      <header className="relative border-b border-white/10 pb-8">
        <div className="absolute top-0 right-0 opacity-10 hidden md:block">
          <Settings className="w-32 h-32 text-red-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-red-500 text-xs tracking-[0.3em] uppercase font-bold">Panel de Administración</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Gestión del Curso
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg font-light">
            Estructura el contenido de la academia. Crea módulos, organiza lecciones y mantén el plan de estudios actualizado.
          </p>
        </div>
      </header>

      {/* COMPONENTE INTERACTIVO */}
      <AdminCourseList initialModules={sortedModules || []} />

    </div>
  )
}