import { BookOpen, Target, TrendingUp, Landmark, GraduationCap, Settings } from 'lucide-react'
import { getUser, getProfile } from '@/utils/cache-helpers'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

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
      
      {/* HEADER Section - Full Width */}
      <DashboardHeader userName={user?.email?.split('@')[0]} />

      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-10">
        
        {/* DASHBOARD GRID */}
        {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. PROGRAMA DE FORMACIÓN */}
          <DashboardCard
            title="Programa de Formación" 
            description="Accede a lecciones teóricas, tutoriales en video y material de estudio exclusivo."
            icon={BookOpen}
            href="/dashboard/courses"
            actionText="Ingresar"
          />

          {/* 2. SEGUIMIENTO Y EVALUACIÓN */}
          <DashboardCard
            title="Seguimiento y Evaluación"
            description="Sube tus cortes, recibe feedback detallado y monitorea tu evolución técnica."
            icon={Target}
            href="/dashboard/tracker"
            actionText="Ver Progreso"
          />

          {/* 3. PROGRESO PROFESIONAL (Placeholder) */}
          <DashboardCard
            title="Progreso Profesional"
            description="Analíticas de tu carrera, objetivos alcanzados y proyección a futuro."
            icon={TrendingUp}
            disabled={true}
            actionText="Próximamente"
          />

           {/* 4. LA ACADEMIA (Placeholder) */}
           <DashboardCard
            title="La Academia"
            description="Comunidad, eventos y noticias exclusivas del mundo Xclusive Barber."
            icon={Landmark}
            disabled={true}
            actionText="Próximamente"
          />

          {/* INSTRUCTOR ONLY: EVALUAR */}
          {isInstructor && (
            <DashboardCard
                title="Evaluar Estudiantes"
                description="Revisar entregas, calificar cortes y proporcionar retroalimentación técnica."
                icon={GraduationCap}
                href="/dashboard/grading"
                actionText="Panel de Calificación"
                isInstructor={true}
            />
          )}

          {/* ADMIN ONLY: GESTIÓN DE CURSOS */}
          {isAdmin && (
            <DashboardCard
                title="Gestión de Cursos"
                description="Administrar catálogo, editar lecciones y configurar módulos de aprendizaje."
                icon={Settings}
                href="/dashboard/admin/courses"
                actionText="Administrar"
                isAdmin={true}
            />
          )}

        </div>
      </div>
    </div>
  )
}
