/**
 * /dashboard/progreso_profesional
 * Diseño 1:1 con Figma Node 213:62 — Sprint 6b
 *
 * Server Component puro (bundle JS = 0). Todos los datos llegan del servidor.
 * Assets: /assets/progreso_profesional/ (5 archivos, sin descargas adicionales).
 */

import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProgressPageData } from './actions'
import DashboardGreenHeader from '@/components/headers/DashboardGreenHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import type { CompetencyProgress } from '@/types/progress'

export const metadata = {
  title: 'Progreso Profesional | Xclusive Barber Academy',
}

// ─── Helpers puramente computacionales (server-side, sin bundle) ──────────────

function competencyStatus(pct: number): string {
  if (pct === 100) return 'Completado'
  if (pct >= 50) return 'Competente'
  if (pct > 0) return 'En Progreso'
  return 'Sin Iniciar'
}

function modulesForNextLevel(
  minPct: number,
  totalModules: number,
  completedModules: number,
): { required: number; remaining: number } {
  const required = Math.ceil((minPct / 100) * totalModules)
  const remaining = Math.max(0, required - completedModules)
  return { required, remaining }
}

// ─── Sub-componente: Círculo de progreso (SVG inline — zero client JS) ─────────
function ProgressCircle({ pct }: { pct: number }) {
  const r = 30
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct / 100)
  return (
    <svg viewBox="0 0 75 75" className="w-[75px] h-[75px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]">
      <circle cx="37.5" cy="37.5" r={r} fill="none" stroke="#1a2e1a" strokeWidth="7" />
      <circle
        cx="37.5" cy="37.5" r={r}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 37.5 37.5)"
      />
      <text
        x="37.5" y="43"
        textAnchor="middle"
        fill="#d3cbba"
        fontSize="14"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        {pct}%
      </text>
    </svg>
  )
}

// ─── Sub-componente: Timeline de niveles (SVG inline) ─────────────────────────
const LEVEL_DOTS = [
  { label: ['TALENTO EN', 'FORMACIÓN'],    cx: 60,  cy: 112, below: true  },
  { label: ['TÉCNICO EN', 'DESARROLLO'],   cx: 158, cy: 44,  below: false },
  { label: ['BARBERO', 'AVANZADO'],        cx: 250, cy: 75,  below: true  },
  { label: ['PROFESIONAL', 'XCLUSIVE'],   cx: 344, cy: 57,  below: false },
]
const TIMELINE_PATH = 'M60,112 C90,112 128,44 158,44 S215,72 250,75 S315,57 344,57'
const ACTIVE_OFFSETS = [1000, 680, 380, 0]

