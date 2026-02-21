import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { getUser, getLessonById } from '@/utils/cache-helpers'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import VideoPlayer from '@/components/courses/VideoPlayer'
import { cn } from '@/lib/utils'

interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params
  
  // Data Fetching
  const supabasePromise = createClient()
  const userPromise = getUser()
  const lessonPromise = getLessonById(lessonId)

  const [supabase, user, lessonResult] = await Promise.all([supabasePromise, userPromise, lessonPromise])

  if (!user) {
    redirect('/login')
  }

  const { lesson, error } = lessonResult

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return notFound()
  }

  // Fetch Module Info & All Lessons for Navigation
  const { data: moduleData } = await supabase
    .from('modules')
    .select('title, course_id')
    .eq('id', lesson.module_id)
    .single()
  
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, position')
    .eq('module_id', lesson.module_id)
    .order('position', { ascending: true })

  const lessons = allLessons || []
  const currentLessonIndex = lessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson = lessons[currentLessonIndex - 1]
  const nextLesson = lessons[currentLessonIndex + 1]

  // Define URLs for assets (from public folder)
  const assets = {
    logo: '/assets/dashboard/lessons/logo-header.png',
    separator: '/assets/dashboard/lessons/separator-line.png',
    titleDecor: '/assets/dashboard/lessons/title-decoration.png',
    navSeparator: '/assets/dashboard/lessons/nav-separator.svg',
    arrowDecor: '/assets/dashboard/lessons/arrow-decoration.png',
  }

  return (
    <div className="min-h-screen bg-[#161616] text-[#D3CBBA] font-sans relative overflow-x-hidden pb-20">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gold-500/5 blur-[120px] rounded-full opacity-30" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-green-950/20 blur-[100px] rounded-full opacity-30" />
      </div>

      {/* DASHBOARD LINK (Top Right) */}
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard" className="group flex flex-col items-center gap-1">
          <div className="bg-[#D9D9D9]/40 h-[14px] w-[74px] rounded-full backdrop-blur-sm group-hover:bg-[#D9D9D9]/60 transition-colors" />
          <span className="text-[#161616] bg-[#D3CBBA] px-2 py-0.5 rounded text-[8px] tracking-widest font-light uppercase">
            Dashboard
          </span>
        </Link>
      </div>

      {/* HEADER / HERO SECTION */}
      <header className="relative z-10 pt-12 pb-8 flex flex-col items-center text-center gap-4 px-4 w-full max-w-4xl mx-auto">
        
        {/* Logo Element (Top Left absolute or relative in flow?) Design shows absolute top-left */}
        <div className="hidden md:absolute md:left-6 md:top-6 w-[55px] h-[67px] opacity-80">
           <Image src={assets.logo} alt="Logo Element" width={55} height={67} className="object-contain" />
        </div>

        {/* Separator Line Top */}
        <div className="w-[77px] h-[1px] relative opacity-60 mb-2">
            <Image src={assets.separator} alt="" fill className="object-cover" />
        </div>

        {/* Top Label */}
        <h3 className="text-[10px] md:text-sm font-bold tracking-[0.2em] text-[#D3CBBA] opacity-80 uppercase">
          LECCIONES
        </h3>

        {/* Main Title Group */}
        <div className="space-y-2 relative w-full">
           <h2 className="text-[11px] md:text-xs font-light tracking-[0.2em] text-[#D3CBBA] uppercase opacity-90">
             FORMACIÓN PROFESIONAL EN BARBERÍA
           </h2>
           
           {/* Decorative Element under top title */}
           <div className="w-[231px] h-[15px] relative mx-auto my-2 opacity-80">
             <Image src={assets.titleDecor} alt="" fill className="object-contain" />
           </div>

           <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-[#D3CBBA] tracking-tight font-serif uppercase leading-tight">
             FUNDAMENTOS TÉCNICOS
           </h1>

           <div className="w-[221px] h-[1px] relative mx-auto mt-4 opacity-50">
             <Image src={assets.separator} alt="" fill className="object-cover" />
           </div>
           
           <p className="text-[8px] md:text-[10px] font-light tracking-wide text-[#D3CBBA]/70 max-w-md mx-auto mt-2 leading-relaxed">
             Bases esenciales de técnica, herramientas y precisión profesional.
           </p>
        </div>

      </header>

      {/* MODULE / LESSON NAVIGATION (Horizontal Tabs) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mb-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4">
         {lessons.map((l: any, idx: number) => {
           const isActive = l.id === lessonId

           return (
             <Link 
               key={l.id} 
               href={`/dashboard/courses/${courseId}/${l.id}`}
               className={cn(
                 "group relative flex flex-col items-center gap-2 transition-all duration-300 min-w-[30px]",
                 isActive ? "scale-110 opacity-100" : "opacity-40 hover:opacity-70 scale-100"
               )}
             >
                <span className={cn(
                  "text-xs md:text-sm font-extrabold tracking-widest uppercase transition-colors",
                  isActive ? "text-[#D3CBBA]" : "text-[#1E3A27]"
                )}>
                  L{idx + 1}
                </span>
                
                {isActive && (
                   <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                )}
                
                {/* Separator Lines (Except last) */}
                {idx < lessons.length - 1 && (
                  <div className="hidden md:block absolute right-[-16px] md:right-[-32px] top-1/2 -translate-y-1/2 w-[1px] h-4 bg-[#1E3A27]/30">
                    <div className="relative w-full h-full"> 
                        <Image src={assets.navSeparator} alt="" fill className="object-cover opacity-50" />
                    </div>
                  </div>
                )}
             </Link>
           )
         })}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 grid grid-cols-1 gap-12">
        
        {/* VIDEO PLAYER SECTION */}
        <div className="w-full relative aspect-video bg-black/40 rounded-sm border border-white/5 overflow-hidden shadow-2xl">
           <VideoPlayer url={lesson.video_url} lessonId={lesson.id} />
           
           {/* Decorative corner elements */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D3CBBA]/20 rounded-tl-lg" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D3CBBA]/20 rounded-br-lg" />
        </div>

        {/* TEXT CONTENT */}
        <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
           
           {/* Left details */}
           <div className="flex-1 space-y-6">
              <div className="space-y-2">
                 <span className="text-[10px] font-light tracking-[0.2em] text-[#D3CBBA]/60 uppercase block">
                    MÓDULO 1
                 </span>
                 <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#D3CBBA]">
                   {lesson.title}
                 </h2>
                 {lesson.description && (
                   <h3 className="text-sm md:text-base font-medium text-[#D3CBBA]/80 tracking-wide uppercase">
                     Resumen de la lección
                   </h3>
                 )}
              </div>

              {/* Decorative Separator */}
              <div className="w-[120px] h-0.5 bg-gradient-to-r from-gold-500/50 to-transparent" />

              <div className="prose prose-invert prose-gold max-w-none text-xs md:text-sm font-light text-[#D3CBBA]/70 leading-relaxed text-justify">
                 {/* Render description properly */}
                 {lesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                 ) : (
                    <p>Sin descripción disponible.</p>
                 )}
              </div>
           </div>

           {/* Right: References / Downloads */}
           <div className="w-full md:w-64 flex-shrink-0 space-y-4">
              <h4 className="text-[8px] font-light tracking-[0.2em] text-[#D3CBBA]/60 uppercase text-right border-b border-white/5 pb-2">
                 Referencias Visuales
              </h4>
              <div className="grid grid-cols-3 gap-2">
                 {[1,2,3,4,5,6,7,8,9].map((i) => (
                   <div key={i} className="aspect-square bg-[#D9D9D9]/10 rounded-sm hover:bg-[#D9D9D9]/20 transition-colors cursor-pointer border border-white/5" />
                 ))}
              </div>
              <p className="text-[7px] text-right text-[#D3CBBA]/40 tracking-wider mt-2">
                 Unidad Audiovisual 
              </p>
           </div>

        </div>

      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="relative z-10 mt-20 pb-12 w-full max-w-4xl mx-auto px-8 flex justify-between items-center border-t border-white/5 pt-8">
         
         {/* PREV BUTTON */}
         <div className="flex-1 flex justify-start">
            {prevLesson ? (
                <Link href={`/dashboard/courses/${courseId}/${prevLesson.id}`} className="group flex flex-col items-start gap-1">
                <span className="text-[8px] font-semibold text-[#D3CBBA] group-hover:text-gold-500 transition-colors uppercase tracking-widest">
                    Lección Anterior
                </span>
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-[29px] h-[9px] relative transform scale-x-[-1]">
                        <Image src={assets.arrowDecor} alt="" fill className="object-contain" />
                    </div>
                </div>
                </Link>
            ) : <div />}
         </div>

         {/* NEXT BUTTON */}
         <div className="flex-1 flex justify-end">
            {nextLesson ? (
                <Link href={`/dashboard/courses/${courseId}/${nextLesson.id}`} className="group flex flex-col items-end gap-1">
                <span className="text-[8px] font-semibold text-[#D3CBBA] group-hover:text-gold-500 transition-colors uppercase tracking-widest text-right">
                    Siguiente Lección
                </span>
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-[29px] h-[9px] relative">
                        <Image src={assets.arrowDecor} alt="" fill className="object-contain" />
                    </div>
                </div>
                </Link>
            ) : (
                <div className="text-[8px] text-[#D3CBBA]/40 uppercase tracking-widest">Fin del módulo</div>
            )}
         </div>

      </footer>

      {/* Bottom Contact Info */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-8 flex justify-center items-center gap-6 opacity-60 pb-12">
         <span className="text-[9px] font-medium text-[#D3CBBA]">@xclusivebarberau</span>
         <div className="w-[30px] h-[38px] relative opacity-70">
            <Image src={assets.logo} alt="" fill className="object-contain" />
         </div>
         <span className="text-[9px] font-medium text-[#D3CBBA]">+61 413 891 977</span>
      </div>

    </div>
  )
}