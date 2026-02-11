'use client'

import { X, Star, Zap, Ruler, Scissors } from 'lucide-react'

// Definimos la estructura exacta de las notas para que TS no se queje
interface Scores {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

interface FeedbackModalProps {
  submission: any
  onClose: () => void
}

// Helper para renderizar barras de progreso
const ScoreBar = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1 text-zinc-300">
      <span className="flex items-center gap-2"><Icon size={14} className="text-blue-400" /> {label}</span>
      <span className="font-mono font-bold">{value}/10</span>
    </div>
    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${value >= 8 ? 'bg-green-500' : value >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
        style={{ width: `${value * 10}%` }}
      />
    </div>
  </div>
)

export default function FeedbackModal({ submission, onClose }: FeedbackModalProps) {
  if (!submission) return null

  // Casteamos scores para asegurar tipado
  const scores = submission.scores as Scores



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors text-white"
        >
          <X size={20} />
        </button>

        {/* COLUMNA IZQUIERDA: FOTO */}
        <div className="md:w-2/5 relative h-64 md:h-auto bg-black">
          <img
            src={submission.image_url}
            alt="Corte evaluado"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white font-bold text-xl">{submission.cut_type}</h3>
            <p className="text-zinc-400 text-xs">{new Date(submission.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS */}
        <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[80vh]">

          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            Resultados de Evaluación
          </h2>

          {/* 1. EL FEEDBACK DE LA IA */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6">
            <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={12} /> Feedback del Instructor (IA)
            </h4>
            <p className="text-zinc-200 text-sm leading-relaxed italic">
              &quot;{submission.feedback_ai}&quot;
            </p>
          </div>

          {/* 2. LAS NOTAS NUMÉRICAS */}
          <div className="space-y-2">
            <ScoreBar label="Fade / Desvanecido" value={scores.fade} icon={Scissors} />
            <ScoreBar label="Limpieza" value={scores.cleanliness} icon={Star} />
            <ScoreBar label="Técnica" value={scores.technique} icon={Ruler} />
            <ScoreBar label="Simetría" value={scores.symmetry} icon={Zap} />
          </div>

        </div>
      </div>
    </div>
  )
}