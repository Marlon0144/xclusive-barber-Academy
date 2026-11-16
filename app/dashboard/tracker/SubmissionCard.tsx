'use client'

/**
 * SubmissionCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Tarjeta que representa una práctica enviada por el estudiante.
 *
 * Diseño fiel a Figma (node 2134:48):
 *  - Tarjeta de 97px de alto + badge inferior de 22px = 119px total
 *  - Imagen del usuario: 81px × 97px, con margen izquierdo de 17px
 *  - Fondo angular (clipPath diagonal) color #8C8C84 cubriendo el área de texto
 *  - Overlay oscuro verde en esquina superior derecha
 *  - Badge "EN PROCESO DE REVISIÓN" → beige semitransparente, 125px de ancho
 *  - Badge "RETROALIMENTACIÓN ▼"   → verde #1E3A27, expandible inline
 *
 * Props:
 *  submission – datos de la práctica
 *  index      – posición en el arreglo (0 = más reciente)
 *  total      – total de prácticas (para numerar descendente: "PRÁCTICA 4, 3, 2, 1")
 */

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Submission } from '@/types/submissions'
import FeedbackModal from './FeedbackModal'
import { deleteSubmission } from './actions'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { interpolate } from '@/lib/i18n/dictionaries'

interface SubmissionCardProps {
  submission: Submission
  index: number
  total: number
  onDelete: (id: string) => void
}

export function SubmissionCard({ submission, index, total, onDelete }: SubmissionCardProps) {
  const { dictionary } = useLanguage()
  const cardDict = dictionary.dashboard.tracker.card
  const isReviewed = submission.status === 'reviewed'
  const practiceNumber = total - index

  // ── Estado del modal de retroalimentación (solo prácticas revisadas) ───────
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ── Eliminación con feedback visual ────────────────────────────────────────
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSubmission(submission.id)
      // Eliminar la card del estado local del padre → sin recarga de página
      onDelete(submission.id)
    })
  }

  const handleBadgeClick = () => {
    if (isReviewed) setIsModalOpen((prev) => !prev)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={cn('w-screen md:w-full relative left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 mb-2 md:mb-3 transition-opacity duration-300 md:rounded-lg md:overflow-hidden', isPending && 'opacity-40 pointer-events-none')}>

      {/* ── TARJETA PRINCIPAL (119px total: 97px contenido + 22px badge) ──── */}
      <div
        className="relative w-full bg-[#161616] overflow-hidden shadow-xl h-[123px] md:h-[155px] lg:h-[170px]"
      >

        {/* ── BOTÓN ELIMINAR (×) ────────────────────────────────────────────
            Posicionado en la esquina superior derecha de la tarjeta.
            Solo visible en hover para no saturar la UI.                   */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          aria-label={cardDict.deleteAria}
          className="absolute top-4 right-7 z-30 w-5 h-5 flex items-center justify-center rounded-full bg-black/40 text-white/60 hover:bg-red-700/80 hover:text-white transition-all duration-200 text-[11px] font-bold leading-none"
        >
          {isPending ? (
            // Micro spinner mientras se procesa el borrado
            <span className="block w-2.5 h-2.5 border border-white/60 border-t-transparent rounded-full animate-spin" />
          ) : (
            '×'
          )}
        </button>

        {/* ── FONDO ANGULAR (forma diagonal, cubre área de texto) ───────────
            Ocupa los 97px de alto del contenido.
            ClipPath: corte diagonal en la esquina inferior-derecha.       */}
        <div
          className="absolute top-0 left-0 right-0 bg-[#8C8C84] h-[97px] md:h-[125px] lg:h-[138px]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)' }}
        />



        {/* ── IMAGEN DEL USUARIO ────────────────────────────────────────────
            Figma: left 17px, top 0, width 81px, height 97px (fijo)         */}
        <div
          className="absolute top-0 z-10 left-[17px] md:left-[24px] w-[81px] md:w-[110px] lg:w-[130px] h-[97px] md:h-[125px] lg:h-[138px]"
        >
          {submission.image_url ? (
            <Image
              src={submission.image_url}
              alt={interpolate(cardDict.photoAlt, {
                n: practiceNumber,
                cutType: submission.cut_type ?? '',
              })}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 130px, (min-width: 768px) 110px, 81px"
            />
          ) : (
            <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
              <span className="text-white/20 text-[9px] uppercase tracking-wider text-center leading-tight px-1">
                {cardDict.noPhoto}
              </span>
            </div>
          )}
        </div>

        {/* ── BLOQUE DE TEXTO ───────────────────────────────────────────────
            Posicionado desde después de la imagen (17 + 81 = 98px → +10px gap = 108px)
            Figma: "PRÁCTICA N" top 12px | título top 24px | notas top 50px  */}
        <div
          className="absolute top-0 right-0 z-20 flex flex-col justify-start left-[108px] md:left-[150px] lg:left-[175px] h-[97px] md:h-[125px] lg:h-[138px] pt-[12px] md:pt-4 lg:pt-5 pr-[20px] md:pr-6"
        >
          {/* Número de práctica — ExtraLight 10px tracking 0.9px */}
          <span
            className="font-extralight text-[10px] md:text-xs uppercase leading-normal tracking-[0.9px] text-[#1E3A27]"
          >
            {interpolate(cardDict.practice, { n: practiceNumber })}
          </span>

          {/* Título principal — ExtraBold 17px */}
          <h3
            className="font-extrabold text-[17px] md:text-xl lg:text-2xl uppercase leading-tight mt-0.5 text-[#1E3A27]"
          >
            {cardDict.techniqueImplemented}
          </h3>

          {/* Subtítulo — tipo de corte (bold pequeño para no perder el dato) */}
          {submission.cut_type && (
            <p
              className="font-semibold text-[9px] md:text-xs uppercase tracking-wide leading-none mt-0.5 text-[#1E3A27]"
            >
              {submission.cut_type}
            </p>
          )}
        </div>

        {/* ── BADGE DE ESTADO ───────────────────────────────────────────────
            Figma: left 0, top 99px, width 125px, height 22px
            pending  → beige rgba(211,203,186,0.79) con sombra
            reviewed → verde #1E3A27 con chevron dorado                     */}
        <button
          onClick={handleBadgeClick}
          disabled={!isReviewed}
          className={cn(
            'absolute flex items-center justify-center transition-all left-0 top-[101px] md:top-[128px] lg:top-[142px] w-[125px] md:w-[160px] lg:w-[180px] h-[22px] md:h-[27px]',
            isReviewed ? 'cursor-pointer hover:brightness-110' : 'cursor-default opacity-50 blur-[0.6px]'
          )}
          style={{
            backgroundColor: 'rgba(211,203,186,0.79)',
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
          }}
        >
          <span
            className="font-extrabold text-[8px] md:text-[10px] uppercase text-center tracking-[0.06em] text-[#1E3A27]"
          >
            {isReviewed ? cardDict.feedback : cardDict.inReview}
          </span>

        </button>

      </div>

      {/* ── MODAL DE RETROALIMENTACIÓN ────────────────────────────────────── */}
      {isReviewed && isModalOpen && (
        <FeedbackModal
          submission={submission}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  )
}
