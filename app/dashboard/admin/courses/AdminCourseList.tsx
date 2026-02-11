'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, BookOpen, Video, GripVertical, FolderOpen, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
// Importamos las actions (asegúrate de que updateModuleTitle y updateLessonTitle estén en actions.ts)
import { createModule, deleteModule, createLesson, deleteLesson, updateModuleTitle, updateLessonTitle } from './actions'
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

  return (
    <div className="space-y-8">

      {/* BOTÓN SUPERIOR */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateModule}
          className="bg-gold-500 hover:bg-gold-600 text-black font-bold tracking-widest"
        >
          <Plus size={18} className="mr-2" />
          CREAR MÓDULO
        </Button>
      </div>

      {/* LISTA DE MÓDULOS */}
      <div className="space-y-6">
        {initialModules.map((module, index) => (
          <div key={module.id} className="group border border-white/5 rounded-sm overflow-hidden bg-surface transition-all hover:border-white/10">

            {/* CABECERA DEL MÓDULO */}
            <div
              className={cn(
                "flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-[#0A0A0A] to-transparent hover:from-[#111] transition-all border-l-4",
                expandedModules[module.id] ? "border-gold-500 bg-white/5" : "border-transparent"
              )}
              onClick={() => toggleModule(module.id)}
            >
              <div
                className="flex items-center gap-4 flex-1"
              >
                {/* Icono de carpeta abierta/cerrada */}
                <div className={cn("p-2 rounded-full bg-black/50 border border-white/5 text-zinc-500 transition-colors", expandedModules[module.id] && "text-gold-500 border-gold-500/30")}>
                  {expandedModules[module.id]
                    ? <FolderOpen size={20} />
                    : <ChevronRight size={20} />
                  }
                </div>

                {/* INFO DEL MÓDULO */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest border border-white/10 px-2 rounded-sm bg-black/20">
                      Módulo 0{index + 1}
                    </span>
                    <span className="text-xs bg-black/50 text-zinc-500 px-2 py-0.5 rounded-full border border-white/5">
                      {module.lessons?.length || 0} lecciones
                    </span>
                  </div>

                  {/* TÍTULO EDITABLE */}
                  <EditableText
                    initialText={module.title}
                    onSave={(newTitle) => handleRenameModule(module.id, newTitle)}
                    className="font-serif text-xl text-white mt-1 hover:text-gold-500 transition-colors"
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation() // Evitar toggle al borrar
                  handleDeleteModule(module.id)
                }}
                className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                title="Eliminar Módulo"
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {/* CONTENIDO DEL MÓDULO (LECCIONES) */}
            {expandedModules[module.id] && (
              <div className="bg-black/40 border-t border-white/5 p-2">
                {module.lessons?.length > 0 ? (
                  <div className="space-y-1">
                    {module.lessons.map((lesson, lIndex) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 pl-4 rounded-sm hover:bg-white/5 group/lesson transition-colors border border-transparent hover:border-white/5 ml-8 relative">
                        {/* Connecting Line */}
                        <div className="absolute -left-6 top-1/2 w-4 h-[1px] bg-zinc-800"></div>
                        <div className="absolute -left-6 top-0 bottom-1/2 w-[1px] bg-zinc-800"></div>

                        <div className="flex items-center gap-4 flex-1">
                          <GripVertical size={16} className="text-zinc-700 cursor-move hover:text-zinc-500" />

                          <div className={cn("text-zinc-600 group-hover/lesson:text-blue-400 transition-colors")}>
                            <Video size={16} />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Lección 0{lIndex + 1}</span>
                            {/* TÍTULO EDITABLE */}
                            <EditableText
                              initialText={lesson.title}
                              onSave={(newTitle) => handleRenameLesson(lesson.id, newTitle)}
                              className="text-zinc-300 font-medium text-sm hover:text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                          {/* BOTÓN EDITAR */}
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => router.push(`/dashboard/admin/lessons/${lesson.id}/edit`)}
                            className="h-7 text-[10px] uppercase font-bold tracking-wider bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                          >
                            <Edit size={12} className="mr-1" />
                            Editar
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
                  className="w-full mt-2 py-6 text-xs uppercase tracking-widest font-bold text-zinc-500 hover:text-blue-400 hover:bg-blue-500/5 transition-colors border border-dashed border-zinc-800 hover:border-blue-500/30"
                >
                  <Plus size={14} className="mr-2" />
                  Agregar lección al módulo
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