import { redirect } from 'next/navigation'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { createClient } from '@/utils/supabase/server'
import QualifyForm from './QualifyForm'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function QualifyPage() {
  const supabase = await createClient()
  const dictionary = await getServerDictionary()
  const text = dictionary.dashboardQualifyPage

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: lead }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('crm_leads')
      .select('qualification_completed_at')
      .eq('profile_id', user.id)
      .maybeSingle(),
  ])

  if (profile?.role !== 'student') {
    redirect('/dashboard')
  }

  if (lead?.qualification_completed_at) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <DashboardPageHeader title={text.headerTitle} />

      <main className="px-4 py-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <header className="border-b border-white/10 pb-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-500 mb-2">
            {text.stepLabel}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">{text.title}</h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
            {text.subtitle}
          </p>
        </header>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6">
          <QualifyForm />
        </section>
      </main>

      <DashboardFooter tagline={text.footerTagline} />
    </div>
  )
}
