
import { getUser, getProfile } from '@/utils/cache-helpers'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { AdminToolsMenu } from '@/components/dashboard/AdminToolsMenu'
import DashboardGreenHeader from '@/components/headers/DashboardGreenHeader'
import Image from 'next/image'

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

      {/* FOOTER — Figma node 136:377 (bottom section) */}
      <footer className="flex flex-col items-center pb-8 pt-4 max-w-[400px] mx-auto px-6">

          {/* Tagline */}
          <p className="font-sans font-medium text-[11px] text-[#d3cbba] text-center tracking-[0.09em] mb-6">
              Plataforma oficial de desarrollo académico.
          </p>

          {/* Logo + Social Row */}
          <div className="relative flex items-center justify-center w-full mb-6">
              {/* Left: Instagram */}
              <div className="absolute left-0 flex items-center gap-2">
                  <div className="w-[26px] h-[26px] opacity-70">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.5" cy="6.5" r="0.5" fill="#d3cbba"/>
                      </svg>
                  </div>
                  <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
                      @xclusivebarberau
                  </p>
              </div>

              {/* Center: Logo */}
              <Image
                  src="/assets/header_dash/logo-academia.png"
                  alt="Xclusive Barber Academy"
                  width={31}
                  height={38}
                  className="object-contain"
              />

              {/* Right: Phone */}
              <div className="absolute right-0 flex items-center gap-1.5">
                  <div className="w-[14px] h-[15px] opacity-70">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#d3cbba" strokeWidth="1.5" className="w-full h-full">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                  </div>
                  <p className="font-sans font-medium text-[9px] text-[#d3cbba] leading-[1.3]">
                      +61 413 891 977
                  </p>
              </div>
          </div>

          {/* Bottom divider — full width, gradient */}
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d3cbba]/60 to-transparent" />

      </footer>
    </div>
  )
}
