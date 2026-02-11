import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { BookOpen, Target, GraduationCap, ArrowRight, Settings, Star } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Obtener usuario y rol para renderizado condicional
  const { data: { user } } = await supabase.auth.getUser()

  let userRole = 'student' // Default

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) userRole = profile.role
  }

  // Definimos permisos
  const isInstructor = userRole === 'admin' || userRole === 'instructor'
  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12">

      {/* HEADER DE BIENVENIDA */}
      <header className="relative py-8 border-b border-white/10">
        <div className="absolute top-0 right-0 opacity-20 hidden md:block">
          <Star className="w-24 h-24 text-gold-500" />
        </div>
        <div className="relative z-10">
          <h2 className="text-gold-500 text-sm tracking-[0.2em] uppercase font-bold mb-2">Panel de Control</h2>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600 font-bold">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg">
            Bienvenido a tu espacio en Xclusive Barber Academy. Aquí comienza tu camino hacia la maestría.
          </p>
        </div>
      </header>

      {/* GRID DE NAVEGACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* OPCIÓN 1: MIS CURSOS (Todos) */}
        <Link href="/dashboard/courses" className="group">
          <div className="h-full bg-surface border border-white/5 hover:border-gold-500 p-8 rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col group-hover:-translate-y-1">
            <div className="bg-black/50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-gold-500 border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-black transition-colors">
              <BookOpen size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">Aprender</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
              Catálogo de cursos. Accede a lecciones teóricas, tutoriales en video y material de estudio.
            </p>
            <div className="mt-8 flex items-center text-gold-500 text-xs font-bold uppercase tracking-widest gap-2">
              Ver Cursos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* OPCIÓN 2: MASTERY TRACKER (Todos) */}
        <Link href="/dashboard/tracker" className="group">
          <div className="h-full bg-surface border border-white/5 hover:border-gold-500 p-8 rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col group-hover:-translate-y-1">
            <div className="bg-black/50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-gold-500 border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-black transition-colors">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">Practicar</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">
              Sube tus cortes, recibe feedback potenciado por IA y valida tu progreso técnico.
            </p>
            <div className="mt-8 flex items-center text-gold-500 text-xs font-bold uppercase tracking-widest gap-2">
              Subir Práctica <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* OPCIÓN 3: GRADING (SOLO INSTRUCTORES) */}
        {isInstructor && (
          <Link href="/dashboard/grading" className="group">
            <div className="h-full bg-[#0A1F0A]/40 border border-white/5 hover:border-green-500/50 p-8 rounded-sm transition-all duration-300 flex flex-col relative overflow-hidden group-hover:-translate-y-1">
              {/* Etiqueta de Staff */}
              <div className="absolute top-0 right-0 bg-white/5 text-zinc-400 text-[10px] font-bold px-3 py-1 border-b border-l border-white/10 tracking-widest uppercase">
                Staff Only
              </div>

              <div className="bg-black/50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-zinc-300 border border-white/10 group-hover:bg-green-900 group-hover:text-green-400 transition-colors">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-green-400 transition-colors">Evaluar</h3>
              <p className="text-zinc-500 group-hover:text-zinc-300 text-sm leading-relaxed flex-1 transition-colors">
                Panel de instructor. Revisa los trabajos de los estudiantes y califica su desempeño.
              </p>
              <div className="mt-8 flex items-center text-zinc-500 group-hover:text-green-400 text-xs font-bold uppercase tracking-widest gap-2 transition-colors">
                Panel de Notas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* --- NUEVA OPCIÓN 4: GESTIÓN DE CURSOS (SOLO ADMIN) --- */}
        {isAdmin && (
          <Link href="/dashboard/admin/courses" className="group">
            <div className="h-full bg-[#1A1010]/40 border border-white/5 hover:border-red-500/50 p-8 rounded-sm transition-all duration-300 flex flex-col relative overflow-hidden group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 bg-red-900/20 text-red-500 text-[10px] font-bold px-3 py-1 border-b border-l border-red-500/20 tracking-widest uppercase">
                Admin
              </div>
              <div className="bg-black/50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-zinc-300 border border-white/10 group-hover:bg-red-900 group-hover:text-red-400 transition-colors">
                <Settings size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-red-400 transition-colors">Cursos</h3>
              <p className="text-zinc-500 group-hover:text-zinc-300 text-sm leading-relaxed flex-1 transition-colors">
                Editor de contenido. Gestiona módulos, lecciones y estructura académica.
              </p>
              <div className="mt-8 flex items-center text-zinc-500 group-hover:text-red-400 text-xs font-bold uppercase tracking-widest gap-2 transition-colors">
                Gestionar Contenido <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

      </div>
    </div>
  )
}