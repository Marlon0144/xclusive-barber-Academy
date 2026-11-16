import React from 'react';
import Image from 'next/image';
import { getServerDictionary } from '@/lib/i18n/server';

// Hero section — pixel-faithful to Figma node 136:377
// h-[278px] fixed, background blurred at opacity-66, all text centered
export async function DashboardHeader() {
    const  mobileBg = '/assets/dashboard/header-bg-mobile.png';
    const desktopBg = '/assets/dashboard/header-bg.png';
    // REQ-FUNC-001: texto fijo del hero proveniente del diccionario.
    const dict = await getServerDictionary()
    const header = dict.dashboard.header
    return (
        <>
            {/* ============================================================
                MOBILE — < md (768px)
                Pixel-faithful a Figma mobile (422px). NO TOCAR.
            ============================================================ */}
            <div className="relative w-full h-[278px] bg-[#161616] overflow-hidden md:hidden">
                <div className="absolute inset-0">
                    <Image src={mobileBg} alt="" fill className="object-cover" priority />
                </div>
                <div className="absolute inset-0 bg-[#161616]/20" />
                <div className="relative z-10 flex flex-col items-center text-center px-6 pt-[59px]">
                    <p className="font-sans font-extralight text-[11px] text-[#d3cbba] uppercase tracking-[0.09em] leading-normal">
                        {header.tagline}
                    </p>
                    <h1 className="font-sans font-extrabold text-[24px] text-[#d3cbba] uppercase leading-normal mt-[8px]">
                        {header.title}
                    </h1>
                    <div className="w-[223px] h-px bg-gradient-to-r from-transparent via-[#468F5D] to-transparent mt-[14px] mb-[12px] opacity-90" />
                    <p className="font-sans font-normal text-[9px] text-[#d3cbba] text-center leading-[1.3] max-w-[223px]">
                        {header.description}
                    </p>
                </div>
            </div>

            {/* ============================================================
                DESKTOP — md+ (768px → 1440px+)
                Figma node 21:604 — escalado más contenido para UX en desktop
            ============================================================ */}
            <div
                className="relative w-full bg-[#161616] overflow-hidden hidden md:block
                           h-[280px] lg:h-[320px] xl:h-[380px]"
            >
                <div className="absolute inset-0">
                    <Image src={desktopBg} alt="" fill className="object-cover" priority />
                </div>
                <div className="absolute inset-0 bg-[#161616]/20" />

                <div
                    className="relative z-10 flex flex-col items-center text-center px-6
                               pt-[70px] lg:pt-[90px] xl:pt-[110px]"
                >
                    {/* Tagline */}
                    <p
                        className="font-sans font-extralight text-[#d3cbba] uppercase leading-normal
                                   text-sm lg:text-base xl:text-lg tracking-[2.16px]"
                    >
                        {header.tagline}
                    </p>

                    {/* Title */}
                    <h1
                        className="font-sans font-extrabold text-[#d3cbba] uppercase leading-normal mt-[8px]
                                   text-4xl lg:text-5xl xl:text-6xl"
                    >
                        {header.title}
                    </h1>

                    {/* Divider */}
                    <div
                        className="bg-gradient-to-r from-transparent via-[#468F5D] to-transparent opacity-90
                                   mt-[14px] mb-[12px] h-[3px] lg:h-1 xl:h-[5px]
                                   w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px]"
                    />

                    {/* Description */}
                    <p
                        className="font-sans font-normal text-[#d3cbba] text-center leading-[1.3]
                                   text-sm lg:text-base xl:text-lg
                                   max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]"
                    >
                        {header.description}
                    </p>
                </div>
            </div>
        </>
    );
}
