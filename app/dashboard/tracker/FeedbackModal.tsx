'use client'

import { Submission, Scores } from '@/types/submissions'
import { useLanguage } from '@/components/i18n/LanguageProvider'

interface FeedbackModalProps {
  submission: Submission
  onClose: () => void
}

// ── Barra de puntuación — estilo dark premium ──────────────────────────────
const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1.5">
      <span
        className="font-extralight text-[10px] md:text-xs uppercase tracking-[0.9px] text-[#1E3A27]"
      >
        {label}
      </span>
      <span
        className="font-extrabold text-[10px] md:text-xs text-[#1E3A27]"
      >
        {value}/10
      </span>
    </div>
    <div className="h-[2px] md:h-[3px] w-full bg-[#1E3A27]/20 overflow-hidden">
      <div
        className="h-full bg-[#1E3A27] transition-all duration-500"
        style={{ width: `${value * 10}%` }}
      />
    </div>
  </div>
)

export default function FeedbackModal({ submission }: FeedbackModalProps) {
  const { dictionary } = useLanguage()
  const modalDict = dictionary.dashboard.tracker.feedbackModal
  if (!submission) return null

  const scores = submission.scores as Scores

  return (
    <div className="w-full bg-[#0F1A12] border border-[#1E3A27] border-t-0 shadow-lg md:rounded-b-lg">

      {/* Cabecera */}
      <div className="px-5 md:px-8 pt-4 md:pt-5 pb-3 md:pb-4 border-b border-[#1E3A27]/40">
        <p
          className="font-bold text-[9px] md:text-xs uppercase tracking-[0.3em] text-[#5A7A66]"
        >
          {modalDict.heading}
        </p>
      </div>

      {/* Cuerpo */}
      <div className="px-5 md:px-8 py-4 md:py-6">

        {/* Feedback IA */}
        <p className="text-[#D3CBBA]/80 text-[11px] md:text-sm leading-relaxed mb-5 md:mb-6">
          {submission.feedback_ai ?? modalDict.noFeedback}
        </p>

        {/* Puntuaciones — solo si existen */}
        {scores && (
          <div className="border-t border-[#1E3A27]/40 pt-4">
            <p
              className="font-bold text-[9px] md:text-xs uppercase mb-3 md:mb-4 tracking-[0.3em] text-[#5A7A66]"
            >
              {modalDict.scores}
            </p>
            <ScoreBar label={modalDict.fade}    value={scores.fade} />
            <ScoreBar label={modalDict.cleanliness} value={scores.cleanliness} />
            <ScoreBar label={modalDict.technique} value={scores.technique} />
            <ScoreBar label={modalDict.symmetry} value={scores.symmetry} />
          </div>
        )}

      </div>
    </div>
  )
}