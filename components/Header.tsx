import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signout } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Icono de Tijeras (SVG simple por ahora) */}
          <div className="text-gold-500 w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gold-500 tracking-widest leading-none font-serif">XCLUSIVE</span>
            <span className="text-[10px] text-white tracking-[0.3em] leading-none uppercase">Barber Academy</span>
          </div>
        </Link>

        {/* HUD DE USUARIO */}
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <div className="flex items-center gap-4 bg-surface border border-white/10 py-1 pl-4 pr-1 rounded-full">
              <Link
                href="/dashboard"
                className="text-gold-500 hover:text-gold-400 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Dashboard
              </Link>

              <div className="h-4 w-px bg-white/10"></div>

              <span className="text-xs text-zinc-400 truncate max-w-[100px]">
                {user.email}
              </span>

              <form action={signout}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                  Salir
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10">
                  Entrar
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="font-bold tracking-wide">
                  INSCRIBIRSE
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}