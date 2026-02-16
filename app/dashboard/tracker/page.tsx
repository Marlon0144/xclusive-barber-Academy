'use client'

import { useState, useEffect, useCallback } from 'react'
import { uploadSubmission } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Upload, Clock, CheckCircle, Eye, Star, Camera, Scissors } from 'lucide-react'
import FeedbackModal from './FeedbackModal'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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

  // singleton client – stable reference
  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching history:', error)
    } else if (data) {
      setSubmissions(data as Submission[])
    }
  }, []) // supabase never changes

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
      // alert("¡Práctica enviada correctamente!") // Removed alert for cleaner UI

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
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12">

      {/* 3. RENDERIZADO CONDICIONAL DEL MODAL */}
      {selectedSubmission && (
        <FeedbackModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {/* HEADER */}
      <header className="relative border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            <h2 className="text-gold-500 text-xs tracking-[0.3em] uppercase font-bold">Progreso Técnico</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
            Mastery Tracker
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg font-light">
            Registra tus cortes, recibe feedback profesional y perfecciona tu técnica día a día.
          </p>
        </div>

        {/* Stats Summary (Optional Future Feature) */}
        <div className="flex items-center gap-4 text-right">
          <div className="bg-surface border border-white/5 px-6 py-3 rounded-sm">
            <div className="text-2xl font-serif text-gold-500">{submissions.length}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Entregas</div>
          </div>
          <div className="bg-surface border border-white/5 px-6 py-3 rounded-sm">
            <div className="text-2xl font-serif text-white">
              {submissions.filter(s => s.status === 'reviewed').length}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Revisadas</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-surface p-8 rounded-sm border border-white/5 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div className="absolute top-0 right-0 bg-gold-500/10 w-24 h-24 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>

            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
              <Camera className="w-5 h-5 text-gold-500" />
              Nueva Práctica
            </h2>

            <form action={handleSubmit} className="space-y-6">

              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Evidencia</label>
                <div className="relative group/upload cursor-pointer">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <div className={cn(
                    "border border-dashed border-zinc-700 rounded-sm p-8 flex flex-col items-center justify-center transition-all bg-black/20",
                    preview ? "border-gold-500 bg-black/50" : "group-hover/upload:border-gold-500/50 group-hover/upload:bg-white/5"
                  )}>
                    {preview ? (
                      <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-white/10 shadow-lg">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white uppercase tracking-widest font-bold">Cambiar Imagen</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-surface w-12 h-12 rounded-full flex items-center justify-center mb-3 text-gold-500 border border-gold-500/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                          <Upload size={20} />
                        </div>
                        <p className="text-sm text-zinc-400 font-medium">Click para subir foto</p>
                        <p className="text-xs text-zinc-600 mt-1">JPG, PNG max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Tipo de Corte</label>
                <div className="relative">
                  <select
                    name="cutType"
                    required
                    className="w-full h-10 bg-transparent border-b border-white/20 text-white text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none py-2 px-3 rounded-none"
                  >
                    <option value="" className="bg-black text-zinc-500">Seleccionar estilo...</option>
                    <option value="Low Fade" className="bg-black">Low Fade</option>
                    <option value="Mid Fade" className="bg-black">Mid Fade</option>
                    <option value="High Fade" className="bg-black">High Fade</option>
                    <option value="Taper Fade" className="bg-black">Taper Fade</option>
                    <option value="Buzz Cut" className="bg-black">Buzz Cut</option>
                    <option value="Scissor Cut" className="bg-black">Corte a Tijera</option>
                  </select>
                  <Scissors className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Notas Técnicas</label>
                <textarea
                  name="description"
                  placeholder="Describe los desafíos y técnicas utilizadas..."
                  className="w-full border border-white/20 rounded-sm p-3 bg-transparent text-sm focus:outline-none focus:border-gold-500 min-h-[100px] placeholder:text-zinc-600 text-white resize-y"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-bold tracking-widest mt-4"
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2" size={18} /> SUBIENDO...</>
                ) : (
                  'ENVIAR A REVISIÓN'
                )}
              </Button>
            </form>
          </section>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-xl font-serif text-white flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold-500" />
              Historial
            </h2>
            {/* Filter placeholder */}
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Orden: Reciente</span>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-20 bg-surface/30 rounded-sm border border-dashed border-white/10 flex flex-col items-center">
              <div className="bg-black/50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-zinc-600 border border-white/5">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-zinc-400 font-serif text-lg">Tu portafolio está vacío</p>
              <p className="text-zinc-600 text-sm mt-1">Sube tu primera práctica para comenzar tu registro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => sub.status === 'reviewed' && setSelectedSubmission(sub)}
                  className={`
                    group relative bg-surface border border-white/5 rounded-sm overflow-hidden transition-all duration-300
                    ${sub.status === 'reviewed'
                      ? 'cursor-pointer hover:border-gold-500/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                      : 'cursor-default opacity-80'}
                    `}
                >

                  <div className="relative aspect-video overflow-hidden">
                    <img src={sub.image_url} alt={sub.cut_type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {sub.status === 'reviewed' ? (
                        <span className="bg-[#0A1F0A] border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                          <CheckCircle size={10} className="text-green-500" />
                          CALIFICADO
                        </span>
                      ) : (
                        <span className="bg-[#1F120A] border border-orange-500/30 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                          <Clock size={10} className="text-orange-500" />
                          PENDIENTE
                        </span>
                      )}
                    </div>

                    {/* Hover Action */}
                    {sub.status === 'reviewed' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Eye size={16} className="text-gold-500" />
                          <span className="text-xs font-bold text-white tracking-widest">VER FEEDBACK</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-white group-hover:text-gold-500 transition-colors">{sub.cut_type}</h3>
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
                      {sub.description || "Sin notas técnicas añadidas."}
                    </p>

                    {sub.status === 'reviewed' && (
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Calificación Global</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1 w-4 rounded-full ${i <= 3 ? 'bg-gold-500' : 'bg-zinc-800'}`}></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}