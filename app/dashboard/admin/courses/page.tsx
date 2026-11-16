import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminCourseList from './AdminCourseList'
import { Settings, Star } from 'lucide-react'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const dictionary = await getServerDictionary()
  const adminDict = dictionary.dashboard.admin

  // 1. Verificación de Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Traer Módulos y sus Lecciones (Query Anidada Potente) — incluye `_en`.
  const { data: modules, error } = await supabase
    .from('modules')
    .select(`
      id, 
      title, 
      title_en,
      description,
      description_en,
      order_index,
      competency,
      lessons (
        id, 
        title, 
        title_en,
        order_index
      )
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error cargando estructura:', error)
    return <div className="text-red-500 p-8 text-center font-bold">{adminDict.loadError}</div>
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
    <>
      <DashboardPageHeader title={adminDict.headerTitle} />
      <div className="min-h-screen px-4 py-6 md:p-8 max-w-5xl mx-auto space-y-8 md:space-y-12">

      {/* HEADER DE LA PÁGINA */}
      <header className="relative border-b border-white/10 pb-6 md:pb-8">
        <div className="absolute top-0 right-0 opacity-10 hidden md:block">
          <Settings className="w-32 h-32 text-red-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500" />
            <h2 className="text-red-500 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">{adminDict.panelLabel}</h2>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3 md:mb-4">
            {adminDict.courseManagement}
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm md:text-lg font-light">
            {adminDict.courseManagementDescription}
          </p>
        </div>
      </header>

      {/* COMPONENTE INTERACTIVO */}
      <AdminCourseList initialModules={sortedModules || []} />

      </div>
    </>
  )
}