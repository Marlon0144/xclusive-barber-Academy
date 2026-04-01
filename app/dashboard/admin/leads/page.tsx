import { redirect } from 'next/navigation'
import { Filter, Users } from 'lucide-react'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import { deleteLeadAction, updateLeadReviewAction } from './actions'

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted'
type LeadStageValue = '1' | '2' | '3' | '4'

type LeadStage = {
  value: LeadStageValue
  title: string
  label: string
}
type LeadAnswer = {
  question_key: string
  answer_text: string | null
  answer_number: number | null
  answer_choice: string | null
}

type LeadRow = {
  id: string
  full_name: string | null
  email: string | null
  phone_number: string | null
  profile_id: string | null
  stage1_entered_at: string | null
  stage2_entered_at: string | null
  stage3_entered_at: string | null
  stage4_entered_at: string | null
  auto_score: number
  status: LeadStatus
  source: string
  qualification_completed_at: string | null
  review_notes: string | null
  created_at: string
  crm_lead_answers?: LeadAnswer[]
}

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string
    status?: LeadStatus | 'all'
    stage?: LeadStageValue | 'all'
  }>
}

function resolveLeadStage(lead: LeadRow): LeadStage {
  if (Boolean(lead.profile_id) && Boolean(lead.qualification_completed_at)) {
    return { value: '4', title: 'Cuenta creada', label: 'Etapa 4' }
  }

  if (
    Boolean(lead.qualification_completed_at) ||
    lead.status === 'contacted' ||
    lead.status === 'qualified'
  ) {
    return { value: '3', title: 'Muy interesado', label: 'Etapa 3' }
  }

  if (lead.source === 'apply_page_visit') {
    return { value: '2', title: 'Interesado', label: 'Etapa 2' }
  }

  return { value: '1', title: 'Curioso', label: 'Etapa 1' }
}

function resolveCurrentStageEnteredAt(lead: LeadRow, stage: LeadStage): string | null {
  if (stage.value === '1') return lead.stage1_entered_at
  if (stage.value === '2') return lead.stage2_entered_at
  if (stage.value === '3') return lead.stage3_entered_at
  return lead.stage4_entered_at
}

function formatDate(dateValue: string) {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return '-'

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

const STATUS_OPTIONS: Array<{ value: LeadStatus; label: string }> = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'lost', label: 'Perdido' },
  { value: 'converted', label: 'Convertido' },
]

const STAGE_OPTIONS: Array<{ value: LeadStageValue; label: string }> = [
  { value: '1', label: 'Etapa 1 - Curioso' },
  { value: '2', label: 'Etapa 2 - Interesado' },
  { value: '3', label: 'Etapa 3 - Muy interesado' },
  { value: '4', label: 'Etapa 4 - Cuenta creada' },
]

const QUESTION_LABELS: Record<string, string> = {
  city_suburb: 'Ciudad / suburbio',
  has_cut_hair_before: 'Ha cortado cabello antes',
  main_goal: 'Objetivo principal',
  considered_other_programs: 'Ha considerado otros programas',
  seriousness: 'Nivel de seriedad (1-10)',
  income_goal: 'Meta de ingresos',
  follows_barber_pages: 'Sigue barber pages',
  financial_preparedness: 'Preparacion financiera',
  career_start_window: 'Cuando quiere empezar',
  long_term_ambition: 'Ambicion a largo plazo',
  call_willingness: 'Disposicion a llamada',
}

const QUESTION_ORDER = [
  'city_suburb',
  'has_cut_hair_before',
  'main_goal',
  'considered_other_programs',
  'seriousness',
  'income_goal',
  'follows_barber_pages',
  'financial_preparedness',
  'career_start_window',
  'long_term_ambition',
  'call_willingness',
]

