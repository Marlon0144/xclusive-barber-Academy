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

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Submission } from '@/types/submissions'
import FeedbackModal from './FeedbackModal'

interface SubmissionCardProps {
  submission: Submission
  index: number
  total: number
}

export function SubmissionCard({ submission, index, total }: SubmissionCardProps) {
  const isReviewed = submission.status === 'reviewed'
  const practiceNumber = total - index

  // ── Estado del modal de retroalimentación (solo prácticas revisadas) ───────
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBadgeClick = () => {
    if (isReviewed) setIsModalOpen((prev) => !prev)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 mb-2">

      {/* ── TARJETA PRINCIPAL (119px total: 97px contenido + 22px badge) ──── */}
      <div
        className="relative w-full bg-[#161616] overflow-hidden shadow-xl"
        style={{ height: '123px' }}
      >

        {/* ── FONDO ANGULAR (forma diagonal, cubre área de texto) ───────────
            Ocupa los 97px de alto del contenido.
            ClipPath: corte diagonal en la esquina inferior-derecha.       */}
        <div
          className="absolute top-0 left-0 right-0 bg-[#8C8C84]"
          style={{
            height: '97px',
            clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)',
          }}
        />



        {/* ── IMAGEN DEL USUARIO ────────────────────────────────────────────
            Figma: left 17px, top 0, width 81px, height 97px (fijo)         */}
        <div
          className="absolute top-0 z-10"
          style={{ left: '17px', width: '81px', height: '97px' }}
        >
          {submission.image_url ? (
            <Image
              src={submission.image_url}
              alt={`Práctica ${practiceNumber} – ${submission.cut_type}`}
              fill
              className="object-cover"
              sizes="81px"
            />
          ) : (
            <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
              <span className="text-white/20 text-[9px] uppercase tracking-wider text-center leading-tight px-1">
                Sin foto
              </span>
            </div>
          )}
        </div>

        {/* ── BLOQUE DE TEXTO ───────────────────────────────────────────────
            Posicionado desde después de la imagen (17 + 81 = 98px → +10px gap = 108px)
            Figma: "PRÁCTICA N" top 12px | título top 24px | notas top 50px  */}
        <div
          className="absolute top-0 right-0 z-20 flex flex-col justify-start"
          style={{ left: '108px', height: '97px', paddingTop: '12px', paddingRight: '20px' }}
        >
          {/* Número de práctica — ExtraLight 10px tracking 0.9px */}
          <span
            className="font-extralight text-[10px] uppercase leading-normal"
            style={{ letterSpacing: '0.9px', color: '#1E3A27' }}
          >
            PRÁCTICA {practiceNumber}
          </span>

          {/* Título principal — ExtraBold 17px */}
          <h3
            className="font-extrabold text-[17px] uppercase leading-tight mt-0.5"
            style={{ color: '#1E3A27' }}
          >
            TÉCNICA IMPLEMENTADA
          </h3>

          {/* Subtítulo — tipo de corte (bold pequeño para no perder el dato) */}
          {submission.cut_type && (
            <p
              className="font-semibold text-[9px] uppercase tracking-wide leading-none mt-0.5"
              style={{ color: '#1E3A27' }}
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
            'absolute flex items-center justify-center transition-all',
            isReviewed ? 'cursor-pointer hover:brightness-110' : 'cursor-default opacity-50 blur-[0.6px]'
          )}
          style={{
            left: 0,
            top: '101px',
            width: '125px',
            height: '22px',
            backgroundColor: 'rgba(211,203,186,0.79)',
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
          }}
        >
          <span
            className="font-extrabold text-[8px] uppercase text-center"
            style={{ letterSpacing: '0.06em', color: '#1E3A27' }}
          >
            {isReviewed ? 'RETROALIMENTACIÓN' : 'EN PROCESO DE REVISIÓN'}
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
