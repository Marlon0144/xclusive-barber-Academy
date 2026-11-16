import { createClient } from '@/utils/supabase/server'
import CourseListView from '@/components/dashboard/courses/CourseListView'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function CoursesIndexPage() {
  const supabase = await createClient()

  // REQ-FUNC-002: título del header localizado.
  const dict = await getServerDictionary()
  const coursesIndex = dict.dashboard.coursesIndex

  // 1. Obtenemos los módulos ordenados
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index', { ascending: true })

  // prepare first lesson map using parallel requests to avoid waterfall/N+1
  const firstLessonMap: Record<string, string | null> = {}
  if (modules && modules.length) {
    const promises = modules.map((m) =>
      supabase
        .from('lessons')
        .select('id')
        .eq('module_id', m.id)
        .order('order_index', { ascending: true })
        .limit(1)
        .single()
    )
    const results = await Promise.all(promises)
    results.forEach((r, idx) => {
      firstLessonMap[modules[idx].id] = r.data?.id ?? null
    })
  }

  return (
    <>
      <DashboardPageHeader title={coursesIndex.headerTitle} bgColor="#161616" />
      <CourseListView 
        modules={modules || []} 
        firstLessonMap={firstLessonMap} 
      />
    </>
  )
}

