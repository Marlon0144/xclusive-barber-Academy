import Link from 'next/link'
import { cookies } from 'next/headers'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { createAdminClient } from '@/utils/supabase/server'
import QualifyForm from './QualifyForm'

export default async function PublicQualifyPage() {
  const cookieStore = await cookies()
  const trackedPhone = cookieStore.get('tracked_lead_phone')?.value ?? null

  if (trackedPhone) {
    const supabaseAdmin = createAdminClient()
    const now = new Date().toISOString()

    const { data: leadByPhone } = await supabaseAdmin
      .from('crm_leads')
      .select('id, stage2_entered_at, qualification_completed_at')
      .eq('phone_number', trackedPhone)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    // Etapa 2: clic en CTA (entra a /qualify) pero aun no completa formulario.
    if (leadByPhone?.id && !leadByPhone.qualification_completed_at) {
      await supabaseAdmin
        .from('crm_leads')
        .update({
          source: 'apply_page_visit',
          stage2_entered_at: leadByPhone.stage2_entered_at ?? now,
          updated_at: now,
        })
        .eq('id', leadByPhone.id)
    }
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">

      <main className="px-4 py-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <header className="border-b border-white/10 pb-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-500 mb-2">Paso 1 de 2</p>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">Queremos conocer tu nivel de compromiso</h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
            Completa este wizard para que el equipo comercial te contacte y te guie con la compra del acceso.
          </p>
          <p className="text-zinc-500 text-xs md:text-sm mt-2">
            Si aun no dejaste tu telefono, vuelve al landing y registralo primero para continuar.
          </p>
          <Link href="/" className="inline-block mt-3 text-gold-500 text-xs uppercase tracking-[0.12em] hover:underline">
            Volver al landing
          </Link>
        </header>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6">
          <QualifyForm />
        </section>
      </main>

      <DashboardFooter tagline="Xclusive Barber Academy" />
    </div>
  )
}