function formatAnswerValue(answer: LeadAnswer) {
  if (answer.answer_text) return answer.answer_text
  if (typeof answer.answer_number === 'number') return String(answer.answer_number)
  if (answer.answer_choice) return answer.answer_choice
  return 'Sin respuesta'
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-center bg-black">
        <div className="max-w-md space-y-4">
          <div className="text-red-500 text-6xl">!</div>
          <h1 className="text-3xl font-serif text-white">Acceso Restringido</h1>
          <p className="text-zinc-500">Esta zona esta reservada exclusivamente para administradores.</p>
          <a href="/dashboard" className="text-gold-500 hover:underline block mt-4 text-sm uppercase tracking-widest">
            Volver al Dashboard
          </a>
        </div>
      </div>
    )
  }

  const selectedStatus = params.status ?? 'all'
  const selectedStage = params.stage ?? 'all'
  const search = (params.q ?? '').trim().toLowerCase()

  const supabaseAdmin = createAdminClient()

  const query = supabaseAdmin
    .from('crm_leads')
    .select(
      'id, full_name, email, phone_number, profile_id, stage1_entered_at, stage2_entered_at, stage3_entered_at, stage4_entered_at, auto_score, status, source, qualification_completed_at, review_notes, created_at, crm_lead_answers(question_key, answer_text, answer_number, answer_choice)',
    )
    .order('created_at', { ascending: false })
    .limit(300)

  if (selectedStatus !== 'all') {
    query.eq('status', selectedStatus)
  }

  const { data } = await query

  const leadsRaw = (data ?? []) as LeadRow[]

  const leads = leadsRaw.filter((lead) => {
    const stage = resolveLeadStage(lead)
    const stageMatch = selectedStage === 'all' || stage.value === selectedStage

    if (!stageMatch) return false

    if (!search) return true

    const name = lead.full_name?.toLowerCase() ?? ''
    const email = lead.email?.toLowerCase() ?? ''
    const phone = lead.phone_number?.toLowerCase() ?? ''

    return (
      name.includes(search) ||
      email.includes(search) ||
      phone.includes(search)
    )
  })

  return (
    <>
      <DashboardPageHeader title="Gestion de Leads" />

      <div className="min-h-screen px-4 py-6 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12">
        <header className="border-b border-white/10 pb-6 md:pb-8">
          <div className="flex items-center gap-2 mb-2 text-gold-500 uppercase tracking-[0.2em] text-[10px] md:text-xs">
            <Users className="w-4 h-4" />
            CRM Basico
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">Pipeline de interesados</h1>
          <p className="text-zinc-400 max-w-3xl text-sm md:text-lg font-light">
            Revisa score automatico, actualiza estado comercial y prioriza seguimiento por etapa CRM.
          </p>
        </header>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#d3cbba] uppercase tracking-[0.18em] text-xs md:text-sm">
            <Filter className="w-4 h-4 text-gold-500" />
            Filtros
          </div>

          <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              name="q"
              defaultValue={params.q ?? ''}
              placeholder="Buscar por nombre, email o telefono"
              className="h-10 rounded-sm border border-white/15 bg-black px-3 text-sm text-zinc-100 md:col-span-2"
            />

            <select
              name="status"
              defaultValue={selectedStatus}
              className="h-10 rounded-sm border border-white/15 bg-black px-3 text-sm text-zinc-100"
            >
              <option value="all">Todos los estados</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="stage"
              defaultValue={selectedStage}
              className="h-10 rounded-sm border border-white/15 bg-black px-3 text-sm text-zinc-100"
            >
              <option value="all">Todas las etapas</option>
              {STAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="md:col-span-4 h-10 px-4 rounded-sm bg-gold-500 text-black font-bold uppercase tracking-[0.12em] text-xs hover:bg-gold-300 transition-colors"
            >
              Aplicar filtros
            </button>
          </form>
        </section>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6 space-y-4 overflow-x-auto">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">
            {leads.length} lead(s) encontrado(s)
          </div>

          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-[0.12em] text-xs">
                <th className="py-3 pr-3">Lead</th>
                <th className="py-3 pr-3">Etapa CRM</th>
                <th className="py-3 pr-3">Entrada etapa</th>
                <th className="py-3 pr-3">Score auto</th>
                <th className="py-3 pr-3">Estado</th>
                <th className="py-3 pr-3">Notas</th>
                <th className="py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No hay leads para esos filtros.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const stage = resolveLeadStage(lead)
                  const stageEnteredAt = resolveCurrentStageEnteredAt(lead, stage)
                  const answers = [...(lead.crm_lead_answers ?? [])].sort((a, b) => {
                    const aIndex = QUESTION_ORDER.indexOf(a.question_key)
                    const bIndex = QUESTION_ORDER.indexOf(b.question_key)
                    return aIndex - bIndex
                  })

                  return (
                    <tr key={lead.id} className="border-b border-white/5 align-top">
                      <td className="py-3 pr-3">
                        <p className="text-zinc-200 font-medium">{lead.full_name ?? 'Sin nombre'}</p>
                        <p className="text-zinc-400 text-xs">{lead.email ?? 'Sin correo'}</p>
                        <p className="text-zinc-500 text-xs">{lead.phone_number ?? 'Sin telefono'}</p>
                        <p className="text-zinc-600 text-[10px] mt-1">{formatDate(lead.created_at)}</p>

                        <details className="mt-2 rounded-sm border border-white/10 bg-black/40 p-2">
                          <summary className="cursor-pointer text-[11px] uppercase tracking-[0.12em] text-gold-300">
                            Ver respuestas ({answers.length})
                          </summary>
                          <div className="mt-2 space-y-1">
                            {answers.length === 0 ? (
                              <p className="text-[11px] text-zinc-500">Sin respuestas registradas.</p>
                            ) : (
                              answers.map((answer) => (
                                <div key={answer.question_key} className="text-[11px] leading-relaxed">
                                  <p className="text-zinc-400">
                                    {QUESTION_LABELS[answer.question_key] ?? answer.question_key}
                                  </p>
                                  <p className="text-zinc-200">{formatAnswerValue(answer)}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </details>
                      </td>

                      <td className="py-3 pr-3">
                        <div className="inline-flex flex-col items-start gap-1 rounded-sm border border-[#d4af37]/25 bg-[#1c3123]/35 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#d4af37]">{stage.label}</p>
                          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-[0.08em]">{stage.title}</p>
                        </div>
                      </td>

                      <td className="py-3 pr-3 text-zinc-400 text-xs">{stageEnteredAt ? formatDate(stageEnteredAt) : '-'}</td>

                      <td className="py-3 pr-3 text-zinc-100 font-bold">{lead.auto_score}</td>

                      <td className="py-3 pr-3 uppercase text-zinc-300 text-xs tracking-[0.08em]">{lead.status}</td>

                      <td className="py-3 pr-3 text-zinc-400 text-xs max-w-[260px]">
                        {lead.review_notes || 'Sin notas'}
                      </td>

                      <td className="py-3">
                        <form
                          id={`lead-review-${lead.id}`}
                          action={updateLeadReviewAction}
                          className="space-y-2 min-w-[300px]"
                        >
                          <input type="hidden" name="leadId" value={lead.id} />

                          <select
                            name="status"
                            defaultValue={lead.status}
                            className="h-9 w-full rounded-sm border border-white/15 bg-black px-2 text-xs uppercase tracking-[0.08em] text-zinc-100"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            name="reviewNotes"
                            defaultValue={lead.review_notes ?? ''}
                            placeholder="Nota breve de seguimiento"
                            className="h-9 w-full rounded-sm border border-white/15 bg-black px-2 text-xs text-zinc-100"
                          />
                        </form>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="submit"
                            form={`lead-review-${lead.id}`}
                            className="h-9 px-3 rounded-sm bg-[#1f3b2f] text-zinc-100 border border-[#2d5b45] text-xs uppercase tracking-[0.12em] hover:bg-[#28513d]"
                          >
                            Guardar revision
                          </button>

                          <form action={deleteLeadAction}>
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button
                              type="submit"
                              className="h-9 px-3 rounded-sm bg-[#3a1f1f] text-zinc-100 border border-[#5b2d2d] text-xs uppercase tracking-[0.12em] hover:bg-[#512828]"
                            >
                              Borrar lead
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </section>
      </div>

      <DashboardFooter tagline="Xclusive Barber Academy" />
    </>
  )
}
