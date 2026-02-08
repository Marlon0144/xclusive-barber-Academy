'use client'

import { useState, useTransition } from 'react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { updateLessonContent } from './actions'
import { useRouter } from 'next/navigation'
import YouTube from 'react-youtube'
import { Save, Loader2, Video, ArrowLeft } from 'lucide-react'

// Definición del Tipo
interface LessonData {
  id: string
  title: string
  content: string | null
  video_url: string | null
}

export default function EditLessonForm({ lesson }: { lesson: LessonData }) {
  const [content, setContent] = useState(lesson.content || '')
  const [videoUrl, setVideoUrl] = useState(lesson.video_url || '')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Extraer ID de Youtube
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  const videoId = getYoutubeId(videoUrl);

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
            <div className="flex items-center justify-between sticky top-4 z-50 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition">
                        <ArrowLeft size={20} />
                    </button>
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

            {/* VIDEO SECTION */}
            <div className="space-y-4">
                <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden border border-white/10 relative group">
                    {videoId ? (
                        <YouTube 
                            videoId={videoId} 
                            className="w-full h-full" 
                            opts={{ width: '100%', height: '100%', playerVars: { modestbranding: 1 } }} 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <Video size={64} className="opacity-20 mb-4"/>
                            <p>Sin video asignado</p>
                        </div>
                    )}
                </div>
                
                {/* Input URL Video */}
                <div className="flex gap-4 items-center bg-gray-900 p-4 rounded-lg border border-white/10">
                    <span className="text-sm font-medium text-gray-400">YouTube URL:</span>
                    <input 
                        type="text" 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 outline-none"
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>
            </div>

            {/* CONTENIDO (EDITOR) */}
            <div className="pt-8 pb-20">
                <div className="mb-6 border-b border-white/10 pb-2">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Contenido de la Lección</h2>
                </div>
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        </div>
    </div>
  )
}