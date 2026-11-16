import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, PlayCircle, ChevronLeft } from 'lucide-react'
import { getServerDictionary, getServerLanguage } from '@/lib/i18n/server'
import { pick } from '@/lib/i18n/localize'

interface LessonProgress {
  is_completed: boolean
}

interface Lesson {
  id: string
  title: string
  title_en: string | null
  position: number
  module_id: string
  lesson_progress: LessonProgress[] | null
}

interface CourseSidebarProps {
  moduleId: string
}

// cached fetch to avoid duplicated calls within the same render/or when
// the sidebar is used more than once.
const fetchLessonsWithProgress = React.cache(async (moduleId: string) => {
  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      id, 
      title, 
      title_en,
      position, 
      module_id,
      lesson_progress ( is_completed )
    `)
    .eq('module_id', moduleId)
    .order('position', { ascending: true })

  return lessons as Lesson[] | null
})

export default async function CourseSidebar({ moduleId }: CourseSidebarProps) {
  // start the promise early (async-defer-await) and use cache
  const lessonsPromise = fetchLessonsWithProgress(moduleId)
  // REQ-FUNC-003: diccionario + idioma para localizar la lista de lecciones.
  const dictionaryPromise = getServerDictionary()
  const languagePromise = getServerLanguage()

  const [lessons, dictionary, language] = await Promise.all([
    lessonsPromise,
    dictionaryPromise,
    languagePromise,
  ])

  const sidebarDict = dictionary.dashboard.lesson.sidebar

  if (!lessons) return <div className="p-4">{sidebarDict.loading}</div>

  // Cálculos para la barra de progreso
  const totalLessons = lessons.length
  const completedLessons = lessons.filter((l: Lesson) => l.lesson_progress?.[0]?.is_completed).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="w-full md:w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">

      {/* --- CABECERA SIDEBAR --- */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-4 transition-colors uppercase tracking-wide"
        >
          <ChevronLeft size={14} />
          {sidebarDict.backToCourses}
        </Link>

        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-4">
          {sidebarDict.moduleContent}
        </h3>

        {/* Barra de Progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>{sidebarDict.yourProgress}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* --- LISTA DE LECCIONES --- */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {lessons.map((lesson: Lesson) => {
          const isCompleted = lesson.lesson_progress?.[0]?.is_completed

          return (
            <Link
              key={lesson.id}
              href={`/dashboard/courses/${moduleId}/${lesson.id}`}
              className={`
                group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border
                ${isCompleted
                  ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'
                  : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }
              `}
            >
              <div className={`mt-0.5 flex-shrink-0 ${isCompleted ? 'text-green-600 dark:text-green-500' : 'text-gray-400 group-hover:text-blue-500'}`}>
                {isCompleted ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
              </div>

              <div className="flex-1">
                <span className={`text-sm font-medium leading-snug block ${isCompleted
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}>
                  {pick(language, {
                    es: lesson.title,
                    en: lesson.title_en ?? null,
                  })}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}