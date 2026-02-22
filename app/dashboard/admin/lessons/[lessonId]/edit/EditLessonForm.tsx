'use client'

import { useState, useTransition, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { updateLessonContent } from '@/app/dashboard/admin/lessons/[lessonId]/edit/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import YouTube from 'react-youtube'
import { Save, Loader2, Video, ArrowLeft, MonitorPlay } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Lazy load RichTextEditor (heavy Tiptap bundle ~50KB) - only on admin pages
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse border border-gray-200 dark:border-gray-800"></div>
})

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

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const getYoutubeId = (url: string | null) => {
        if (!url) return null
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const videoId = useMemo(() => getYoutubeId(videoUrl), [videoUrl])

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
        <div className="min-h-screen text-white p-6 pb-24">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER STICKY */}
                <div className="sticky top-4 z-50 bg-black/80 backdrop-blur-xl p-4 rounded-sm border border-gold-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin/courses">
                            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-zinc-400 hover:text-white rounded-full">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
                                <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold">Modo Editor</p>
                            </div>
                            <h1 className="font-serif text-xl text-white tracking-wide">{lesson.title}</h1>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-gold-500 hover:bg-gold-600 text-black font-bold tracking-widest min-w-[140px]"
                    >
                        {isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                        {isPending ? 'GUARDANDO...' : 'GUARDAR'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: EDITOR DE CONTENIDO */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-surface border border-white/5 rounded-sm p-6 relative group hover:border-white/10 transition-colors">
                            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Edit2IconDecorator />
                            </div>
                            <h2 className="text-lg font-serif text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                                Contenido Escrito
                            </h2>
                            <div className="bg-black/30 rounded-sm border border-white/5 min-h-[400px]">
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: VIDEO SETTINGS */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface border border-white/5 rounded-sm p-6 sticky top-28 group hover:border-gold-500/30 transition-colors">
                            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
                                <MonitorPlay className="w-4 h-4 text-gold-500" />
                                <h2 className="text-lg font-serif text-white">Configuración de Video</h2>
                            </div>

                            {/* PREVIEW DEL VIDEO */}
                            <div className="aspect-video w-full bg-black rounded-sm overflow-hidden border border-white/10 relative shadow-lg mb-6">
                                {videoId ? (
                                    <div className="relative w-full h-full">
                                        <YouTube
                                            videoId={videoId}
                                            className="w-full h-full"
                                            iframeClassName="w-full h-full absolute inset-0"
                                            opts={{ width: '100%', height: '100%', playerVars: { modestbranding: 1 } }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-50">
                                        <div className="p-4 rounded-full bg-white/5 border border-white/5">
                                            <Video size={32} />
                                        </div>
                                        <p className="text-xs uppercase tracking-widest">Sin video asignado</p>
                                    </div>
                                )}
                            </div>

                            {/* INPUT URL */}
                            <div className="space-y-2">
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold ml-1">Enlace de YouTube</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={videoUrl || ''}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        className="pl-9 bg-black/50 border-white/10 focus:border-gold-500 text-xs font-mono text-gold-500"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                    <Video className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                                </div>
                                <p className="text-[10px] text-zinc-600 pl-1">
                                    Pega la URL completa del video. Se extraerá el ID automáticamente.
                                </p>
                            </div>

                            {/* ESTADO */}
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Estado del contenido:</span>
                                    <span className="text-green-500 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Activo
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Edit2IconDecorator() {
    return (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/5">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}