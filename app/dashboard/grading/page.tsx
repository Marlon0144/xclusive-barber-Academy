import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GradingCard from './GradingCard'
import { GraduationCap, Inbox, Star } from 'lucide-react'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'

export default async function GradingPage() {
  const supabase = await createClient()

  // 1. SEGURIDAD: Obtener usuario y rol
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  // Consultamos la tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // REGLA DE ORO: Si no es admin ni profesor, fuera de aquí
  if (profile?.role !== 'admin' && profile?.role !== 'instructor') {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-center bg-black">
        <div className="max-w-md space-y-4">
          <div className="text-red-500 text-6xl">🚫</div>
          <h1 className="text-3xl font-serif text-white">Acceso Restringido</h1>
          <p className="text-zinc-500">Esta zona está reservada exclusivamente para instructores y personal administrativo.</p>
          <a href="/dashboard" className="text-gold-500 hover:underline block mt-4 text-sm uppercase tracking-widest">Volver al Dashboard</a>
        </div>
      </div>
    )
  }

  // 2. OBTENER DATOS: Solo traer las pendientes ('pending')
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true }) // Calificar las más antiguas primero

  return (
    <>
      <DashboardPageHeader title="Evaluación" />
      <div className="min-h-screen p-8 max-w-6xl mx-auto space-y-12">

      {/* HEADER */}
      <header className="relative border-b border-white/10 pb-8">
        <div className="absolute top-0 right-0 opacity-10 hidden md:block">
          <GraduationCap className="w-32 h-32 text-green-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-green-500 fill-green-500" />
            <h2 className="text-green-500 text-xs tracking-[0.3em] uppercase font-bold">Panel de Instructor</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Evaluación de Prácticas
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg font-light">
            Revisa, califica y guía a los estudiantes hacia la perfección técnica.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm text-zinc-500 uppercase tracking-widest">Pendientes:</span>
          <span className="bg-green-900/30 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            {submissions?.length || 0}
          </span>
        </div>
      </header>

      <div className="space-y-8">
        {submissions?.length === 0 ? (
          <div className="py-24 border border-dashed border-white/10 rounded-sm text-center flex flex-col items-center bg-surface/30">
            <div className="bg-black/50 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-green-600 border border-white/5">
              <Inbox size={32} />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">¡Todo al día!</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              No hay tareas pendientes de revisión en este momento. Buen trabajo, instructor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {submissions?.map((sub) => (
              <GradingCard key={sub.id} submission={sub} />
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}