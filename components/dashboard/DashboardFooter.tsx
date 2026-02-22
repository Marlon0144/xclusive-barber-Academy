import React from 'react'
import Image from 'next/image'

interface DashboardFooterProps {
  /** Optional tagline. Defaults to the standard academic tagline. */
  tagline?: string
}

/**
 * Footer compartido del área de Dashboard.
 * Figma fuente de verdad: node 136:377 (bottom section).
 *
 * Incluye:
 *  - Tagline centrado (Poppins Medium 11px)
 *  - Fila logo + Instagram (izquierda) + Teléfono (derecha)
 *  - Divisor inferior con gradiente
 */
export function DashboardFooter({
  tagline = 'Plataforma oficial de desarrollo académico.',
}: DashboardFooterProps) {
  return (
    <footer className="flex flex-col items-center pb-8 pt-4 max-w-[400px] mx-auto px-6">

      {/* Tagline */}
      <p className="font-sans font-medium text-[11px] text-[#d3cbba] text-center tracking-[0.09em] mb-6">
        {tagline}
      </p>

      {/* Logo + Social Row */}
      <div className="relative flex items-center justify-center w-full mb-6">

        {/* Left: Instagram */}
        <div className="absolute left-0 flex items-center gap-2">
          <div className="w-[26px] h-[26px] opacity-70">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="#d3cbba" />
            </svg>
          </div>
          <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
            @xclusivebarberau
          </p>
        </div>

        {/* Center: Logo */}
        <Image
          src="/assets/header_dash/logo-academia.png"
          alt="Xclusive Barber Academy"
          width={31}
          height={38}
          className="object-contain"
        />

        {/* Right: Phone */}
        <div className="absolute right-0 flex items-center gap-1.5">
          <div className="w-[14px] h-[15px] opacity-70">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
            +61 413 891 977
          </p>
        </div>

      </div>

      {/* Bottom divider */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d3cbba]/60 to-transparent" />

    </footer>
  )
}
