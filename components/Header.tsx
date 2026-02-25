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
  const user = await getCurrentUser()

  return (
    /**
     * Two-layer background (Figma source — Node 2098:16):
     *   Layer 1 (outer): rgba(28,49,35,0.38) — semi-transparent dark green.
     *                    On a near-black page background this renders as
     *                    a very dark, almost black-green — giving the header
     *                    a slight darker "frame" at the very top and bottom edges.
     *   Layer 2 (inner): #1c3123 — fully-opaque dark forest green band.
     *                    Inset 9 px from top/bottom so the outer frame shows
     *                    through at the edges, creating the subtle two-tone depth.
     */
    <header className="relative z-50 w-full overflow-hidden">
      {/* ── Layer 1: outer semi-transparent frame ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(28,49,35,0.38)] backdrop-blur-[2px]"
      />
      {/* ── Layer 2: inner solid dark-green band (9 px gap top/bottom) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[9px] h-[51px] bg-[#1c3123]"
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full">
        <div className="mx-auto flex h-[69px] w-full max-w-[1500px] items-center justify-between px-4 md:px-8">

          {/* Brand / Logo */}
          <Link href="/" className="group flex items-center gap-3">
            {/* Mark icon */}
            <div className="relative h-[55px] w-[55px] shrink-0 md:h-[67px] md:w-[67px]">
              <Image
                src="/assets/header/logo-academia.png"
                alt="Xclusive Barber Academy Logo"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 55px, 67px"
              />
            </div>
            {/* Wordmark — "XCLUSIVE / BARBER ACADEMY" decorative text asset */}
            <div className="relative h-[32px] w-[58px] shrink-0 sm:h-[38px] sm:w-[72px] md:h-[50px] md:w-[90px]">
              <Image
                src="/assets/header/texto-decorativo.png"
                alt="Xclusive Barber Academy"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 768px) 72px, 84px"
              />
            </div>
          </Link>

          {/* Navigation */}
          {user ? (
            /* ── Authenticated state ── */
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
                  className="h-auto px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#d3cbba] hover:bg-white/5 hover:text-white md:text-sm"
                >
                  Salir
                </Button>
              </form>
            </div>
          ) : (
            /* ── Unauthenticated state — matches Figma nav order ── */
            /* Figma @ 402px: todos visibles, ~8px. Se escalan hacia arriba en md/lg */
            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* SER MODELO — visible en todos los tamaños (Figma lo muestra a ~400px) */}
              <Link
                href="/models"
                className="text-[0.5rem] font-light uppercase tracking-widest text-[#d3cbba] transition-colors hover:text-white sm:text-[0.6rem] md:text-[0.7rem] lg:text-xs"
              >
                Ser modelo
              </Link>

              {/* ACCEDER — Poppins Light */}
              <Link
                href="/login"
                className="text-[0.5rem] font-light uppercase tracking-widest text-[#d3cbba] transition-colors hover:text-white sm:text-[0.6rem] md:text-[0.7rem] lg:text-xs"
              >
                Acceder
              </Link>

              {/* APLICAR — Poppins Bold + golden divider accent (Figma: Rectangle 29) */}
              <Link
                href="/apply"
                className="group relative flex flex-col items-center gap-0.5"
              >
                <span className="text-[0.55rem] font-extrabold uppercase tracking-widest text-[#d3cbba] transition-colors group-hover:text-white sm:text-[0.65rem] md:text-[0.75rem] lg:text-sm">
                  Aplicar
                </span>
                {/* Golden line divider — asset from public/assets/header/divider.png */}
                <span className="relative block h-[3px] w-full overflow-hidden">
                  <Image
                    src="/assets/header/divider.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="70px"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </nav>
          )}

        </div>
      </div>
    </header>
  )
}