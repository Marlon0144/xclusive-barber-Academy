'use client'

import { useState, useEffect } from 'react'
import YouTube, { YouTubeEvent } from 'react-youtube' // Librería nativa
import { createClient } from '@/utils/supabase/client'
import { getYouTubeID } from '@/utils/get-youtube-id' // La función que creamos en el paso 2

interface VideoPlayerProps {
  url: string | null
  lessonId: string
}

export default function VideoPlayer({ url, lessonId }: VideoPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const supabase = createClient()
  const videoId = getYouTubeID(url) // Extraemos el ID limpio

  // Verificar progreso inicial
  useEffect(() => {
    const checkProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('lesson_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle()

      if (data?.is_completed) setIsCompleted(true)
    }
    checkProgress()
  }, [lessonId, supabase])

  // Lógica cuando termina el video
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onPlayerEnd = async (_event: YouTubeEvent) => {
    console.log("✅ Video terminado (Evento Nativo YouTube)")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id, lesson_id' })

    if (!error) setIsCompleted(true)
  }

  // Configuración del player
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1, // Quita logos extra
      rel: 0, // Evita videos relacionados de canales random al final
    },
  }

  if (!videoId) {
    return <div className="p-10 bg-gray-900 text-gray-400 text-center rounded-xl">URL de video no válida</div>
  }

  return (
    <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-lg bg-black border border-gray-800">
      <div className="absolute top-0 left-0 w-full h-full">
        {error ? (
          <div className="flex h-full items-center justify-center text-red-400 bg-gray-900">
            ❌ Video no disponible
          </div>
        ) : (
          <YouTube
            videoId={videoId}
            opts={opts}
            className="w-full h-full" // Clase para el iframe
            onReady={() => setIsLoading(false)} // El player avisa cuando cargó
            onError={() => { setIsLoading(false); setError(true); }}
            onEnd={onPlayerEnd} // <--- ESTO ES LO QUE NECESITAMOS
          />
        )}

        {/* Spinner limpio */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Etiqueta de éxito */}
        {isCompleted && (
          <div className="absolute top-4 right-4 z-20 animate-in fade-in zoom-in duration-500">
            <div className="bg-green-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm border border-green-400/30">
              <span>✓ Lección Completada</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}