import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminCourseList from './AdminCourseList'

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
    return <div className="text-red-500 p-8">Error cargando el curso. Revisa la consola del servidor.</div>
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Estructura del Curso</h1>
          <p className="text-gray-400">
            Gestiona los módulos y lecciones de la academia. 
            El contenido que crees aquí se reflejará en la aplicación de los estudiantes.
          </p>
        </div>

        {/* COMPONENTE INTERACTIVO */}
        <AdminCourseList initialModules={sortedModules || []} />
        
      </div>
    </div>
  )
}