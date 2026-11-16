// components/dashboard/courses/CourseListView.tsx
"use client"

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { DashboardFooterClient } from '@/components/dashboard/DashboardFooterClient'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { interpolate } from '@/lib/i18n/dictionaries'
import { pick } from '@/lib/i18n/localize'

interface Module {
  id: string
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  image_url: string | null
  slug: string
  is_published: boolean
  is_free: boolean
  order_index: number
}

interface CourseListProps {
  modules: Module[]
  firstLessonMap: Record<string, string | null>
}

export default function CourseListView({ modules, firstLessonMap }: CourseListProps) {
  // REQ-FUNC-002: textos del listado y contenido localizado (REQ-INT-003).
  const { language, dictionary } = useLanguage()
  const coursesList = dictionary.dashboard.coursesList
  // Helpers to get assets based on index (cycling through available assets)
  const getModuleBg = (index: number) => {
    const bgs = [
      '/assets/dashboard/courses/module-bg-1.png',
      '/assets/dashboard/courses/module-bg-2.png',
      '/assets/dashboard/courses/module-bg-3.png',
    ]
    return bgs[index % bgs.length]
  }

  const getCardBg = () => {
    return '/assets/dashboard/courses/module-card-bg-2.svg'
  }

  return (
    <div className="relative w-full min-h-screen bg-[#161616] overflow-hidden flex flex-col items-center">
      
      {/* Background Blur - Centered and scaled */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] z-0 opacity-20 pointer-events-none">
        <Image 
            src="/assets/dashboard/courses/header-bg-blur.png" 
            alt="blur" 
            fill 
            className="object-contain blur-3xl"
        />
      </div>

      {/* --- HEADER SECTION --- */}
      <header className="relative pt-12 md:pt-20 flex flex-col items-center z-10 w-full max-w-4xl mx-auto px-4">
          {/* Main Title */}
          <h1 className="font-sans font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#d3cbba] text-center tracking-wide leading-none">
            {coursesList.heading}
          </h1>
          
          {/* Separator - Centered below title */}
          <div className="relative w-full max-w-[333px] md:max-w-[420px] lg:max-w-[520px] h-[1px] mt-4 mb-4">
             <Image 
               src="/assets/divider.svg" 
               alt="separator" 
               fill 
               className="object-cover opacity-80"
             />
          </div>

          {/* Subtext */}
          <p className="font-sans text-[10px] md:text-xs lg:text-sm text-[#d3cbba] text-center max-w-lg lg:max-w-xl leading-relaxed opacity-80">
            {coursesList.subtitle}
          </p>

          {/* "MÓDULOS" Label - removed: already shown in DashboardPageHeader */}
      </header>

      {/* --- COURSE NAME BANNER — Figma node 2070:13 --- */}
      <div className="relative w-full max-w-[333px] md:max-w-[420px] lg:max-w-[520px] h-[90px] md:h-[105px] lg:h-[115px] mx-auto mt-8 md:mt-12 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-[rgba(30,58,39,0.51)] flex flex-col items-center justify-center z-10">
        {/* "NOMBRE DEL CURSO" gold asset */}
        <div className="relative w-[260px] md:w-[300px] lg:w-[340px] h-[38px] md:h-[46px] lg:h-[52px]">
          <Image
            src="/assets/nombre-del-curso-text-resource.svg"
            alt="Xclusive Barber Academy"
            fill
            className="object-contain"
          />
        </div>
        {/* Subtitle */}
        <p className="font-sans font-extralight text-[11px] md:text-[13px] lg:text-[15px] text-[#d3cbba] text-center tracking-[0.09em] mt-1.5 whitespace-pre-wrap">
          {dictionary.dashboard.coursesIndex.bannerSubtitle}
        </p>
      </div>

      {/* --- MODULES LIST --- */}
      <div className="relative mt-16 md:mt-20 pb-32 flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-x-16 lg:gap-y-14 items-center lg:items-start lg:justify-items-center w-full max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto z-10 px-4 md:px-8 lg:px-12">
        {modules.length === 0 ? (
           <p className="text-center text-zinc-500 font-sans text-sm mt-20">{coursesList.empty}</p>
        ) : (
          modules.map((module, index) => {
             const firstLessonId = firstLessonMap[module.id]
             const href = firstLessonId ? `/dashboard/courses/${module.id}/${firstLessonId}` : '#'
             
             return (
              <div 
                key={module.id}
                className="relative w-full max-w-[400px] lg:max-w-[460px] h-[100px] md:h-[120px] lg:h-[140px] flex flex-col justify-center select-none animate-in fade-in slide-in-from-bottom-4 duration-700 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                 {/* Card Container Link */}
                 <Link href={href} className={cn(
                    "absolute inset-0 z-10 block", 
                    !firstLessonId && "cursor-not-allowed opacity-70"
                  )}>
                      {/* Background Vector Shape - Responsive SVG */}
                      <div className="absolute inset-0 transform rotate-180 -scale-y-100 opacity-90 transition-transform duration-300 group-hover:scale-[1.02]">
                         <Image 
                           src={getCardBg()} 
                           alt="bg-shape" 
                           fill 
                           className="object-contain" 
                         />
                      </div>
                 </Link>

                 {/* Content Layer (on top of card bg) */}
                 <div className="relative z-20 pointer-events-none pl-8 pr-6 md:pl-10 lg:pl-12 pb-1">
                    {/* Module Number */}
                    <p className="font-sans font-extralight text-[9px] md:text-[10px] lg:text-[12px] tracking-[0.72px] uppercase" style={{ color: '#1E3A27' }}>
                      {interpolate(coursesList.module, { n: index + 1 })}
                    </p>
                    
                    {/* Module Title — contenido localizado con fallback (REQ-INT-003) */}
                    <h3 className="font-sans font-extrabold text-lg md:text-xl lg:text-2xl leading-none mt-1 w-[85%] uppercase" style={{ color: '#1E3A27' }}>
                      {pick(language, { es: module.title, en: module.title_en })}
                    </h3>
                    
                    {/* Description - Hidden on very small screens if needed, adjusted here */}
                    <p className="font-sans font-light text-[8px] md:text-[9px] lg:text-[11px] leading-[1.3] mt-2 max-w-[260px] lg:max-w-[320px] line-clamp-2" style={{ color: '#1E3A27' }}>
                      {pick(language, { es: module.description || coursesList.descriptionFallback, en: module.description_en || null })}
                    </p>
                 </div>

                 {/* Status — just above the card */}
                 <div className="absolute left-0 top-[-20px] lg:top-[-24px] z-20 flex items-center gap-1 pointer-events-none">
                    <span className="font-sans font-semibold text-[8px] md:text-[9px] lg:text-[11px] text-[#d3cbba]">{coursesList.status}</span>
                    <span className="font-sans font-extralight text-[8px] md:text-[9px] lg:text-[11px] text-[#d3cbba]">
                      {firstLessonId ? coursesList.inProgress : coursesList.locked}
                    </span>
                 </div>

                 {/* Decorative Image (Right Side, floating outside/behind) */}
                 <div className="absolute -right-6 md:-right-12 lg:-right-14 top-[-30px] lg:top-[-40px] w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 z-0 pointer-events-none opacity-60 md:opacity-80 blur-[0.5px] transition-opacity duration-500 group-hover:opacity-100">
                    <div className="relative w-full h-full">
                      <Image 
                        src={getModuleBg(index)} 
                        alt="decor" 
                        fill 
                        className="object-contain scale-125"
                      />
                    </div>
                 </div>

              </div>
             )
          })
        )}
      </div>

       {/* --- BOTTOM CTA --- */}
      <div className="relative pb-20 flex flex-col items-center w-full max-w-md lg:max-w-lg mx-auto z-10 px-4">
         <Link href="/dashboard/tracker" className="relative group cursor-pointer w-full max-w-[300px] md:max-w-[360px] lg:max-w-[420px]">
             <div className="absolute inset-0 bg-[#1e3a27]/50 blur-sm group-hover:bg-[#1e3a27]/70 transition-colors rounded-sm" />
             <div className="relative bg-[rgba(30,58,39,0.51)] w-full h-[40px] md:h-[48px] lg:h-[56px] flex items-center justify-center border border-white/5 shadow-lg backdrop-blur-sm group-hover:scale-[1.02] transition-transform">
                <span className="font-sans font-extrabold text-[13px] md:text-[15px] lg:text-[17px] text-[#d3cbba] tracking-[0.78px]">
                  {coursesList.cta}
                </span>
             </div>
         </Link>
      </div>

      {/* FOOTER — outside constrained containers for full-width desktop layout */}
      <DashboardFooterClient />
    </div>
  )
}