function LevelTimeline({ idx }: { idx: number }) {
  return (
    <svg viewBox="0 0 402 160" className="w-full h-[160px] md:h-[200px]" aria-hidden="true">
      <path d={TIMELINE_PATH} fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
      {idx > 0 && (
        <path
          d={TIMELINE_PATH}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset={ACTIVE_OFFSETS[Math.min(idx, 3)]}
        />
      )}
      {LEVEL_DOTS.map((dot, i) => {
        const active = i === idx
        const past   = i < idx
        const fill   = active ? '#D4AF37' : past ? '#7aab7a' : '#333'
        const tColor = active ? '#d3cbba' : '#2b2b2b'
        const y1 = dot.below ? dot.cy + 18 : dot.cy - 18
        const y2 = dot.below ? dot.cy + 27 : dot.cy - 9
        return (
          <g key={i}>
            {active && <circle cx={dot.cx} cy={dot.cy} r="9" fill="none" stroke="#D4AF37" strokeWidth="1.5" />}
            <circle cx={dot.cx} cy={dot.cy} r="5" fill={fill} />
            <text x={dot.cx} y={y1} textAnchor="middle" fill={tColor}
              fontSize="7" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.05em">
              {dot.label[0]}
            </text>
            <text x={dot.cx} y={y2} textAnchor="middle" fill={tColor}
              fontSize="7" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.05em">
              {dot.label[1]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Sub-componente: Fila de competencia ──────────────────────────────────────
// Sobre fondo crema (#d3cbba), todo el texto usa verde oscuro (#1e3a27)
function CompetencyRow({ comp }: { comp: CompetencyProgress }) {
  const status = competencyStatus(comp.percentage)
  return (
    <div className="text-center">
      <p className="text-[9px] md:text-xs lg:text-sm font-bold uppercase tracking-widest leading-tight text-[#1e3a27]">
        {comp.label}
      </p>
      <p className="text-[9px] md:text-xs lg:text-sm mt-0.5 font-normal text-[#1e3a27]">{status}</p>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default async function ProgressPage() {
  const data = await fetchProgressPageData()
  if (!data) redirect('/login')

  const { student, competencies, metrics, currentLevel, nextLevel } = data

  const levelKeys = ['talento', 'tecnico', 'avanzado', 'profesional']
  const currentLevelIndex = levelKeys.indexOf(currentLevel.key)

  const nextLevelInfo = nextLevel
    ? modulesForNextLevel(nextLevel.minPercentage, metrics.totalModules, metrics.completedModules)
    : null

  const enrolledDate = new Date(student.enrolledAt).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <>
      <DashboardGreenHeader userName={student.name} userEmail={student.email} />

      <div className="min-h-screen bg-[#161616] text-white">
        <div className="max-w-[402px] md:max-w-[700px] lg:max-w-[960px] mx-auto">

          {/* ── BACK ARROW ──────────────────────────────────────────────────── */}
          <div className="px-4 md:px-6 lg:px-8 pt-3 md:pt-5 pb-0">
            <Link href="/dashboard" className="inline-block">
              <div className="relative w-[28px] h-[20px] md:w-[36px] md:h-[26px]">
                <Image
                  src="/assets/progreso_profesional/back-row.png"
                  alt="Volver al Dashboard"
                  fill
                  className="object-contain"
                  sizes="28px"
                />
              </div>
            </Link>
          </div>

          {/* ── HERO: foto + título ─────────────────────────────────────────── */}
          <section className="relative">
            <div className="absolute left-0 top-0 w-[142px] md:w-[220px] lg:w-[300px] h-full bg-[#1d1d1d]" />
            <div className="relative flex">
              {/* Foto */}
              <div className="w-[142px] md:w-[220px] lg:w-[300px] flex-shrink-0">
                <div className="relative w-[108px] h-[153px] md:w-[170px] md:h-[240px] lg:w-[230px] lg:h-[325px] mx-auto mt-5 md:mt-8">
                  <Image
                    src="/assets/progreso_profesional/foto-estudiante.png"
                    alt="Foto del estudiante"
                    fill className="object-cover" sizes="(max-width: 767px) 108px, (max-width: 1023px) 170px, 230px"
                  />
                </div>
              </div>
              {/* Título */}
              <div className="flex-1 pt-6 md:pt-10 lg:pt-14 pr-4 md:pr-6 lg:pr-8 pl-3 md:pl-5 lg:pl-6">
                <h1
                  className="font-serif font-black uppercase leading-none text-[#d3cbba] text-[clamp(22px,7vw,30px)] md:text-4xl lg:text-5xl"
                >
                  PROGRESO<br />PROFESIONAL
                </h1>
                {/* Divider dorado — asset real del diseño Figma */}
                <div className="relative w-full h-[4px] md:h-[6px] my-2 md:my-3">
                  <Image
                    src="/assets/progreso_profesional/divider-dorado.png"
                    alt=""
                    fill
                    className="object-contain object-left"
                    sizes="(max-width: 402px) 100vw, (max-width: 767px) 260px, 100%"
                  />
                </div>
                <p className="text-[10px] md:text-sm lg:text-base text-[#d3cbba] leading-tight md:leading-relaxed">
                  Seguimiento de tu desarrollo dentro del programa formativo.
                </p>
              </div>
            </div>
          </section>

          {/* ── INFO ESTUDIANTE + COMPETENCIAS ─────────────────────────────── */}
          <section className="flex min-h-[242px] md:min-h-[320px] lg:min-h-[380px]">
            {/* Columna izquierda */}
            <div className="w-[142px] md:w-[220px] lg:w-[300px] flex-shrink-0 bg-[#1d1d1d] px-6 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 space-y-5 md:space-y-6">
              {[
                { label: 'Estudiante',    value: student.name,       valueColor: '#d3cbba' },
                { label: 'Correo',        value: student.email,      valueColor: '#d3cbba' },
                { label: 'Fecha de Inicio', value: enrolledDate,     valueColor: '#d3cbba' },
                { label: 'Estado Actual', value: student.status,     valueColor: '#d3cbba' },
              ].map(({ label, value, valueColor }) => (
                <div key={label}>
                  <p className="text-[8px] md:text-[11px] lg:text-xs font-bold uppercase tracking-[0.15em] text-[#d3cbba]">
                    {label}
                  </p>
                  <p className="text-[9px] md:text-xs lg:text-sm mt-0.5 leading-tight break-all" style={{ color: valueColor }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Caja de competencias — fondo crema difuminado tal como en Figma */}
            <div className="flex-1 mx-4 md:mx-6 lg:mx-8 my-6 md:my-8 rounded-sm backdrop-blur-[2px] bg-[#d3cbba]/60 px-3 md:px-6 lg:px-8 py-3 md:py-5 lg:py-6 flex flex-col">
              <h2
                className="font-serif font-black text-center uppercase leading-tight mb-4 md:mb-6 text-[#1e3a27] text-[13px] md:text-base lg:text-lg"
              >
                DESARROLLO DE<br />COMPETENCIAS
              </h2>
              <div className="flex-1 space-y-[14px] md:space-y-5 lg:space-y-6">
                {competencies.map((comp) => (
                  <CompetencyRow key={comp.key} comp={comp} />
                ))}
              </div>
            </div>
          </section>

          {/* ── MÉTRICAS ────────────────────────────────────────────────────── */}
          <section className="bg-[#1d1d1d] mt-4 md:mt-6 px-4 md:px-8 lg:px-12 py-5 md:py-8 lg:py-10">
            {/* Labels */}
            <div className="grid grid-cols-3 text-center mb-3 md:mb-5">
              {['Progreso\nGeneral', 'Módulos\nCompletados', 'Prácticas\nEnviadas'].map((lbl) => (
                <p key={lbl} className="text-[8px] md:text-[11px] lg:text-xs font-bold uppercase tracking-widest text-[#d3cbba] leading-tight whitespace-pre-line">
                  {lbl}
                </p>
              ))}
            </div>
            {/* Valores */}
            <div className="grid grid-cols-3 items-center text-center">
              <div className="flex justify-center">
                <ProgressCircle pct={metrics.generalProgressPercentage} />
              </div>
              <div>
                <span className="font-serif font-black text-[#d3cbba] text-[28px] md:text-[36px] lg:text-[44px]">
                  {metrics.completedModules}
                </span>
                <span className="text-[#1e3a27] font-bold mx-1 text-sm md:text-base lg:text-lg">DE</span>
                <span className="font-serif font-black text-[#d3cbba] text-[28px] md:text-[36px] lg:text-[44px]">
                  {metrics.totalModules}
                </span>
              </div>
              <div>
                <span className="font-serif font-black text-[#d3cbba] text-[36px] md:text-[48px] lg:text-[56px]">
                  {metrics.submittedPractices}
                </span>
              </div>
            </div>
          </section>

          {/* ── AVANCE PROFESIONAL ──────────────────────────────────────────── */}
          <section className="bg-[#161616] pt-8 md:pt-12 lg:pt-16 pb-4 md:pb-6 flex flex-col items-center">
            {/* Logo */}
            <div className="relative w-[55px] h-[87px] md:w-[75px] md:h-[118px] lg:w-[90px] lg:h-[142px] mb-4 md:mb-6">
              <Image
                src="/assets/progreso_profesional/logo-xclusive.png"
                alt="Xclusive Barber Academy" fill
                className="object-contain" sizes="(max-width: 767px) 55px, (max-width: 1023px) 75px, 90px"
              />
            </div>
            {/* Texto "AVANCE PROFESIONAL" */}
            <div className="relative w-[266px] h-[18px] md:w-[380px] md:h-[26px] lg:w-[480px] lg:h-[32px] mb-6 md:mb-8">
              <Image
                src="/assets/progreso_profesional/recurso-texto.png"
                alt="Avance Profesional" fill
                className="object-contain" sizes="(max-width: 767px) 266px, (max-width: 1023px) 380px, 480px"
              />
            </div>
            {/* Timeline */}
            <div className="w-full">
              <LevelTimeline idx={currentLevelIndex} />
            </div>
          </section>

          {/* ── PRÓXIMO NIVEL ───────────────────────────────────────────────── */}
          {nextLevel && nextLevelInfo && (
            <section className="px-4 md:px-8 lg:px-12 pb-6 md:pb-8">
              <div className="relative border border-[#1c3122]/60 bg-[rgba(28,49,34,0.64)] rounded-sm px-4 md:px-8 lg:px-10 pt-8 md:pt-10 pb-4 md:pb-6 shadow-md">
                <p className="absolute top-3 md:top-4 left-0 right-0 text-center text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-[0.3em] text-[#d3cbba]">
                  PRÓXIMO NIVEL:
                </p>
                <p className="text-center font-serif font-black uppercase text-[#d3cbba] text-[15px] md:text-xl lg:text-2xl tracking-[0.05em]">
                  {nextLevel.label}
                </p>
                <p className="text-center mt-2 md:mt-3 text-[8px] md:text-[11px] lg:text-xs uppercase tracking-widest leading-relaxed text-[#d3cbba]">
                  REQUIERE: {nextLevelInfo.required} DE {metrics.totalModules} MÓDULOS COMPLETADOS
                  <br />
                  FALTAN: {nextLevelInfo.remaining}{' '}
                  {nextLevelInfo.remaining === 1 ? 'MÓDULO' : 'MÓDULOS'}
                </p>
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <section className="px-5 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 text-center space-y-4 md:space-y-6">
            <h2
              className="font-serif font-black uppercase leading-tight text-[#d3cbba] text-[clamp(20px,7vw,28px)] md:text-4xl lg:text-5xl"
            >
              ¡ESTÁS AVANZANDO CON CONSISTENCIA!
            </h2>
            <p className="text-[11px] md:text-sm lg:text-base font-bold uppercase tracking-widest leading-relaxed text-[#d3cbba]">
              Mantén el ritmo para alcanzar<br />tu máximo potencial.
            </p>
            <Link
              href="/dashboard/courses"
              className="inline-block mt-2 bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.2em] text-[11px] md:text-sm px-8 md:px-12 py-3 md:py-4 hover:bg-[#c8c0b0] transition-colors duration-200"
            >
              ¡SIGUE APRENDIENDO!
            </Link>
          </section>

          {/* ── FOOTER ──────────────────────────────────────────────────────── */}
          <DashboardFooter />

        </div>
      </div>
    </>
  )
}
