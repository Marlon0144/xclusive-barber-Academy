'use client'

import { useState } from 'react'
import { submitGrade } from './actions'
import { Loader2, CheckCircle } from 'lucide-react'

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
      // No necesitamos alerta, la UI se actualizará sola al desaparecer la carta
    } catch (error) {
      alert('Error al calificar')
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col md:flex-row">
      {/* 1. La Foto del Estudiante */}
      <div className="md:w-1/2 relative h-64 md:h-auto">
        <img src={submission.image_url} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 bg-black/60 p-2 w-full">
          <p className="font-bold text-white">{submission.cut_type}</p>
          <p className="text-xs text-zinc-300 truncate">{submission.description}</p>
        </div>
      </div>

      {/* 2. Panel de Evaluación */}
      <div className="md:w-1/2 p-4 space-y-4">
        <h3 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">Evaluación Técnica</h3>
        
        {['fade', 'cleanliness', 'technique', 'symmetry'].map((criteria) => (
          <div key={criteria}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">{criteria}</span>
              <span className="font-mono text-blue-400">{scores[criteria as keyof typeof scores]}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={scores[criteria as keyof typeof scores]}
              onChange={(e) => setScores({...scores, [criteria]: Number(e.target.value)})}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}

        <button 
          onClick={handleGrade}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold flex justify-center items-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
          {loading ? 'Guardando...' : 'Calificar y Generar Feedback'}
        </button>
      </div>
    </div>
  )
}