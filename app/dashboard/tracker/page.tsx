'use client'

import { useState, useEffect, useCallback } from 'react'
import { uploadSubmission } from './actions' 
import { createClient } from '@/utils/supabase/client' 
import { Loader2, Upload, Clock, CheckCircle, Eye } from 'lucide-react'
import FeedbackModal from './FeedbackModal' // <--- 1. IMPORTAMOS EL MODAL

// Definimos la forma de nuestros datos
interface Submission {
  id: string
  image_url: string
  cut_type: string
  description: string
  status: 'pending' | 'reviewed' 
  created_at: string
  scores: any 
  feedback_ai: string | null
}

export default function TrackerPage() {
  const [loading, setLoading] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  
  // 2. ESTADO PARA CONTROLAR EL MODAL
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
      // 1. Primero obtenemos el usuario actual para saber "Quién soy"
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        // 2. FILTRO MAESTRO: Forzamos que solo traiga mis filas
        // Esto anula el efecto visual de "ver todo" que tiene el Admin por RLS
        .eq('student_id', user.id) 
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching history:', error)
      } else if (data) {
        // console.log("Mis entregas:", data)
        setSubmissions(data as Submission[])
      }
    }, [supabase])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await uploadSubmission(formData)
      setPreview(null)
      alert("¡Práctica enviada correctamente!")
      
      const form = document.querySelector('form') as HTMLFormElement
      form?.reset()

      await fetchHistory()
      
    } catch (error) {
      console.error(error)
      alert("Error al subir la práctica")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10 relative">
      
      {/* 3. RENDERIZADO CONDICIONAL DEL MODAL */}
      {selectedSubmission && (
        <FeedbackModal 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
        />
      )}

      {/* SECCIÓN 1: FORMULARIO */}
      <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6" /> 
          Nueva Práctica
        </h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Evidencia Fotográfica</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                required 
                onChange={handleImageChange}
                className="block w-full text-sm border border-zinc-700 rounded p-2 bg-zinc-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-400">Tipo de Corte</label>
              <select name="cutType" required className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 focus:outline-none focus:border-blue-500">
                <option value="">Selecciona uno...</option>
                <option value="Low Fade">Low Fade</option>
                <option value="Mid Fade">Mid Fade</option>
                <option value="High Fade">High Fade</option>
                <option value="Taper Fade">Taper Fade</option>
                <option value="Buzz Cut">Buzz Cut</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-400">Notas Técnicas</label>
            <textarea 
              name="description" 
              placeholder="Detalles sobre la técnica usada..."
              className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 focus:outline-none focus:border-blue-500"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-4">
            {preview && (
              <div className="relative w-16 h-16 rounded overflow-hidden border border-zinc-600">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Procesando...</>
              ) : (
                'Enviar a Revisión'
              )}
            </button>
          </div>
        </form>
      </section>

      {/* SECCIÓN 2: HISTORIAL */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-zinc-400" />
          Historial de Entregas
        </h2>

        {submissions.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-zinc-700 rounded-lg text-zinc-500">
            No has enviado prácticas todavía.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {submissions.map((sub) => (
              <div 
                key={sub.id} 
                // 4. INTERACCIÓN: Solo abre el modal si está 'reviewed'
                onClick={() => sub.status === 'reviewed' && setSelectedSubmission(sub)}
                className={`
                  group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all
                  ${sub.status === 'reviewed' ? 'cursor-pointer hover:border-blue-500 hover:shadow-blue-900/20 hover:shadow-lg' : 'cursor-default opacity-80'}
                `}
              >
                
                <div className="relative aspect-square">
                  <img src={sub.image_url} alt={sub.cut_type} className="w-full h-full object-cover" />
                  
                  {/* Overlay al hacer Hover (Solo si está reviewed) */}
                  {sub.status === 'reviewed' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Eye size={12}/> Ver Feedback
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    {sub.status === 'reviewed' ? (
                      <span className="bg-green-500/90 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle size={12} /> Nota Lista
                      </span>
                    ) : (
                      <span className="bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Clock size={12} /> Pendiente
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-lg">{sub.cut_type}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {sub.description || "Sin descripción"}
                  </p>
                  
                  <div className="mt-3 flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800 pt-2">
                    <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                    {sub.status === 'reviewed' && (
                      <span className="text-blue-400 font-bold flex items-center gap-1">
                         Ver Detalles &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}