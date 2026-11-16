
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/utils/cache-helpers'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { AdminToolsMenu } from '@/components/dashboard/AdminToolsMenu'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import DashboardGreenHeader from '@/components/headers/DashboardGreenHeader'
import { createClient } from '@/utils/supabase/server'
import { getServerDictionary } from '@/lib/i18n/server'

export default async function DashboardPage() {
  const user = await getUser()

  // REQ-FUNC-001: la carcasa del hub se renderiza desde el diccionario.
  const dict = await getServerDictionary()
  const hub = dict.dashboard.hub

  let userRole = 'student'

  if (user) {
    const profile = await getProfile(user.id)
    if (profile) userRole = profile.role
  }

  const isInstructor = userRole === 'admin' || userRole === 'instructor'
  const isAdmin = userRole === 'admin'

  if (user && userRole === 'student') {
    const supabase = await createClient()
    const { data: lead } = await supabase
      .from('crm_leads')
      .select('id, qualification_completed_at')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (lead && !lead.qualification_completed_at) {
      redirect('/dashboard/qualify')
    }
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      
      {/* NAV HEADER - Green variant (sticky) */}
      <DashboardGreenHeader userName={user?.email?.split('@')[0]} userEmail={user?.email} />

      {/* HERO Section — Figma node 136:377 */}
      <DashboardHeader />

      {/* NAVIGATION CARDS — responsive grid: 1 col mobile, 2 cols tablet+ */}
      <div
        className="relative z-10 w-full px-6 pb-6 mx-auto
                   max-w-[400px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[960px]
                   -mt-[90px] md:-mt-[45px] lg:-mt-[55px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[19px] md:gap-5 lg:gap-6">

          {/* 1. PROGRAMA DE FORMACIÓN — full width, tall variant */}
          <div className="md:col-span-2">
            <DashboardCard
              title={hub.trainingProgram.title}
              description={hub.trainingProgram.description}
              href="/dashboard/courses"
              tall
            />
          </div>

          {/* 2. SEGUIMIENTO Y EVALUACIÓN — half width on tablet+ */}
          <DashboardCard
            title={hub.tracking.title}
            description={hub.tracking.description}
            href="/dashboard/tracker"
          />

          {/* 3. PROGRESO PROFESIONAL — half width on tablet+ */}
          <DashboardCard
            title={hub.progress.title}
            description={hub.progress.description}
            href="/dashboard/progreso_profesional"
          />

          {/* 4. LA ACADEMIA — full width, dimmed (opacity-45 in Figma) */}
          <div className="md:col-span-2">
            <DashboardCard
              title={hub.academy.title}
              description={hub.academy.description}
              disabled={true}
              dimmed
            />
          </div>

          {/* PRIVILEGED ROLES: collapsible admin/instructor tools — full width */}
          <div className="md:col-span-2">
            <AdminToolsMenu isInstructor={isInstructor} isAdmin={isAdmin} />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <DashboardFooter />
    </div>
  )
}
