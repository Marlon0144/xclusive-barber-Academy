
import { createClient } from '@/utils/supabase/server'
import CourseListView from '@/components/dashboard/courses/CourseListView'

export default async function CoursesIndexPage() {
  const supabase = await createClient()

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
      // @ts-ignore
      firstLessonMap[modules[idx].id] = r.data?.id ?? null
    })
  }

  return (
    <CourseListView 
      modules={modules || []} 
      firstLessonMap={firstLessonMap} 
    />
  )
}

