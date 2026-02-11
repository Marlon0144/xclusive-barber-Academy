'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, BookOpen, Video, GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
// Importamos las actions (asegúrate de que updateModuleTitle y updateLessonTitle estén en actions.ts)
import { createModule, deleteModule, createLesson, deleteLesson, updateModuleTitle, updateLessonTitle } from './actions'
import EditableText from './EditableText' // <--- Asegúrate de tener este componente creado

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
    <div className="space-y-6">
      
      {/* BOTÓN SUPERIOR */}
      <div className="flex justify-end">
        <button 
          onClick={handleCreateModule}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>Crear Módulo</span>
        </button>
      </div>

      {/* LISTA DE MÓDULOS */}
      <div className="space-y-4">
        {initialModules.map((module) => (
          <div key={module.id} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/40">
            
            {/* CABECERA DEL MÓDULO */}
            <div 
                className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors group select-none cursor-pointer"
                onClick={() => toggleModule(module.id)}
            >
              <div 
                className="flex items-center gap-3 flex-1"
              >
                {/* Icono de carpeta abierta/cerrada */}
                {expandedModules[module.id] 
                  ? <ChevronDown size={20} className="text-blue-400" /> 
                  : <ChevronRight size={20} className="text-gray-500" />
                }
                
                {/* TÍTULO EDITABLE DEL MÓDULO */}
                <EditableText 
                  initialText={module.title}
                  onSave={(newTitle) => handleRenameModule(module.id, newTitle)}
                  className="font-semibold text-lg text-white"
                />
                
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700 ml-2">
                  {module.lessons?.length || 0} lecciones
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                    e.stopPropagation() // Evitar toggle al borrar
                    handleDeleteModule(module.id)
                }}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Eliminar Módulo"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* CONTENIDO DEL MÓDULO (LECCIONES) */}
            {expandedModules[module.id] && (
              <div className="bg-black/20 border-t border-gray-800">
                {module.lessons?.length > 0 ? (
                  <div className="divide-y divide-gray-800/50">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 pl-10 hover:bg-white/5 group transition-colors">
                        
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical size={16} className="text-gray-600 cursor-move hover:text-gray-400" />
                          <Video size={16} className="text-blue-500/70" />
                          
                          {/* TÍTULO EDITABLE DE LA LECCIÓN */}
                          <EditableText 
                            initialText={lesson.title}
                            onSave={(newTitle) => handleRenameLesson(lesson.id, newTitle)}
                            className="text-gray-300 font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {/* BOTÓN EDITAR: Redirige al editor */}
                          <button 
                            onClick={() => router.push(`/dashboard/admin/lessons/${lesson.id}/edit`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded text-xs font-bold transition-all border border-blue-600/20"
                          >
                            <Edit size={14} />
                            Contenido
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Borrar Lección"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 italic">
                    Este módulo está vacío.
                  </div>
                )}

                {/* BOTÓN AGREGAR LECCIÓN (AL FINAL DE LA LISTA) */}
                <button 
                  onClick={() => handleCreateLesson(module.id)}
                  className="w-full py-3 text-sm text-gray-500 hover:text-blue-400 hover:bg-blue-500/5 transition-colors flex items-center justify-center gap-2 border-t border-gray-800 border-dashed"
                >
                  <Plus size={16} />
                  <span>Agregar nueva lección a {module.title}</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {initialModules.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-700" />
            <h3 className="text-xl font-bold text-gray-300">Curso vacío</h3>
            <p className="text-gray-500 mt-2">Crea tu primer módulo para comenzar la estructura.</p>
          </div>
        )}
      </div>
    </div>
  )
}