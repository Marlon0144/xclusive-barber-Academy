import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"
import { signout } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import React from "react"

// cache the current user so multiple components can read it without
// re-running the request during the same render/flight.
const getCurrentUser = React.cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export default async function Header() {
  // by starting both operations early we satisfy async-defer-await
  const userPromise = getCurrentUser()

  const user = await userPromise

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[image:var(--image-header-gradient)] shadow-2xl">
      <div className="w-full">
        <div className="mx-auto flex h-20 w-full max-w-[1500px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative h-16 w-16 md:h-20 md:w-20">
              <Image
                src="/assets/header/logo-academia.png"
                alt="Xclusive Barber Academy Logo"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-serif text-lg font-bold tracking-wider text-gold-500 md:text-2xl">
                XCLUSIVE
              </span>
              <span className="font-sans text-[0.6rem] font-medium tracking-[0.2em] text-foreground-strong md:text-[0.7rem]">
                BARBER ACADEMY
              </span>
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/dashboard"
                className="rounded-md border border-gold-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold-500 transition-colors hover:bg-gold-500/10 md:text-sm"
              >
                Dashboard
              </Link>
              <form action={signout}>
                <Button
                  variant="ghost"
                  className="h-auto px-3 py-2 text-xs font-semibold uppercase tracking-wider text-header-foreground hover:bg-white/5 hover:text-white md:text-sm"
                >
                  Salir
                </Button>
              </form>
            </div>
          ) : (
            <nav className="flex items-center gap-4 md:gap-8">
              <Link
                href="/models"
                className="hidden text-xs font-light uppercase tracking-wide text-foreground transition-colors hover:text-white md:inline-block md:text-sm"
              >
                Ser modelo
              </Link>
              <Link
                href="/login"
                className="text-xs font-light uppercase tracking-wide text-foreground transition-colors hover:text-white md:text-sm"
              >
                Acceder
              </Link>
              <Link
                href="/apply"
                className="group relative pb-1 text-base font-bold uppercase tracking-wider text-foreground-strong md:text-lg"
              >
                Aplicar
                <span className="absolute -bottom-1 left-0 h-[2px] w-full scale-x-100 bg-gold-500 transition-transform duration-300 md:h-[3px]" />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}