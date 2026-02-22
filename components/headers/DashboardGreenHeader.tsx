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
    <header className="relative z-50 w-full h-[61px]">
      {/* Fondo verde: empieza a 10px del top para que el logo sobresalga */}
      <div className="absolute inset-x-0 bottom-0 h-[51px] bg-[#1c3122] backdrop-blur-[2px] shadow-md" />

      {/* Contenedor principal: items-end + pb alinea todo en la franja verde */}
      <div className="relative mx-auto flex h-full w-full max-w-[1500px] items-end justify-between pb-[10px] px-6">

        {/* ---- LOGO: sobresale desde top=0, h=67px ---- */}
        <Link href="/dashboard" className="relative flex-shrink-0" style={{ width: 55, height: 67, marginBottom: -18 }}>
          <Image
            src="/assets/header_dash/logo-academia.png"
            alt="Xclusive Barber Academy"
            fill
            priority
            className="object-contain object-top"
            sizes="55px"
          />
        </Link>

        {/* ---- DASHBOARD pill (solo en páginas internas) ---- */}
        {showDashboardLink && (
          <Link
            href="/dashboard"
            className="flex-shrink-0 flex items-center justify-center rounded-[7px] bg-[rgba(217,217,217,0.4)] hover:bg-[rgba(217,217,217,0.6)] transition-colors mb-[10px]"
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
