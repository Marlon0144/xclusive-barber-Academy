import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { getUser, getLessonById } from '@/utils/cache-helpers'
import VideoPlayer from '@/components/courses/VideoPlayer'
import { cn } from '@/lib/utils'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { getServerDictionary, getServerLanguage } from '@/lib/i18n/server'
import { interpolate } from '@/lib/i18n/dictionaries'
import { pick } from '@/lib/i18n/localize'

interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

/** Tipo local para los ítems de navegación entre lecciones */
interface LessonNavItem {
  id: string
  title: string
  position: number
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params

  // ── Data Fetching ────────────────────────────────────────────────────────────
  const supabasePromise = createClient()
  const userPromise = getUser()
  const lessonPromise = getLessonById(lessonId)

  // REQ-FUNC-003: diccionario + idioma para localizar la carcasa y el contenido.
  const dictionaryPromise = getServerDictionary()
  const languagePromise = getServerLanguage()

  const [supabase, user, lessonResult, dictionary, language] = await Promise.all([
    supabasePromise,
    userPromise,
    lessonPromise,
    dictionaryPromise,
    languagePromise,
  ])

  if (!user) redirect('/login')

  const { lesson, error } = lessonResult
  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return notFound()
  }

  const lessonDict = dictionary.dashboard.lesson

  // Fetch navigation lessons + module info in parallel (REQ-INT-003: con `_en`)
  const [{ data: allLessons }, { data: moduleData }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, title_en, position')
      .eq('module_id', lesson.module_id)
      .order('position', { ascending: true }),
    supabase
      .from('modules')
      .select('title, title_en, description, description_en, position')
      .eq('id', lesson.module_id)
      .single(),
  ])

  const lessons: LessonNavItem[] = allLessons || []
  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = lessons[currentLessonIndex - 1]
  const nextLesson = lessons[currentLessonIndex + 1]
  const moduleTitle = pick(language, {
    es: moduleData?.title ?? '',
    en: moduleData?.title_en ?? null,
  })
  const moduleDescription = pick(language, {
    es: moduleData?.description ?? '',
    en: moduleData?.description_en ?? null,
  })
  const moduleNumber = moduleData?.position ?? 1

  // ── Asset paths (all from /assets/dashboard/courses/lessons/) ────────────────
  const A = {
    textRecurso: '/assets/nombre-del-curso-text-resource.svg',
    marcoVideo:  '/assets/dashboard/courses/lessons/marco-video.png',
    dividerDorado: '/assets/divider.svg',
    backRow:     '/assets/dashboard/courses/lessons/back-row.png',
    nextRow:     '/assets/dashboard/courses/lessons/next-row.png',
  } as const

  return (
    <div className="min-h-screen bg-[#161616] text-[#D3CBBA] font-sans overflow-x-hidden">

      {/* ── STICKY HEADER ────────────────────────────────────────────────────── */}
      <DashboardPageHeader title={lessonDict.lessons} />

      {/* ── BACK ARROW ROW ───────────────────────────────────────────────────── */}
      {/* Positioned below header, left-aligned, mirroring Figma top-87 placement */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto px-[34px] md:px-10 mt-5">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-start"
        >
          <div className="w-[29.6px] md:w-[36px] h-[9.2px] md:h-[11px] relative">
            <Image src={A.backRow} alt={lessonDict.back} fill className="object-contain" />
          </div>
        </Link>
      </div>

      {/* ── COURSE BANNER (green band) ───────────────────────────────────────── */}
      {/*
        Figma: bg rgba(30,58,39,0.51), w-333px / 402px total → ~83%, h-65px
        The title-decoration (text-recurso.png) overlaps the top edge of the banner.
      */}
      <section className="w-full flex justify-center mt-5 md:mt-8">
        <div
          className="flex flex-col items-center justify-center gap-[5px] w-[83%] max-w-[333px] md:max-w-[450px] lg:max-w-[550px] h-[82px] md:h-[95px] lg:h-[105px]"
          style={{ background: 'rgba(30,58,39,0.51)', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
        >
          {/* Decorative title: XCLUSIVE BARBER ACADEMY (SVG 2.6:1 ratio) */}
          <div className="w-[260px] md:w-[300px] lg:w-[340px] h-[38px] md:h-[46px] lg:h-[52px] relative">
            <Image src={A.textRecurso} alt="Xclusive Barber Academy" fill className="object-contain" priority />
          </div>

          {/* "FORMACIÓN PROFESIONAL EN BARBERÍA" subtitle */}
          <p
            className="text-[#D3CBBA] text-[11px] md:text-[13px] lg:text-[15px] font-extralight text-center uppercase leading-normal px-2"
            style={{ letterSpacing: '0.99px' }}
          >
            {dictionary.dashboard.coursesIndex.bannerSubtitle}
          </p>
        </div>
      </section>

      {/* ── MODULE INFO BLOCK ────────────────────────────────────────────────── */}
      {/*
        Figma:
          "MÓDULO 1"          → text-8px  ExtraLight tracking-0.72px  top-235
          "FUNDAMENTOS…"      → text-17px ExtraBold  uppercase         top-253
          separator line      → w-221px h-1px                          top-285
          description         → text-6px  Light                        top-298
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto flex flex-col items-center text-center mt-8 md:mt-12 px-4">
        <p
          className="text-[#D3CBBA] text-[8px] md:text-[11px] lg:text-[13px] font-extralight uppercase leading-normal"
          style={{ letterSpacing: '0.72px' }}
        >
          {interpolate(lessonDict.module, { n: moduleNumber })}
        </p>

        <h2 className="text-[#D3CBBA] text-[17px] md:text-[24px] lg:text-[30px] font-extrabold uppercase leading-normal mt-2 tracking-tight">
          {moduleTitle.toUpperCase()}
        </h2>

        {/* thin cream separator */}
        <div
          className="w-[221px] md:w-[300px] lg:w-[380px] h-px mt-4"
          style={{ background: '#D3CBBA', opacity: 0.4, boxShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
        />

        <p className="text-[#D3CBBA] text-[6px] md:text-[10px] lg:text-[12px] font-light text-center leading-[1.3] mt-2 w-[336px] md:w-[500px] lg:w-[600px] max-w-full opacity-70">
          {moduleDescription}
        </p>
      </div>

      {/* ── LESSONS NAV BAR ──────────────────────────────────────────────────── */}
      {/*
        Figma: h-30px, full-width cream band (bg #D3CBBA opacity-47),
               L1…Ln labels in ExtraBold 12px color #1E3A27 inside it,
               vertical 1px separators between labels.
               "LECCIONES" label below in ExtraLight 8px tracking-2.4px
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-8 md:mt-12">
        {/* cream band */}
        <div
          className="w-full h-[30px] md:h-[40px] lg:h-[48px] flex items-center justify-center gap-0"
          style={{ background: 'rgba(211,203,186,0.47)', boxShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
        >
          {lessons.map((l, idx) => {
            const isActive = l.id === lessonId
            return (
              <div key={l.id} className="flex items-center">
                <Link
                  href={`/dashboard/courses/${courseId}/${l.id}`}
                  className={cn(
                    "text-[#1E3A27] text-[12px] md:text-[16px] lg:text-[18px] font-extrabold px-[14px] md:px-[20px] lg:px-[28px] leading-none",
                    "shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out",
                    "hover:scale-110 hover:opacity-100",
                    isActive ? "opacity-100 scale-105" : "opacity-40 hover:text-[#1E3A27]/80"
                  )}
                  style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
                >
                  L{idx + 1}
                </Link>
                {/* vertical separator, except after last */}
                {idx < lessons.length - 1 && (
                  <div className="w-px h-[22px] md:h-[30px] lg:h-[36px] bg-[#1E3A27]/40" />
                )}
              </div>
            )
          })}
        </div>

        {/* LECCIONES label below bar */}
        <p
          className="text-[#D3CBBA] text-[8px] md:text-[11px] lg:text-[13px] font-extralight text-center uppercase leading-normal mt-2"
          style={{ letterSpacing: '2.4px' }}
        >
          {lessonDict.lessons}
        </p>
      </div>

      {/* ── LESSON TITLE AREA ────────────────────────────────────────────────── */}
      {/*
        Figma:
          H1 "TÍTULO PRINCIPAL"    → text-24px ExtraBold centered         top-431
          "Lección X" micro-label  → text-5px  ExtraLight left-aligned    top-461
          Subtitle                 → text-13px Medium     right-aligned   top-475
          Vector13 (divider-dorado)→ h-0 w-122px left side                top-481
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-8 md:mt-12 px-[30px] md:px-10">
        {/* Main lesson title */}
        <h1
          className="text-[#D3CBBA] text-[24px] md:text-[32px] lg:text-[40px] font-extrabold text-center uppercase leading-normal w-full"
        >
          {pick(language, {
            es: lesson.title,
            en: lesson.title_en ?? null,
          }).toUpperCase()}
        </h1>

        {/* Micro label (left) + Subtitle (right) on same row */}
        <div className="flex items-start justify-between mt-2">
          {lesson.description && (
            <span className="text-[#D3CBBA] text-[13px] md:text-[16px] lg:text-[18px] font-medium text-right leading-normal uppercase">
              {pick(language, {
                es: lesson.description,
                en: lesson.description_en ?? null,
              })}
            </span>
          )}
        </div>

        {/* divider-dorado: golden line on the left side */}
        <div className="mt-1 w-[122px] md:w-[180px] lg:w-[220px] h-[2px] relative">
          <Image src={A.dividerDorado} alt="" fill className="object-cover" />
        </div>
      </div>

      {/* ── VIDEO SECTION ────────────────────────────────────────────────────── */}
      {/*
        Figma:
          image10 (marco frame bg):  w-346px h-201px opacity-57 centered  top-543
          image11 (video content):   w-320px h-171px             left-41px top-558

        The marco-video.png decorative frame sits behind the player as background.
        Video content (320px) is centered inside the 346px frame container.
        Bottom row: italic "Micro texto Opcional" (left) + "Unidad Audiovisual" (right)
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-6 md:mt-10 flex flex-col items-center">
        {/* frame + video wrapper */}
        <div className="relative w-[346px] md:w-[560px] lg:w-[700px] max-w-full flex items-center justify-center h-[201px] md:h-[315px] lg:h-[394px]">
          {/* marco-video decorative frame (behind video) */}
          <div className="absolute inset-0" style={{ opacity: 0.57, pointerEvents: 'none' }}>
            <Image src={A.marcoVideo} alt="" fill className="object-fill" />
          </div>

          {/* Actual video player: responsive sizing */}
          <div
            className="relative z-10 bg-black overflow-hidden w-[320px] md:w-[520px] lg:w-[650px] h-[171px] md:h-[293px] lg:h-[366px]"
          >
            <VideoPlayer url={lesson.video_url} lessonId={lesson.id} />
          </div>
        </div>

        {/* Below-video captions */}
        <div className="w-[343px] md:w-[540px] lg:w-[680px] max-w-full flex justify-between mt-[3px] px-0">
          <p className="text-[#D3CBBA] text-[5px] md:text-[8px] lg:text-[10px] font-light italic leading-[1.3]">
            {lessonDict.microOptional}
          </p>
          <p className="text-[#D3CBBA] text-[5px] md:text-[8px] lg:text-[10px] font-extralight leading-[1.3]">
            {lessonDict.audiovisualUnit}
          </p>
        </div>
      </div>

      {/* ── BODY TEXT ────────────────────────────────────────────────────────── */}
      {/*
        Figma: left-[calc(50%-171px)] w-343px text-10px font-Regular leading-1.3 justify text-justify top-796
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-8 md:mt-12 px-[30px] md:px-10">
        <div
          className="text-[#D3CBBA] text-[10px] md:text-sm lg:text-base font-normal leading-[1.3] md:leading-relaxed text-justify [&>p]:mb-0 [&>p+p]:mt-3"
        >
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <p>{lessonDict.noDescription}</p>
          )}
        </div>
      </div>

      {/* ── REFERENCIAS VISUALES ─────────────────────────────────────────────── */}
      {/*
        Figma: "Referencias Visuales" right-aligned text-7px ExtraLight
               3 columns × 3 rows of bg-[#d9d9d9] boxes, each 107×111px
               Columns left: 30px, 146px, 262px → gap ~5px, padding ~30px sides
      */}
      <div className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-10 md:mt-14 px-[30px] md:px-10">
        <p className="text-[#D3CBBA] text-[7px] md:text-[10px] lg:text-[12px] font-extralight text-right leading-[1.3] tracking-wide mb-2">
          {lessonDict.visualReferences}
        </p>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[5px] md:gap-3 lg:gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#D9D9D9] w-full"
              style={{ aspectRatio: '111/107' }}
            />
          ))}
        </div>
      </div>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────────────── */}
      {/*
        Figma layout:
          - "SIGUIENTE LECCIÓN" right-aligned SemiBold 8px tracking-0.48px  top-1523
          - thin separator line w-343px                                       top-1546
          - "LECCIÓN ANTERIOR"  left        SemiBold 8px tracking-0.48px  top-1549
          - next arrow (right)  w-29.6 h-9.2 rotated 180°                    top-1550
          - prev arrow (left)                                                 top-1534
          - full-width 2px separator line                                     top-1661
      */}
      <footer className="w-full max-w-[402px] md:max-w-[650px] lg:max-w-[800px] mx-auto mt-14 pb-0">

        {/* ── ROW ABOVE SEPARATOR ──────────────────────────────────────────────
            Left:  ← prev arrow only  (top-1534)
            Right: "SIGUIENTE LECCIÓN" text only  (top-1523)
        */}
        <div className="px-[30px] md:px-10 flex justify-between items-center mb-[3px]">
          {/* Prev arrow — left side, above separator */}
          <div>
            {prevLesson ? (
              <Link href={`/dashboard/courses/${courseId}/${prevLesson.id}`}>
                <div className="w-[29px] md:w-[36px] h-[9px] md:h-[11px] relative">
                  <Image src={A.backRow} alt={lessonDict.previousLesson} fill className="object-contain" />
                </div>
              </Link>
            ) : (
              <div className="w-[29px] h-[9px]" />
            )}
          </div>

          {/* "SIGUIENTE LECCIÓN" — right side, above separator */}
          {nextLesson ? (
            <Link href={`/dashboard/courses/${courseId}/${nextLesson.id}`}>
              <span
                className="text-[#D3CBBA] text-[8px] md:text-[12px] lg:text-[14px] font-semibold uppercase text-right leading-[20px]"
                style={{ letterSpacing: '0.48px' }}
              >
                {lessonDict.nextLesson}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* thin cream separator */}
        <div
          className="mx-auto w-[343px] md:w-[85%] h-px"
          style={{ background: '#D3CBBA', opacity: 0.35, boxShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
        />

        {/* ── ROW BELOW SEPARATOR ──────────────────────────────────────────────
            Left:  "LECCIÓN ANTERIOR" text only  (top-1549)
            Right: → next arrow only             (top-1550)
        */}
        <div className="px-[30px] md:px-10 flex justify-between items-center mt-[3px]">
          {/* "LECCIÓN ANTERIOR" — left side, below separator */}
          {prevLesson ? (
            <Link href={`/dashboard/courses/${courseId}/${prevLesson.id}`}>
              <span
                className="text-[#D3CBBA] text-[8px] md:text-[12px] lg:text-[14px] font-semibold uppercase leading-[20px]"
                style={{ letterSpacing: '0.48px' }}
              >
                {lessonDict.previousLesson}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {/* Next arrow — right side, below separator */}
          <div>
            {nextLesson ? (
              <Link href={`/dashboard/courses/${courseId}/${nextLesson.id}`}>
                <div className="w-[29.6px] md:w-[36px] h-[9.2px] md:h-[11px] relative">
                  <Image src={A.nextRow} alt={lessonDict.nextLesson} fill className="object-contain" />
                </div>
              </Link>
            ) : (
              <span className="text-[#D3CBBA] text-[8px] md:text-[12px] lg:text-[14px] font-extralight uppercase tracking-widest opacity-40">
                {lessonDict.endOfModule}
              </span>
            )}
          </div>
        </div>

        {/* full-width 2px separator at very bottom of nav */}
        <div
          className="w-full mt-8 h-[2px]"
          style={{ background: '#D3CBBA', opacity: 0.15, boxShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
        />
      </footer>

      {/* ── CONTACT FOOTER ────────────────────────────────────────────────── */}
      <DashboardFooter />

    </div>
  )
}