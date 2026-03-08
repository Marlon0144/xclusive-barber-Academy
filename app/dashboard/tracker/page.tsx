'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Submission } from '@/types/submissions'
import Image from 'next/image'
import { SubmissionCard } from './SubmissionCard'
import { SubmissionForm } from './SubmissionForm'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'

export default function TrackerPage() {
  // ── Estado del orquestador (solo el historial de prácticas) ──────────────
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // singleton client – stable reference
  const supabase = createClient()

  // Called by SubmissionForm after a successful upload to reload the list
  const fetchHistory = useCallback(() => {
    setRefreshTrigger(t => t + 1)
  }, [])

  useEffect(() => {
    let active = true

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !active) return

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('Error fetching history:', error)
      } else if (data) {
        setSubmissions(data as Submission[])
      }
    }

    load()
    return () => { active = false }
  }, [supabase, refreshTrigger])

  return (
    <div className="relative min-h-screen bg-[#161616] text-[#D3CBBA] font-sans overflow-x-hidden">

      {/* ── AMBIENT BACKGROUND GRADIENTS ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-950/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-900/5 blur-[120px] rounded-full" />
      </div>

      {/* ── NAV HEADER ───────────────────────────────────────────────────── */}
      {/* h-[61px] in component, flows in document */}
      <DashboardPageHeader title="Evolución Profesional" />

      {/* ── MAIN CONTENT (below header) ──────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center w-full md:max-w-[680px] lg:max-w-[800px] xl:max-w-[960px] md:mx-auto md:px-6">

        {/* ── BACK NAVIGATION ── (Figma: top 87px → 87-61=26px below header) */}
        <div className="w-full max-w-[402px] md:max-w-full px-[34px] mt-[26px] md:mt-10">
          <button
            onClick={() => window.history.back()}
            className="flex flex-col items-start gap-[3px] opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Volver"
          >
            <Image
              src="/assets/dashboard/tracker/back.row.png"
              alt="Volver"
              width={33}
              height={10}
              className="object-contain"
            />
          </button>
        </div>

        {/* ── COURSE NAME BANNER ──
             Figma: top 135px → 135-87-~10=38px gap after back nav
             bg rgba(30,58,39,0.51)  h-65px  w-333px  shadow        */}
        <div
          className="flex flex-col items-center justify-center w-[360px] md:w-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mt-[38px] md:mt-12 h-[65px] md:h-[80px] lg:h-[90px] md:rounded-lg"
          style={{ backgroundColor: 'rgba(30,58,39,0.51)' }}
        >
          {/* Course name image → text-nombreDelCurso.png (231px wide) */}
          <div className="relative w-[231px] md:w-[300px] lg:w-[350px] h-[15px] md:h-[20px]">
            <Image
              src="/assets/dashboard/tracker/text-nombreDelCurso.png"
              alt="Nombre del Curso"
              fill
              className="object-contain"
              sizes="231px"
            />
          </div>
          {/* Subtitle — Poppins ExtraLight 11px tracking-[0.99px] */}
          <p
            className="font-sans font-extralight text-[#d3cbba] text-[11px] md:text-sm text-center uppercase tracking-[0.99px] mt-[8px] md:mt-3"
          >
            Formación Profesional en Barbería
          </p>
        </div>

        {/* ── PAGE TITLE ──
             Figma: top 237px → ~37px gap after banner bottom (135+65=200 → 237-200=37px)
             Poppins ExtraBold 24px  text-[#d3cbba]  centered           */}
        <h1
          className="font-sans font-extrabold text-[#d3cbba] text-[24px] md:text-[32px] lg:text-[36px] text-center uppercase leading-normal mt-[37px] md:mt-10"
        >
          SEGUIMIENTO Y EVALUACIÓN
        </h1>

        {/* ── GOLD DIVIDER LINE ──
             Figma: top 275px (title top 237 + h ~28 = 265 → gap 10px)
             Uses divider-dorado.png asset (333px wide)                 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/dashboard/tracker/divider-dorado%20.png"
          alt=""
          className="block mt-[10px] md:mt-4 w-[333px] md:w-[460px] lg:w-[550px] max-w-[90vw]"
        />

        {/* ── DESCRIPTION ──
             Figma: top 290px (line at 275+1=276 → gap 14px)
             Poppins Regular 9px  text-[#d3cbba]  w-336px              */}
        <p
          className="font-sans font-normal text-[#d3cbba] text-[9px] md:text-sm text-center leading-[1.3] md:leading-relaxed mt-[14px] md:mt-5 w-[336px] md:w-full max-w-[90vw] md:max-w-full"
        >
          Revisa observaciones, evaluaciones y retroalimentación profesional sobre tu desempeño y evolución dentro del programa.
        </p>

        {/* ── SUBTITLE "ENVÍA TU PRÁCTICA..." ──
             Figma: top 352px (desc top 290+h~28=318 → gap 34px)
             Poppins ExtraLight 11px  tracking-[0.99px]  w-295px  centered */}
        <p
          className="font-sans font-extralight text-[#d3cbba] text-[11px] md:text-base text-center uppercase leading-normal tracking-[0.99px] mt-[34px] md:mt-10 w-[295px] md:w-full max-w-[85vw] md:max-w-full"
        >
          ENVÍA TU PRÁCTICA, RECIBE EVALUACIÓN PROFESIONAL Y ELEVA TU ESTÁNDAR TÉCNICO
        </p>

        {/* ── SUBMISSION FORM ──
             Figma: "ENTREGA DE EVIDENCIA" at top 434px (subtitle bottom ~400 → gap 20px) */}
        <div className="w-full mt-[20px] md:mt-8">
          <SubmissionForm onSubmitSuccess={fetchHistory} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PRÁCTICAS ENVIADAS SECTION
            Figma: top 990px
            Top line + title + bottom line + subtitle + cards
        ════════════════════════════════════════════════════════════════════ */}
        <section className="w-full flex flex-col items-center mt-[45px] md:mt-16">

          {/* Top divider line — w-269px (Figma: 209:431) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dashboard/tracker/divider-dorado%20.png"
            alt=""
            className="block w-[269px] md:w-[400px] lg:w-[500px] max-w-[80vw]"
          />

          {/* Section title — Poppins ExtraBold 24px text-[#d3cbba] centered */}
          <h2
            className="font-sans font-extrabold text-[#d3cbba] text-[24px] md:text-[32px] lg:text-[36px] text-center uppercase leading-normal mt-[9px] md:mt-4 mb-[9px] md:mb-4"
          >
            PRÁCTICAS ENVIADAS
          </h2>

          {/* Bottom divider line — w-269px (Figma: 209:429) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dashboard/tracker/divider-dorado%20.png"
            alt=""
            className="block w-[269px] md:w-[400px] lg:w-[500px] max-w-[80vw]"
          />

          {/* Subtitle — Poppins Regular 9px text-[#d3cbba] centered
               Figma: top 1054px (bottom line at 1042 → gap 12px)         */}
          <p
            className="font-sans font-normal text-[#d3cbba] text-[9px] md:text-sm text-center leading-[1.3] md:leading-relaxed mt-[12px] md:mt-4 w-[269px] md:w-[400px] lg:w-[500px] max-w-[80vw] md:max-w-full"
          >
            Seguimiento de envíos y estado de revisión.
          </p>

          {/* ── CARDS LIST ──────────────────────────────────────────────── */}
          <div className="w-full mt-[66px] md:mt-10 space-y-0 md:space-y-3">
            {submissions.length === 0 ? (
              <div className="py-12 md:py-16 text-center border border-dashed border-[#d3cbba]/10 mx-4 md:rounded-lg">
                <p className="text-[#d3cbba]/40 text-[10px] md:text-sm uppercase tracking-widest">
                  No hay prácticas registradas
                </p>
              </div>
            ) : (
              submissions.map((sub, index) => (
                <SubmissionCard
                  key={sub.id}
                  submission={sub}
                  index={index}
                  total={submissions.length}
                  onDelete={(id) => setSubmissions(prev => prev.filter(s => s.id !== id))}
                />
              ))
            )}
          </div>

        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <DashboardFooter />

      </div>
    </div>
  )
}
