'use client'

import { useState } from 'react'
import { submitGrade } from './actions'
import { Loader2, CheckCircle, Save, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function GradingCard({ submission }: { submission: any }) {
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState({
    fade: 5,
    cleanliness: 5,
    technique: 5,
    symmetry: 5
  })

  const handleGrade = async () => {
    setLoading(true)
    try {
      await submitGrade(submission.id, scores)
    } catch (error) {
      alert('Error al calificar')
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface border border-white/5 rounded-sm overflow-hidden flex flex-col md:flex-row group hover:border-green-500/30 transition-all duration-300 shadow-lg">
      {/* 1. La Foto del Estudiante */}
      <div className="md:w-1/2 relative min-h-[300px] md:h-auto overflow-hidden">
        <img src={submission.image_url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-900/80 text-green-400 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-green-500/20 uppercase tracking-wider">
              Estudiante
            </span>
          </div>
          <p className="font-serif text-2xl text-white mb-2">{submission.cut_type}</p>
          <p className="text-sm text-zinc-300 font-light leading-relaxed bg-black/40 p-3 rounded backdrop-blur-sm border border-white/5">
            {submission.description || "Sin descripción proporcionada."}
          </p>
        </div>
      </div>

      {/* 2. Panel de Evaluación */}
      <div className="md:w-1/2 p-8 space-y-6 flex flex-col justify-center bg-[#0A0A0A]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="font-serif text-white text-lg flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-500" />
            Evaluación Técnica
          </h3>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Escala 1-10</span>
        </div>

        <div className="space-y-5">
          {['fade', 'cleanliness', 'technique', 'symmetry'].map((criteria) => (
            <div key={criteria} className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-wider font-bold">
                <span className="text-zinc-400">{criteria}</span>
                <span className="text-gold-500 bg-gold-500/10 px-2 rounded">{scores[criteria as keyof typeof scores]}/10</span>
              </div>
              <input
                type="range"
                min="0" max="10"
                value={scores[criteria as keyof typeof scores]}
                onChange={(e) => setScores({ ...scores, [criteria]: Number(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 mt-auto">
          <Button
            onClick={handleGrade}
            disabled={loading}
            className="w-full font-bold tracking-widest bg-green-600 hover:bg-green-700 text-white border-none shadow-[0_0_15px_rgba(22,163,74,0.2)] md:h-12"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {loading ? 'GUARDANDO...' : 'CALIFICAR ENTREGA'}
          </Button>
        </div>
      </div>
    </div>
  )
}