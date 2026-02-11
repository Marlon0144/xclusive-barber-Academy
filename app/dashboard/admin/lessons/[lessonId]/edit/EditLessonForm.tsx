'use client'

import { useState, useTransition, useEffect } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { updateLessonContent } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // <--- 1. IMPORTANTE: Importamos Link
import YouTube from 'react-youtube'
import { Save, Loader2, Video, ArrowLeft } from 'lucide-react'

// Definimos bien la interfaz para saber qué datos trae la lección
interface LessonData {
  id: string
  title: string
  content: string | null
  video_url: string | null 
}

export default function EditLessonForm({ lesson }: { lesson: LessonData }) {
  const [content, setContent] = useState(lesson.content || '')
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || '') 
  
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const getYoutubeId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  useEffect(() => {
    const id = getYoutubeId(videoUrl)
    setVideoId(id)
  }, [videoUrl])

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateLessonContent(lesson.id, content, videoUrl)
      if (result.error) {
        alert('Error: ' + result.error)
      } else {
        alert('¡Guardado correctamente!')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* HEADER */}
            <div className="flex items-center justify-between sticky top-4 z-50 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                    
                    {/* --- 2. CORRECCIÓN AQUÍ: CAMBIAMOS BUTTON POR LINK --- */}
                    {/* Esto asegura que siempre vuelvas a la gestión de cursos, no al limbo */}
                    <Link 
                        href="/dashboard/admin/courses" 
                        className="p-2 hover:bg-white/10 rounded-full transition text-white flex items-center justify-center"
                        title="Volver a la lista de cursos"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="font-bold text-lg">{lesson.title}</h1>
                        <p className="text-xs text-gray-400">Modo Editor</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                    <span>Guardar</span>
                </button>
            </div>

            {/* SECCIÓN DE VIDEO PRINCIPAL */}
            <div className="space-y-4">
                {/* PREVIEW DEL VIDEO */}
                <div className="aspect-video w-full bg-gray-950 rounded-xl overflow-hidden border border-white/10 relative group shadow-lg">
                    {videoId ? (
                        <YouTube 
                            videoId={videoId} 
                            className="w-full h-full" 
                            iframeClassName="w-full h-full" 
                            opts={{ width: '100%', height: '100%', playerVars: { modestbranding: 1 } }} 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                            <Video size={64} className="opacity-20"/>
                            <p className="text-sm">Sin video asignado</p>
                        </div>
                    )}
                </div>
                
                {/* INPUT URL */}
                <div className="flex gap-4 items-center bg-gray-900 p-4 rounded-lg border border-white/10 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <span className="text-sm font-medium text-gray-400 shrink-0">YouTube URL:</span>
                    <input 
                        type="text" 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 text-sm"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>
            </div>

            {/* EDITOR DE TEXTO */}
            <div className="pt-8 pb-20">
                <div className="mb-6 border-b border-white/10 pb-2 flex justify-between items-end">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Contenido de la Lección</h2>
                </div>
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        </div>
    </div>
  )
}