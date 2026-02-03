import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GradingCard from './GradingCard'

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
  if (profile?.role !== 'admin' && profile?.role !== 'professor') {
    return (
      <div className="p-10 text-center text-red-500">
        <h1 className="text-3xl font-bold">403 - Acceso Prohibido</h1>
        <p>Esta zona es solo para instructores autorizados.</p>
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
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Evaluación 👨‍🏫</h1>
        <p className="text-zinc-400">
          Tienes <span className="text-white font-bold">{submissions?.length || 0}</span> prácticas esperando revisión.
        </p>
      </header>

      <div className="space-y-8">
        {submissions?.length === 0 ? (
          <div className="p-12 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500">
            🎉 ¡Todo al día! No hay tareas pendientes.
          </div>
        ) : (
          submissions?.map((sub) => (
            <GradingCard key={sub.id} submission={sub} />
          ))
        )}
      </div>
    </div>
  )
}