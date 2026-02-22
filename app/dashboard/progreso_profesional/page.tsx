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

function statusColor(pct: number): string {
  if (pct === 100) return '#D4AF37'
  if (pct >= 50) return '#7aab7a'
  if (pct > 0) return '#a0a0a0'
  return '#555'
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
    <svg width="75" height="75" viewBox="0 0 75 75">
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
        fill="white"
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
    <svg viewBox="0 0 402 160" width="100%" height="160" aria-hidden="true">
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
        const tColor = active ? '#D4AF37' : '#555'
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
      <p className="text-[9px] font-bold uppercase tracking-widest leading-tight text-[#1e3a27]">
        {comp.label}
      </p>
      <p className="text-[9px] mt-0.5 font-normal text-[#1e3a27]/70">{status}</p>
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
      <DashboardGreenHeader userName={student.name} userEmail={student.email} showDashboardLink />

      <div className="min-h-screen bg-[#161616] text-white">
        <div className="max-w-[402px] mx-auto">

          {/* ── BACK ARROW ──────────────────────────────────────────────────── */}
          <div className="px-4 pt-3 pb-0">
            <Link href="/dashboard" className="inline-block">
              <div className="relative w-[28px] h-[20px]">
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
            <div className="absolute left-0 top-0 w-[142px] h-full bg-[#1d1d1d]" />
            <div className="relative flex">
              {/* Foto */}
              <div className="w-[142px] flex-shrink-0">
                <div className="relative w-[108px] h-[153px] mx-auto mt-5">
                  <Image
                    src="/assets/progreso_profesional/foto-estudiante.png"
                    alt="Foto del estudiante"
                    fill className="object-cover" sizes="108px"
                  />
                </div>
              </div>
              {/* Título */}
              <div className="flex-1 pt-6 pr-4 pl-3">
                <h1
                  className="font-serif font-black uppercase leading-none text-white"
                  style={{ fontSize: 'clamp(22px, 7vw, 30px)' }}
                >
                  PROGRESO<br />PROFESIONAL
                </h1>
                {/* Divider dorado — asset real del diseño Figma */}
                <div className="relative w-full h-[4px] my-2">
                  <Image
                    src="/assets/progreso_profesional/divider-dorado.png"
                    alt=""
                    fill
                    className="object-contain object-left"
                    sizes="(max-width: 402px) 100vw, 260px"
                  />
                </div>
                <p className="text-[10px] text-[#a09880] leading-tight">
                  Seguimiento de tu desarrollo dentro del programa formativo.
                </p>
              </div>
            </div>
          </section>

          {/* ── INFO ESTUDIANTE + COMPETENCIAS ─────────────────────────────── */}
          <section className="flex min-h-[242px]">
            {/* Columna izquierda */}
            <div className="w-[142px] flex-shrink-0 bg-[#1d1d1d] px-6 py-6 space-y-5">
              {[
                { label: 'Estudiante',    value: student.name,       valueColor: '#c8c0b0' },
                { label: 'Correo',        value: student.email,      valueColor: '#c8c0b0' },
                { label: 'Fecha de Inicio', value: enrolledDate,     valueColor: '#c8c0b0' },
                { label: 'Estado Actual', value: student.status,     valueColor: '#7aab7a' },
              ].map(({ label, value, valueColor }) => (
                <div key={label}>
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                    {label}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-tight break-all" style={{ color: valueColor }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Caja de competencias — fondo crema difuminado tal como en Figma */}
            <div className="flex-1 mx-4 my-6 rounded-sm backdrop-blur-[2px] bg-[#d3cbba]/60 px-3 py-3 flex flex-col">
              <h2
                className="font-serif font-black text-center uppercase leading-tight mb-4 text-[#1e3a27]"
                style={{ fontSize: '13px' }}
              >
                DESARROLLO DE<br />COMPETENCIAS
              </h2>
              <div className="flex-1 space-y-[14px]">
                {competencies.map((comp) => (
                  <CompetencyRow key={comp.key} comp={comp} />
                ))}
              </div>
            </div>
          </section>

          {/* ── MÉTRICAS ────────────────────────────────────────────────────── */}
          <section className="bg-[#1d1d1d] mt-4 px-4 py-5">
            {/* Labels */}
            <div className="grid grid-cols-3 text-center mb-3">
              {['Progreso\nGeneral', 'Módulos\nCompletados', 'Prácticas\nEnviadas'].map((lbl) => (
                <p key={lbl} className="text-[8px] font-bold uppercase tracking-widest text-[#c8c0b0] leading-tight whitespace-pre-line">
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
                <span className="font-serif font-black text-white text-[28px]">
                  {metrics.completedModules}
                </span>
                <span className="text-[#D4AF37] font-bold mx-1 text-sm">DE</span>
                <span className="font-serif font-black text-white text-[28px]">
                  {metrics.totalModules}
                </span>
              </div>
              <div>
                <span className="font-serif font-black text-white text-[36px]">
                  {metrics.submittedPractices}
                </span>
              </div>
            </div>
          </section>

          {/* ── AVANCE PROFESIONAL ──────────────────────────────────────────── */}
          <section className="bg-[#161616] pt-8 pb-4 flex flex-col items-center">
            {/* Logo */}
            <div className="relative w-[55px] h-[87px] mb-4">
              <Image
                src="/assets/progreso_profesional/logo-xclusive.png"
                alt="Xclusive Barber Academy" fill
                className="object-contain" sizes="55px"
              />
            </div>
            {/* Texto "AVANCE PROFESIONAL" */}
            <div className="relative w-[266px] h-[18px] mb-6">
              <Image
                src="/assets/progreso_profesional/recurso-texto.png"
                alt="Avance Profesional" fill
                className="object-contain" sizes="266px"
              />
            </div>
            {/* Timeline */}
            <div className="w-full">
              <LevelTimeline idx={currentLevelIndex} />
            </div>
          </section>

          {/* ── PRÓXIMO NIVEL ───────────────────────────────────────────────── */}
          {nextLevel && nextLevelInfo && (
            <section className="px-4 pb-6">
              <div className="relative border border-[#1c3122]/60 bg-[rgba(28,49,34,0.64)] rounded-sm px-4 pt-8 pb-4 shadow-md">
                <p className="absolute top-3 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#a0a080]">
                  PRÓXIMO NIVEL:
                </p>
                <p className="text-center font-serif font-black uppercase text-[#D4AF37]"
                   style={{ fontSize: '15px', letterSpacing: '0.05em' }}>
                  {nextLevel.label}
                </p>
                <p className="text-center mt-2 text-[8px] uppercase tracking-widest leading-relaxed text-[#555]">
                  REQUIERE: {nextLevelInfo.required} DE {metrics.totalModules} MÓDULOS COMPLETADOS
                  <br />
                  FALTAN: {nextLevelInfo.remaining}{' '}
                  {nextLevelInfo.remaining === 1 ? 'MÓDULO' : 'MÓDULOS'}
                </p>
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <section className="px-5 py-8 text-center space-y-4">
            <h2
              className="font-serif font-black uppercase leading-tight text-white"
              style={{ fontSize: 'clamp(20px, 7vw, 28px)' }}
            >
              ¡ESTÁS AVANZANDO CON CONSISTENCIA!
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-[#a09880]">
              Mantén el ritmo para alcanzar<br />tu máximo potencial.
            </p>
            <Link
              href="/dashboard/courses"
              className="inline-block mt-2 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-3 hover:bg-[#D4AF37] hover:text-black transition-colors duration-200"
            >
              ¡SIGUE APRENDIENDO!
            </Link>
          </section>

          {/* ── FOOTER ──────────────────────────────────────────────────────── */}
          <footer className="px-5 pb-6 pt-2">
            <div className="w-full h-px bg-[#1c1c1c] mb-5" />
            <div className="relative flex items-center justify-center">
              {/* Instagram */}
              <div className="absolute left-0 flex items-center gap-2">
                <div className="relative w-[26px] h-[26px]">
                  <Image src="/assets/progreso_profesional/instagram-icon.png" alt="Instagram"
                    fill className="object-contain opacity-70" sizes="26px" />
                </div>
                <p className="text-[9px] text-[#a09880] font-medium">@xclusivebarberau</p>
              </div>
              {/* Logo */}
              <div className="relative w-[31px] h-[38px]">
                <Image src="/assets/progreso_profesional/logo-xclusive.png" alt="Xclusive Barber Academy"
                  fill className="object-contain" sizes="31px" />
              </div>
              {/* WhatsApp */}
              <div className="absolute right-0 flex items-center gap-1.5">
                <div className="relative w-[14px] h-[15px]">
                  <Image src="/assets/progreso_profesional/wpp-icon.png" alt="WhatsApp"
                    fill className="object-contain" sizes="14px" />
                </div>
                <p className="text-[9px] text-[#a09880] font-medium">+61 413 891 977</p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}
