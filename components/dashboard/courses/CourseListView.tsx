// components/dashboard/courses/CourseListView.tsx
"use client"

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Module {
  id: string
  title: string
  description: string | null
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
  // Helpers to get assets based on index (cycling through available assets)
  const getModuleBg = (index: number) => {
    const bgs = [
      '/assets/dashboard/courses/module-bg-1.png',
      '/assets/dashboard/courses/module-bg-2.png',
      '/assets/dashboard/courses/module-bg-3.png',
    ]
    return bgs[index % bgs.length]
  }

  const getCardBg = (index: number) => {
    // SVGs for card backgrounds
    const cards = [
      '/assets/dashboard/courses/module-card-bg-1.svg', 
      '/assets/dashboard/courses/module-card-bg-2.svg',
      '/assets/dashboard/courses/module-card-bg-3.svg',
    ]
    return cards[index % cards.length]
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
          <h1 className="font-cinzel font-bold text-2xl md:text-3xl text-[#d3cbba] text-center tracking-wide leading-none">
            PROGRAMA DE FORMACIÓN
          </h1>
          
          {/* Separator - Centered below title */}
          <div className="relative w-full max-w-[333px] h-[1px] mt-4 mb-4">
             <Image 
               src="/assets/dashboard/courses/separator.png" 
               alt="separator" 
               fill 
               className="object-cover opacity-80"
             />
          </div>

          {/* Subtext */}
          <p className="font-sans text-[10px] md:text-xs text-[#d3cbba] text-center max-w-lg leading-relaxed opacity-80">
            Estructura oficial del proceso académico alineado a estándares profesionales del mercado australiano.
          </p>

          {/* "MÓDULOS" Label - removed: already shown in DashboardPageHeader */}
      </header>

      {/* --- COURSE NAME BANNER — Figma node 2070:13 --- */}
      <div className="relative w-full max-w-[333px] h-[65px] mx-auto mt-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-[rgba(30,58,39,0.51)] flex flex-col items-center justify-center z-10">
        {/* "NOMBRE DEL CURSO" gold asset */}
        <div className="relative w-[231px] h-[15px]">
          <Image
            src="/assets/dashboard/courses/nombre-curso.png"
            alt="Nombre del curso"
            fill
            className="object-contain"
          />
        </div>
        {/* Subtitle */}
        <p className="font-sans font-extralight text-[11px] text-[#d3cbba] text-center tracking-[0.09em] mt-1.5 whitespace-pre-wrap">
          FORMACIÓN PROFESIONAL EN BARBERÍA
        </p>
      </div>

      {/* --- MODULES LIST --- */}
      <div className="relative mt-16 md:mt-20 pb-32 flex flex-col gap-12 md:gap-16 items-center w-full max-w-lg mx-auto z-10 px-4">
        {modules.length === 0 ? (
           <p className="text-center text-zinc-500 font-sans text-sm mt-20">No hay módulos disponibles aún.</p>
        ) : (
          modules.map((module, index) => {
             const firstLessonId = firstLessonMap[module.id]
             const href = firstLessonId ? `/dashboard/courses/${module.id}/${firstLessonId}` : '#'
             
             return (
              <div 
                key={module.id}
                className="relative w-full max-w-[400px] h-[100px] md:h-[120px] flex flex-col justify-center select-none animate-in fade-in slide-in-from-bottom-4 duration-700 group"
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
                           src={getCardBg(index)} 
                           alt="bg-shape" 
                           fill 
                           className="object-contain" 
                         />
                      </div>
                 </Link>

                 {/* Content Layer (on top of card bg) */}
                 <div className="relative z-20 pointer-events-none pl-8 pr-6 md:pl-10 pb-1">
                    {/* Module Number */}
                    <p className="font-sans font-extralight text-[9px] md:text-[10px] tracking-[0.72px] text-[#1e3a27] uppercase">
                      MÓDULO {index + 1}
                    </p>
                    
                    {/* Module Title */}
                    <h3 className="font-cinzel font-bold text-lg md:text-xl text-[#1e3a27] leading-none mt-1 w-[85%] uppercase">
                      {module.title}
                    </h3>
                    
                    {/* Description - Hidden on very small screens if needed, adjusted here */}
                    <p className="font-sans font-light text-[8px] md:text-[9px] text-[#1e3a27] leading-[1.3] mt-2 max-w-[260px] line-clamp-2">
                      {module.description || "Contenido esencial para tu formación."}
                    </p>
                 </div>

                 {/* Status — just above the card */}
                 <div className="absolute left-0 top-[-20px] z-20 flex items-center gap-1 pointer-events-none">
                    <span className="font-sans font-semibold text-[8px] md:text-[9px] text-[#d3cbba]">ESTADO:</span>
                    <span className="font-sans font-extralight text-[8px] md:text-[9px] text-[#d3cbba]">
                      {index === 0 ? "En progreso" : "Bloqueado"}
                    </span>
                 </div>

                 {/* Decorative Image (Right Side, floating outside/behind) */}
                 <div className="absolute -right-6 md:-right-12 top-[-30px] w-24 h-24 md:w-32 md:h-32 z-0 pointer-events-none opacity-60 md:opacity-80 blur-[0.5px] transition-opacity duration-500 group-hover:opacity-100">
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
      <div className="relative pb-20 flex flex-col items-center w-full max-w-md mx-auto z-10 px-4">
         <Link href="/dashboard" className="relative group cursor-pointer w-full max-w-[300px]">
             <div className="absolute inset-0 bg-[#1e3a27]/50 blur-sm group-hover:bg-[#1e3a27]/70 transition-colors rounded-sm" />
             <div className="relative bg-[rgba(30,58,39,0.51)] w-full h-[40px] flex items-center justify-center border border-white/5 shadow-lg backdrop-blur-sm group-hover:scale-[1.02] transition-transform">
                <span className="font-cinzel font-bold text-[13px] text-[#d3cbba] tracking-[0.78px]">
                  PONER EN PRÁCTICA MI FORMACIÓN
                </span>
             </div>
         </Link>

         {/* Bottom Separator */}
         <div className="relative w-full max-w-[326px] h-[1px] mt-8 mb-8 opacity-60">
             <Image src="/assets/dashboard/courses/separator.png" fill className="object-cover" alt="sep" />
         </div>
         
         {/* Social Handle */}
         <div className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
             <div className="w-[31px] h-[38px] relative mb-2">
                 <Image src="/assets/dashboard/courses/logo-small.png" fill className="object-contain" alt="logo" />
             </div>
             <span className="font-sans font-medium text-[9px] text-[#d3cbba]">@xclusivebarberau</span>
         </div>
      </div>
    </div>
  )
}
