'use client'

import { Submission, Scores } from '@/types/submissions'

interface FeedbackModalProps {
  submission: Submission
  onClose: () => void
}

// ── Barra de puntuación — estilo dark premium ──────────────────────────────
const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1.5">
      <span
        className="font-extralight text-[10px] uppercase"
        style={{ letterSpacing: '0.9px', color: '#1E3A27' }}
      >
        {label}
      </span>
      <span
        className="font-extrabold text-[10px]"
        style={{ color: '#1E3A27' }}
      >
        {value}/10
      </span>
    </div>
    <div className="h-[2px] w-full bg-[#1E3A27]/20 overflow-hidden">
      <div
        className="h-full bg-[#1E3A27] transition-all duration-500"
        style={{ width: `${value * 10}%` }}
      />
    </div>
  </div>
)

export default function FeedbackModal({ submission, onClose }: FeedbackModalProps) {
  if (!submission) return null

  const scores = submission.scores as Scores

  return (
    <div className="w-full bg-[#0F1A12] border border-[#1E3A27] border-t-0 shadow-lg">

      {/* Cabecera */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1E3A27]/40">
        <p
          className="font-bold text-[9px] uppercase"
          style={{ letterSpacing: '0.3em', color: '#5A7A66' }}
        >
          PROFE JULIÁN
        </p>
      </div>

      {/* Cuerpo */}
      <div className="px-5 py-4">

        {/* Feedback IA */}
        <p className="text-[#D3CBBA]/80 text-[11px] leading-relaxed mb-5">
          {submission.feedback_ai ?? 'Sin retroalimentación disponible.'}
        </p>

        {/* Puntuaciones — solo si existen */}
        {scores && (
          <div className="border-t border-[#1E3A27]/40 pt-4">
            <p
              className="font-bold text-[9px] uppercase mb-3"
              style={{ letterSpacing: '0.3em', color: '#5A7A66' }}
            >
              PUNTUACIONES
            </p>
            <ScoreBar label="Fade / Desvanecido" value={scores.fade} />
            <ScoreBar label="Limpieza"           value={scores.cleanliness} />
            <ScoreBar label="Técnica"            value={scores.technique} />
            <ScoreBar label="Simetría"           value={scores.symmetry} />
          </div>
        )}

      </div>
    </div>
  )
}