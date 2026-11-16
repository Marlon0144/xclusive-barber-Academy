import React from 'react'
import Image from 'next/image'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { getServerDictionary } from '@/lib/i18n/server'

const INSTAGRAM_URL = 'https://www.instagram.com/xclusiveacademy_au?igsh=bms4MHQ4bzB4a3Jy'
const INSTAGRAM_HANDLE = '@xclusiveacademy_au'
const WHATSAPP_NUMBER = '61413891977'
const WHATSAPP_LABEL = '+61 413 891 977'

interface DashboardFooterProps {
  /** Optional tagline. Defaults to the localized academic tagline. */
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
export async function DashboardFooter({ tagline }: DashboardFooterProps) {
  // REQ-FUNC-001: tagline, aria-labels y mensaje de WhatsApp localizados.
  const dict = await getServerDictionary()
  const footerDict = dict.dashboard.footer
  const resolvedTagline = tagline ?? footerDict.defaultTagline
  const WHATSAPP_MESSAGE = encodeURIComponent(footerDict.whatsappMessage)
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <>
      {/* ============================================================
          MOBILE — < md (768px). NO TOCAR.
      ============================================================ */}
      <footer className="flex flex-col items-center pb-8 pt-4 max-w-[400px] mx-auto px-6 md:hidden">

        {/* Tagline */}
        <p className="font-sans font-medium text-[11px] text-[#d3cbba] text-center tracking-[0.09em] mb-6">
          {resolvedTagline}
        </p>

        {/* Logo + Social Row */}
        <div className="relative flex items-center justify-center w-full mb-6">

          {/* Left: Instagram */}
          <TrackedLink
            href={INSTAGRAM_URL}
            event="instagram_click"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label={footerDict.instagramAria}
            className="absolute left-0 flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
          >
            <div className="w-[26px] h-[26px] opacity-70">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#d3cbba" />
              </svg>
            </div>
            <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
              {INSTAGRAM_HANDLE}
            </p>
          </TrackedLink>

          {/* Center: Logo */}
          <Image
            src="/assets/logo-academia.svg"
            alt="Xclusive Barber Academy"
            width={31}
            height={38}
            className="object-contain"
          />

          {/* Right: Phone */}
          <TrackedLink
            href={WHATSAPP_URL}
            event="whatsapp_click"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label={footerDict.whatsappAria}
            className="absolute right-0 flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
          >
            <div className="w-[14px] h-[15px] opacity-70">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
              {WHATSAPP_LABEL}
            </p>
          </TrackedLink>

        </div>

        {/* Bottom divider */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d3cbba]/60 to-transparent" />

      </footer>

      {/* ============================================================
          DESKTOP — md+ (768px → 1440px+)
          Figma node 21:604 bottom section — properly contained for desktop
      ============================================================ */}
      <footer
        className="hidden md:flex flex-col items-center w-full px-6 mx-auto
                   pt-6 lg:pt-10 xl:pt-14
                   pb-8 lg:pb-10 xl:pb-14
                   max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]"
      >

        {/* Tagline */}
        <p
          className="font-sans font-normal text-[#d3cbba] text-center uppercase
                     text-[11px] lg:text-xs xl:text-sm
                     tracking-[0.09em] mb-6 lg:mb-8 xl:mb-10"
        >
          {resolvedTagline}
        </p>

        {/* Logo + Social Row */}
        <div
          className="relative flex items-center justify-center w-full mb-6 lg:mb-8 xl:mb-10"
        >

          {/* Left: Instagram */}
          <TrackedLink
            href={INSTAGRAM_URL}
            event="instagram_click"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label={footerDict.instagramAria}
            className="absolute left-0 flex items-center gap-2 lg:gap-3 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
          >
            <div className="opacity-70 w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] xl:w-[36px] xl:h-[36px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#d3cbba" />
              </svg>
            </div>
            <p
              className="font-sans font-medium text-[#d3cbba] leading-[1.3]
                         text-xs lg:text-sm xl:text-base"
            >
              {INSTAGRAM_HANDLE}
            </p>
          </TrackedLink>

          {/* Center: Logo */}
          <Image
            src="/assets/logo-academia.svg"
            alt="Xclusive Barber Academy"
            width={110}
            height={133}
            className="object-contain w-[50px] lg:w-[60px] xl:w-[70px] h-auto"
          />

          {/* Right: Phone */}
          <TrackedLink
            href={WHATSAPP_URL}
            event="whatsapp_click"
            external
            target="_blank"
            rel="noopener noreferrer"
            aria-label={footerDict.whatsappAria}
            className="absolute right-0 flex items-center gap-1.5 lg:gap-2 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
          >
            <div className="opacity-70 w-[18px] h-[19px] lg:w-[22px] lg:h-[23px] xl:w-[26px] xl:h-[27px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <p
              className="font-sans font-medium text-[#d3cbba] leading-[1.3]
                         text-xs lg:text-sm xl:text-base"
            >
              {WHATSAPP_LABEL}
            </p>
          </TrackedLink>

        </div>

        {/* Bottom divider */}
        <div
          className="w-full bg-gradient-to-r from-transparent via-[#d3cbba]/60 to-transparent
                     h-[2px] lg:h-[3px] xl:h-1"
        />

      </footer>
    </>
  )
}
