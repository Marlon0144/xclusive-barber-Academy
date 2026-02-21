import Link from "next/link"
import Image from "next/image"
import UserMenu from "@/components/headers/UserMenu"

/**
 * Header verde para la vista principal del Dashboard (/dashboard).
 *
 * Diseño: fondo verde oscuro (#1c3122) con logo a la izquierda que sobresale,
 * saludo "BIENVENIDO, NOMBRE" con línea divisora dorada y silueta de perfil
 * a la derecha.
 *
 * Es un Server Component porque necesita acceso al signout action.
 */

interface DashboardGreenHeaderProps {
  userName?: string
  userEmail?: string
}

export default function DashboardGreenHeader({
  userName,
  userEmail,
}: DashboardGreenHeaderProps) {
  return (
    <header className="relative z-50 w-full h-[61px]">
      {/* Fondo verde que ocupa solo los 51px inferiores */}
      <div className="absolute inset-x-0 bottom-0 h-[51px] bg-[#1c3122] backdrop-blur-[2px] shadow-md" />

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] justify-between px-4 md:px-8">
        {/* ---- LOGO ---- */}
        <Link href="/dashboard" className="group relative h-full w-[55px]">
          {/* El logo empieza desde arriba (top-0) y mide 67px, sobresaliendo 6px por debajo del fondo */}
          <div className="absolute top-0 left-0 h-[67px] w-[55px] z-10">
            <Image
              src="/assets/header_dash/logo-academia.png"
              alt="Xclusive Barber Academy"
              fill
              priority
              className="object-contain object-top"
              sizes="55px"
            />
          </div>
        </Link>

        {/* ---- RIGHT: UserMenu (dropdown con logout) ---- */}
        <div className="flex h-[51px] self-end items-center relative z-10">
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  )
}
