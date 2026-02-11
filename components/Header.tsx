import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/actions'

export default async function Header() {
  // Verificamos sesión directamente en el componente (Server Component)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* LOGO SIMPLIFICADO */}
        <Link href="/" className="text-xl font-bold text-amber-500 tracking-tighter hover:text-amber-400 transition">
          XCLUSIVE<span className="text-slate-100">BARBER</span>
        </Link>

        {/* HUD DE USUARIO */}
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            // ESTADO: LOGUEADO
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 py-1 px-3 rounded-full">
              
              {/* --- NUEVO: ENLACE AL DASHBOARD --- */}
              <Link 
                href="/dashboard" 
                className="text-amber-500 hover:text-amber-400 font-bold px-2 transition-colors"
              >
                Dashboard
              </Link>

              {/* Separador visual */}
              <div className="h-4 w-px bg-slate-700"></div>

              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400">Conectado como:</span>
                <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
              
              {/* Botón Logout que dispara la Server Action */}
              <form action={signout}>
                <button className="bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 px-3 py-1 rounded transition-colors">
                  Salir
                </button>
              </form>
            </div>
          ) : (
            // ESTADO: ANÓNIMO
            <div className="flex gap-4">
              <Link href="/login" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded transition">
                Entrar
              </Link>
              <Link href="/signup" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded transition">
                Unirse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}