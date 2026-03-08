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
  /** Muestra un pill "← DASHBOARD" en el centro del header para páginas internas */
  showDashboardLink?: boolean
}

export default function DashboardGreenHeader({
  userName,
  userEmail,
  showDashboardLink,
}: DashboardGreenHeaderProps) {
  return (
    <header className="relative z-50 w-full h-[53px] md:h-[64px] lg:h-[72px] mt-4 md:mt-5">
      {/* Fondo verde: cubre todo el header */}
      <div className="absolute inset-0 bg-[#1c3122] backdrop-blur-[2px] shadow-md" />

      {/* Contenedor principal: items-center centra contenido; el logo (67px) sobresale 7px arriba y abajo */}
      <div className="relative mx-auto flex h-full w-full max-w-[1500px] items-center justify-between px-6 md:px-10 lg:px-16">

        {/* ---- LOGO: 67px en barra de 53px → sobresale 7px arriba y 7px abajo ---- */}
        <Link href="/dashboard" className="relative flex-shrink-0" style={{ width: 'clamp(55px, 5.56vw, 80px)', height: 'clamp(67px, 6.74vw, 97px)' }}>
          <Image
            src="/assets/header_dash/logo-academia.png"
            alt="Xclusive Barber Academy"
            fill
            priority
            className="object-contain object-top"
            sizes="(min-width: 768px) 133px, 55px"
          />
        </Link>

        {/* ---- DASHBOARD pill (solo en páginas internas) ---- */}
        {showDashboardLink && (
          <Link
            href="/dashboard"
            className="flex-shrink-0 flex items-center justify-center rounded-[7px] bg-[rgba(217,217,217,0.4)] hover:bg-[rgba(217,217,217,0.6)] transition-colors"
            style={{ width: 74, height: 14 }}
          >
            <span className="font-sans font-light text-[8px] uppercase tracking-wider text-[#1e3a27]">
              DASHBOARD
            </span>
          </Link>
        )}

        {/* ---- RIGHT: UserMenu (bienvenida + avatar + dropdown) ---- */}
        <div className="flex-shrink-0 flex items-center relative z-10">
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>

      </div>
    </header>
  )
}
