import React from 'react';
import Image from 'next/image';

// Hero section — pixel-faithful to Figma node 136:377
// h-[278px] fixed, background blurred at opacity-66, all text centered
export function DashboardHeader() {
    const  mobileBg = '/assets/dashboard/header-bg-mobile.png';
    const desktopBg = '/assets/dashboard/header-bg.png';
    return (
        <div className="relative w-full h-[278px] bg-[#161616] overflow-hidden">

            {/* ── Background image ─────────────────────────────────────────
                Figma: rotate-90 container, blur-[2px], opacity-66
                We keep the same visual weight: full-cover, blurred, low opacity
            ──────────────────────────────────────────────────────────────── */}
            {/* Mobile background — shown below md breakpoint */}
            <div className="absolute inset-0 block md:hidden">
                <Image
                    src={mobileBg}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Desktop background — shown from md breakpoint and up */}
            <div className="absolute inset-0 hidden md:block">
                <Image
                    src={desktopBg}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Very subtle vignette — only to ensure text contrast, not to hide the image */}
            <div className="absolute inset-0 bg-[#161616]/20" />

            {/* ── Text content — centered column, offsets match Figma ──────
                tagline    → pt-[59px]  (Figma top-[135px] − hero top-[76px])
                heading    → mt-[8px]   (Figma top-[170px] − 135 − line height ≈ 27px)
                divider    → mt-[14px]
                description→ mt-[2px]
            ──────────────────────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[59px]">

                {/* Tagline — Poppins ExtraLight 11px tracking */}
                <p className="font-sans font-extralight text-[11px] text-[#d3cbba] uppercase tracking-[0.09em] leading-normal">
                    Tu proceso de formación comienza aquí
                </p>

                {/* Main title — Poppins ExtraBold 24px */}
                <h1 className="font-sans font-extrabold text-[24px] text-[#d3cbba] uppercase leading-normal mt-[8px]">
                    Área Académica
                </h1>

                {/* Gold divider — CSS gradient to match Figma Rectangle7 (h-px, w-[223px]) */}
                <div className="w-[223px] h-px bg-gradient-to-r from-transparent via-[#468F5D] to-transparent mt-[14px] mb-[12px] opacity-90" />

                {/* Description — Poppins Regular 9px, max-w to match Figma 223px */}
                <p className="font-sans font-normal text-[9px] text-[#d3cbba] text-center leading-[1.3] max-w-[223px]">
                    Espacio oficial de formación y seguimiento profesional dentro de la academia.
                </p>

            </div>
        </div>
    );
}
