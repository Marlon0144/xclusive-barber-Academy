'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, ChevronRight, BookOpen, Video, GripVertical, FolderOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
// Importamos las actions (asegúrate de que updateModuleTitle y updateLessonTitle estén en actions.ts)
import { createModule, deleteModule, createLesson, deleteLesson, updateModuleTitle, updateLessonTitle, updateModuleCompetency } from './actions'
import { COMPETENCY_LABELS, type CompetencyKey } from '@/types/progress'
import EditableText from './EditableText'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Tipos locales para la UI
type Lesson = {
  id: string
  title: string
  order_index: number
}

type Module = {
  id: string
  title: string
  order_index: number
  competency: string | null
  lessons: Lesson[]
}

export default function AdminCourseList({ initialModules }: { initialModules: Module[] }) {
  // Estado local para saber qué módulos están abiertos (expandidos)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  // --- MANEJADORES DE EVENTOS ---

  const handleCreateModule = async () => {
    const title = window.prompt('Nombre del nuevo Módulo (Ej: Corte Clásico):')
    if (!title) return
    await createModule(title)
    router.refresh()
  }

  const handleDeleteModule = async (id: string) => {
    if (!confirm('¿Estás seguro de borrar este módulo y todas sus lecciones?')) return
    await deleteModule(id)
    router.refresh()
  }

  const handleCreateLesson = async (moduleId: string) => {
    const title = window.prompt('Título de la Lección:')
    if (!title) return
    await createLesson(moduleId, title)
    // Forzamos abrir el módulo para ver la nueva lección
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }))
    router.refresh()
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('¿Borrar esta lección permanentemente?')) return
    await deleteLesson(id)
    router.refresh()
  }

  // --- NUEVOS MANEJADORES PARA RENOMBRAR ---
  const handleRenameModule = async (moduleId: string, newTitle: string) => {
    await updateModuleTitle(moduleId, newTitle)
    router.refresh()
  }

  const handleRenameLesson = async (lessonId: string, newTitle: string) => {
    await updateLessonTitle(lessonId, newTitle)
    router.refresh()
  }

  const handleUpdateCompetency = async (moduleId: string, value: string) => {
    const competency = value === '' ? null : value
    await updateModuleCompetency(moduleId, competency)
    router.refresh()
  }

  return (
    <div className="space-y-8">

      {/* BOTÓN SUPERIOR */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateModule}
          className="bg-gold-500 hover:bg-gold-600 text-black font-bold tracking-widest text-xs md:text-sm"
        >
          <Plus size={18} className="mr-1.5 md:mr-2" />
          CREAR MÓDULO
        </Button>
      </div>

      {/* LISTA DE MÓDULOS */}
      <div className="space-y-4 md:space-y-6">
        {initialModules.map((module, index) => (
          <div key={module.id} className="group border border-white/5 rounded-sm overflow-hidden bg-surface transition-all hover:border-white/10">

            {/* CABECERA DEL MÓDULO */}
            <div
              className={cn(
                "flex items-start md:items-center justify-between p-3 md:p-5 cursor-pointer bg-gradient-to-r from-[#0A0A0A] to-transparent hover:from-[#111] transition-all border-l-4 gap-2",
                expandedModules[module.id] ? "border-gold-500 bg-white/5" : "border-transparent"
              )}
              onClick={() => toggleModule(module.id)}
            >
              <div
                className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0"
              >
                {/* Icono de carpeta abierta/cerrada */}
                <div className={cn("p-1.5 md:p-2 rounded-full bg-black/50 border border-white/5 text-zinc-500 transition-colors shrink-0 mt-0.5 md:mt-0", expandedModules[module.id] && "text-gold-500 border-gold-500/30")}>
                  {expandedModules[module.id]
                    ? <FolderOpen size={18} className="md:w-5 md:h-5" />
                    : <ChevronRight size={18} className="md:w-5 md:h-5" />
                  }
                </div>

                {/* INFO DEL MÓDULO */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest border border-white/10 px-1.5 md:px-2 rounded-sm bg-black/20">
                      Módulo 0{index + 1}
                    </span>
                    <span className="text-[10px] md:text-xs bg-black/50 text-zinc-500 px-1.5 md:px-2 py-0.5 rounded-full border border-white/5">
                      {module.lessons?.length || 0} lecciones
                    </span>
                  </div>

                  {/* TÍTULO EDITABLE */}
                  <EditableText
                    initialText={module.title}
                    onSave={(newTitle) => handleRenameModule(module.id, newTitle)}
                    className="font-serif text-base md:text-xl text-white mt-1 hover:text-gold-500 transition-colors"
                  />

                  {/* SELECTOR DE COMPETENCIA */}
                  <select
                    value={module.competency ?? ''}
                    onChange={(e) => handleUpdateCompetency(module.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1.5 text-[10px] uppercase tracking-widest font-bold bg-black/60 border border-white/10 text-zinc-400 rounded-sm px-2 py-1.5 md:py-1 hover:border-gold-500/40 focus:border-gold-500 focus:outline-none cursor-pointer transition-colors min-h-[32px] md:min-h-0"
                  >
                    <option value="">Sin competencia</option>
                    {(Object.keys(COMPETENCY_LABELS) as CompetencyKey[]).map((key) => (
                      <option key={key} value={key}>
                        {COMPETENCY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation() // Evitar toggle al borrar
                  handleDeleteModule(module.id)
                }}
                className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0"
                title="Eliminar Módulo"
              >
                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
              </Button>
            </div>

            {/* CONTENIDO DEL MÓDULO (LECCIONES) */}
            {expandedModules[module.id] && (
              <div className="bg-black/40 border-t border-white/5 p-1.5 md:p-2">
                {module.lessons?.length > 0 ? (
                  <div className="space-y-1">
                    {module.lessons.map((lesson, lIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between p-2.5 md:p-3 pl-3 md:pl-4 rounded-sm hover:bg-white/5 group/lesson transition-colors border border-transparent hover:border-white/5 ml-3 md:ml-8 relative">
                        {/* Connecting Line — hidden on mobile for space */}
                        <div className="absolute -left-3 md:-left-6 top-1/2 w-2 md:w-4 h-[1px] bg-zinc-800"></div>
                        <div className="absolute -left-3 md:-left-6 top-0 bottom-1/2 w-[1px] bg-zinc-800"></div>

                        <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0">
                          <GripVertical size={14} className="text-zinc-700 cursor-move hover:text-zinc-500 hidden md:block shrink-0" />

                          <div className={cn("text-zinc-600 group-hover/lesson:text-blue-400 transition-colors shrink-0")}>
                            <Video size={14} className="md:w-4 md:h-4" />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Lección 0{lIndex + 1}</span>
                            {/* TÍTULO EDITABLE */}
                            <EditableText
                              initialText={lesson.title}
                              onSave={(newTitle) => handleRenameLesson(lesson.id, newTitle)}
                              className="text-zinc-300 font-medium text-xs md:text-sm hover:text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2 md:opacity-0 md:group-hover/lesson:opacity-100 transition-opacity shrink-0">
                          {/* BOTÓN EDITAR */}
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => router.push(`/dashboard/admin/lessons/${lesson.id}/edit`)}
                            className="h-7 text-[10px] uppercase font-bold tracking-wider bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-2 md:px-3"
                          >
                            <Edit size={12} className="md:mr-1" />
                            <span className="hidden md:inline">Editar</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
                            title="Borrar Lección"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center">
                    <p className="text-zinc-600 text-sm italic mb-4">Este módulo está vacío.</p>
                  </div>
                )}

                {/* BOTÓN AGREGAR LECCIÓN */}
                <Button
                  variant="ghost"
                  onClick={() => handleCreateLesson(module.id)}
                  className="w-full mt-2 py-4 md:py-6 text-[10px] md:text-xs uppercase tracking-widest font-bold text-zinc-500 hover:text-blue-400 hover:bg-blue-500/5 transition-colors border border-dashed border-zinc-800 hover:border-blue-500/30"
                >
                  <Plus size={14} className="mr-1.5 md:mr-2" />
                  Agregar lección
                </Button>
              </div>
            )}
          </div>
        ))}

        {initialModules.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-sm bg-surface/30 flex flex-col items-center">
            <div className="bg-black/50 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-zinc-700 border border-white/5">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Curso vacío</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
              Aún no has creado ningún módulo. Comienza tu plan de estudios ahora.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}