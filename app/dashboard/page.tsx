
import { getUser, getProfile } from '@/utils/cache-helpers'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { AdminToolsMenu } from '@/components/dashboard/AdminToolsMenu'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import DashboardGreenHeader from '@/components/headers/DashboardGreenHeader'

export default async function DashboardPage() {
  const user = await getUser()

  let userRole = 'student'

  if (user) {
    const profile = await getProfile(user.id)
    if (profile) userRole = profile.role
  }

  const isInstructor = userRole === 'admin' || userRole === 'instructor'
  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      
      {/* NAV HEADER - Green variant (sticky) */}
      <DashboardGreenHeader userName={user?.email?.split('@')[0]} userEmail={user?.email} />

      {/* HERO Section — Figma node 136:377 */}
      <DashboardHeader />

      {/* NAVIGATION CARDS — pulled up 45px to overlap the hero, matching Figma */}
      <div className="relative z-10 flex flex-col items-center gap-[19px] w-full px-6 pb-6 -mt-[45px] max-w-[400px] mx-auto">

          {/* 1. PROGRAMA DE FORMACIÓN — tall variant h-[88px] per Figma */}
          <DashboardCard
            title="Programa de Formación"
            description="Accede al contenido académico, módulos prácticos y estructura oficial del programa alineado a los estándares del mercado australiano."
            href="/dashboard/courses"
            tall
          />

          {/* 2. SEGUIMIENTO Y EVALUACIÓN */}
          <DashboardCard
            title="Seguimiento y Evaluación"
            description="Revisa observaciones, evaluaciones y retroalimentación profesional sobre tu desempeño y evolución dentro del programa."
            href="/dashboard/tracker"
          />

          {/* 3. PROGRESO PROFESIONAL */}
          <DashboardCard
            title="Progreso Profesional"
            description="Consulta tu avance, cumplimiento de etapas y desarrollo dentro del proceso formativo."
            href="/dashboard/progreso_profesional"
          />

          {/* 4. LA ACADEMIA — dimmed (opacity-45 in Figma) */}
          <DashboardCard
            title="La Academia"
            description="Conoce nuestra metodología, fundamentos y estándares que rigen la formación profesional."
            disabled={true}
            dimmed
          />

          {/* PRIVILEGED ROLES: collapsible admin/instructor tools */}
          <AdminToolsMenu isInstructor={isInstructor} isAdmin={isAdmin} />

      </div>

      {/* FOOTER */}
      <DashboardFooter />
    </div>
  )
}
