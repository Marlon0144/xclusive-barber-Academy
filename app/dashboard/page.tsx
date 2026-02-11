import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
// AGREGADO: Importamos el icono Settings para el admin
import { BookOpen, Target, GraduationCap, ArrowRight, Settings } from 'lucide-react'

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
  const isAdmin = userRole === 'admin' // <--- NUEVA CONSTANTE

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* HEADER DE BIENVENIDA */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hola, <span className="text-blue-500">{user?.email?.split('@')[0]}</span> 👋
        </h1>
        <p className="text-zinc-400">
          Bienvenido a Xclusive Barber Academy. ¿Qué quieres hacer hoy?
        </p>
      </header>

      {/* GRID DE NAVEGACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* OPCIÓN 1: MIS CURSOS (Todos pueden ver esto) */}
        <Link href="/dashboard/courses" className="group">
          <div className="h-full bg-zinc-900 border border-zinc-800 hover:border-blue-600 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-900/20 flex flex-col">
            <div className="bg-blue-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aprender</h3>
            <p className="text-zinc-400 text-sm flex-1">
              Accede a la biblioteca de videos, tutoriales y lecciones teóricas.
            </p>
            <div className="mt-4 flex items-center text-blue-400 text-sm font-bold gap-1">
              Ir al Catálogo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </div>
          </div>
        </Link>

        {/* OPCIÓN 2: MASTERY TRACKER (Todos pueden ver esto) */}
        <Link href="/dashboard/tracker" className="group">
          <div className="h-full bg-zinc-900 border border-zinc-800 hover:border-green-600 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-green-900/20 flex flex-col">
            <div className="bg-green-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Practicar</h3>
            <p className="text-zinc-400 text-sm flex-1">
              Sube fotos de tus cortes, recibe feedback de la IA y mide tu progreso.
            </p>
            <div className="mt-4 flex items-center text-green-400 text-sm font-bold gap-1">
              Subir Práctica <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </div>
          </div>
        </Link>

        {/* OPCIÓN 3: GRADING (SOLO INSTRUCTORES) */}
        {isInstructor && (
          <Link href="/dashboard/grading" className="group">
            <div className="h-full bg-zinc-900 border border-yellow-800/50 hover:border-yellow-500 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-900/20 flex flex-col relative overflow-hidden">
              {/* Etiqueta de Staff */}
              <div className="absolute top-3 right-3 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20">
                STAFF ONLY
              </div>
              
              <div className="bg-yellow-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Evaluar</h3>
              <p className="text-zinc-400 text-sm flex-1">
                Panel de instructores para revisar prácticas pendientes y asignar notas.
              </p>
              <div className="mt-4 flex items-center text-yellow-400 text-sm font-bold gap-1">
                Entrar al Panel <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </Link>
        )}

        {/* --- NUEVA OPCIÓN 4: GESTIÓN DE CURSOS (SOLO ADMIN) --- */}
        {isAdmin && (
          <Link href="/dashboard/admin/courses" className="group">
            <div className="h-full bg-zinc-900 border border-purple-800/50 hover:border-purple-500 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-900/20 flex flex-col relative overflow-hidden">
               <div className="absolute top-3 right-3 bg-purple-500/10 text-purple-500 text-[10px] font-bold px-2 py-1 rounded border border-purple-500/20">
                ADMIN
              </div>
              <div className="bg-purple-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gestionar Cursos</h3>
              <p className="text-zinc-400 text-sm flex-1">
                Crea módulos, lecciones y edita el contenido de la academia.
              </p>
              <div className="mt-4 flex items-center text-purple-400 text-sm font-bold gap-1">
                Ir al Editor <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </Link>
        )}

      </div>
    </div>
  )
}