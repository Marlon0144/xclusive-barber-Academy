"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { signout } from "@/app/auth/actions"

/**
 * UserMenu — dropdown interactivo para el DashboardGreenHeader.
 *
 * Se activa al hacer clic en el avatar + nombre de usuario.
 * Muestra: email, acceso rápido a "Progreso profesional" y botón "CERRAR SESIÓN".
 *
 * Es un Client Component porque maneja estado de apertura/cierre del menú.
 */

interface UserMenuProps {
  userName?: string
  userEmail?: string
}

export default function UserMenu({ userName, userEmail }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* ---- TRIGGER: Welcome text + divider + avatar ---- */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 md:gap-4 cursor-pointer group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex flex-col items-end justify-center">
          <span
            className="font-sans font-bold tracking-wider text-[#d3cbba] uppercase whitespace-nowrap group-hover:text-white transition-colors text-[10px] md:text-[13px] lg:text-[15px]"
          >
            Bienvenido, {userName || "Estudiante"}
          </span>
          <div className="mt-1 w-[130px] md:w-[160px] lg:w-[200px] xl:w-[240px]">
            <Image
              src="/assets/divider.svg"
              alt=""
              width={183}
              height={9}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="relative h-[34px] w-[31px] md:h-[38px] md:w-[34px] lg:h-[44px] lg:w-[40px] flex-shrink-0">
          <Image
            src="/assets/header_dash/avatar-perfil.png"
            alt="Perfil"
            fill
            className="object-contain"
            sizes="40px"
          />
        </div>
      </button>

      {/* ---- DROPDOWN MENU ---- */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[220px] overflow-hidden rounded-sm border border-white/10 bg-[#2a2a2a] shadow-2xl">
          {/* Email row */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            {/* User icon box */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-[#3a3a3a]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#d3cbba]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <span className="truncate font-sans text-[11px] text-[#d3cbba]">
              {userEmail || "usuario@email.com"}
            </span>
          </div>

          {/* Progreso profesional link */}
          <Link
            href="/dashboard/tracker"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 font-sans text-[11px] text-[#d3cbba]/70 transition-colors hover:bg-white/5 hover:text-[#d3cbba]"
          >
            Progreso profesional
          </Link>

          {/* Sign out */}
          <form action={signout}>
            <button
              type="submit"
              className="w-full border-t border-white/10 bg-[#d3cbba]/10 px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-widest text-[#d3cbba] transition-colors hover:bg-[#d3cbba]/20"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
