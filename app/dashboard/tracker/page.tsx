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
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* ── BACK NAVIGATION ── (Figma: top 87px → 87-61=26px below header) */}
        <div className="w-full max-w-[402px] px-[34px]" style={{ marginTop: '26px' }}>
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
          className="flex flex-col items-center justify-center w-[360px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            marginTop: '38px',
            height: '65px',
            backgroundColor: 'rgba(30,58,39,0.51)',
          }}
        >
          {/* Course name image → text-nombreDelCurso.png (231px wide) */}
          <div className="relative" style={{ width: '231px', height: '15px' }}>
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
            className="font-sans font-extralight text-[#d3cbba] text-[11px] text-center uppercase"
            style={{ letterSpacing: '0.99px', marginTop: '8px' }}
          >
            Formación Profesional en Barbería
          </p>
        </div>

        {/* ── PAGE TITLE ──
             Figma: top 237px → ~37px gap after banner bottom (135+65=200 → 237-200=37px)
             Poppins ExtraBold 24px  text-[#d3cbba]  centered           */}
        <h1
          className="font-sans font-extrabold text-[#d3cbba] text-[24px] text-center uppercase leading-normal"
          style={{ marginTop: '37px' }}
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
          style={{ width: '333px', maxWidth: '90vw', display: 'block', marginTop: '10px' }}
        />

        {/* ── DESCRIPTION ──
             Figma: top 290px (line at 275+1=276 → gap 14px)
             Poppins Regular 9px  text-[#d3cbba]  w-336px              */}
        <p
          className="font-sans font-normal text-[#d3cbba] text-[9px] text-center leading-[1.3]"
          style={{ marginTop: '14px', width: '336px', maxWidth: '90vw' }}
        >
          Revisa observaciones, evaluaciones y retroalimentación profesional sobre tu desempeño y evolución dentro del programa.
        </p>

        {/* ── SUBTITLE "ENVÍA TU PRÁCTICA..." ──
             Figma: top 352px (desc top 290+h~28=318 → gap 34px)
             Poppins ExtraLight 11px  tracking-[0.99px]  w-295px  centered */}
        <p
          className="font-sans font-extralight text-[#d3cbba] text-[11px] text-center uppercase leading-normal"
          style={{ letterSpacing: '0.99px', marginTop: '34px', width: '295px', maxWidth: '85vw' }}
        >
          ENVÍA TU PRÁCTICA, RECIBE EVALUACIÓN PROFESIONAL Y ELEVA TU ESTÁNDAR TÉCNICO
        </p>

        {/* ── SUBMISSION FORM ──
             Figma: "ENTREGA DE EVIDENCIA" at top 434px (subtitle bottom ~400 → gap 20px) */}
        <div className="w-full" style={{ marginTop: '20px' }}>
          <SubmissionForm onSubmitSuccess={fetchHistory} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PRÁCTICAS ENVIADAS SECTION
            Figma: top 990px
            Top line + title + bottom line + subtitle + cards
        ════════════════════════════════════════════════════════════════════ */}
        <section className="w-full flex flex-col items-center" style={{ marginTop: '45px' }}>

          {/* Top divider line — w-269px (Figma: 209:431) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dashboard/tracker/divider-dorado%20.png"
            alt=""
            style={{ width: '269px', maxWidth: '80vw', display: 'block' }}
          />

          {/* Section title — Poppins ExtraBold 24px text-[#d3cbba] centered */}
          <h2
            className="font-sans font-extrabold text-[#d3cbba] text-[24px] text-center uppercase leading-normal"
            style={{ marginTop: '9px', marginBottom: '9px' }}
          >
            PRÁCTICAS ENVIADAS
          </h2>

          {/* Bottom divider line — w-269px (Figma: 209:429) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dashboard/tracker/divider-dorado%20.png"
            alt=""
            style={{ width: '269px', maxWidth: '80vw', display: 'block' }}
          />

          {/* Subtitle — Poppins Regular 9px text-[#d3cbba] centered
               Figma: top 1054px (bottom line at 1042 → gap 12px)         */}
          <p
            className="font-sans font-normal text-[#d3cbba] text-[9px] text-center leading-[1.3]"
            style={{ marginTop: '12px', width: '269px', maxWidth: '80vw' }}
          >
            Seguimiento de envíos y estado de revisión.
          </p>

          {/* ── CARDS LIST ──────────────────────────────────────────────── */}
          <div className="w-full mt-[66px] space-y-0">
            {submissions.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#d3cbba]/10 mx-4">
                <p className="text-[#d3cbba]/40 text-[10px] uppercase tracking-widest">
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
