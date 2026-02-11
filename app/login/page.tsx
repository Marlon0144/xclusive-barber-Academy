import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Star } from "lucide-react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.error

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0A1F0A]/95 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
          alt="Barber Background"
          className="w-full h-full object-cover grayscale opacity-20"
        />
      </div>

      <div className="relative z-20 w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="text-gold-500 border border-gold-500 p-3 rounded-full bg-black/50 backdrop-blur-md">
              <Star className="w-8 h-8 fill-current" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-gold-500 tracking-widest uppercase">
            Xclusive<br />Barber<br />Academy
          </h1>
          <div className="pt-4">
            <h2 className="text-3xl font-bold text-white font-serif">INICIAR SESIÓN</h2>
            <h3 className="text-xl text-gold-500 font-serif">PLATAFORMA ACADÉMICA</h3>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-sm text-red-200 text-xs text-center uppercase tracking-wide">
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-black/40 backdrop-blur-md p-8 border-t border-b border-white/10 space-y-6">
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-wider ml-1">Contraseña</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="text-center"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                formAction={login}
                className="w-full text-lg py-6 font-bold tracking-widest bg-gold-500 text-black hover:bg-gold-600 border-none shadow-gold"
              >
                ENTRAR
              </Button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-zinc-600">
              ¿No tienes acceso? <Link href="/apply" className="text-gold-500 hover:underline">Solicita tu ingreso aquí</Link>
            </p>
            <Link href="/auth/forgot-password" className="block mt-4 text-[10px] text-zinc-700 hover:text-zinc-500 uppercase tracking-widest">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
          <span>@xclusivebarberau</span>
          <span>Estudiantes</span>
        </div>

      </div>
    </div>
  )
}