import Link from "next/link"
import Image from "next/image"

/**
 * Header oscuro para las páginas internas del dashboard
 * (cursos, lecciones, tracker, etc.).
 *
 * Diseño: fondo negro/oscuro con logo a la izquierda, botón pill
 * "DASHBOARD" centrado-derecha, y título de la página actual con
 * un subrayado dorado.
 *
 * Props:
 * - `title`: Texto del título de la sección (ej: "MÓDULOS", "LECCIONES")
 */

interface DashboardPageHeaderProps {
  title: string
  bgColor?: string
}

export default function DashboardPageHeader({
  title,
  bgColor = '#1d1d1d',
}: DashboardPageHeaderProps) {
  return (
    <header className="relative z-50 w-full h-[53px] mt-4">
      {/* Fondo que cubre todo el header */}
      <div className="absolute inset-0 backdrop-blur-[2px] shadow-md" style={{ backgroundColor: bgColor }} />

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] justify-between px-4 md:px-8">
        {/* ---- LOGO ---- */}
        <Link href="/dashboard" className="group relative h-full w-[55px]">
          {/* Logo 67px en barra de 53px → centrado, sobresale 7px arriba y 7px abajo simétricamente */}
          <div className="absolute top-[-7px] left-0 h-[67px] w-[55px] z-10">
            <Image
              src="/assets/header_pages/logo-academia.png"
              alt="Xclusive Barber Academy"
              fill
              priority
              className="object-contain object-top"
              sizes="55px"
            />
          </div>
        </Link>

        {/* ---- RIGHT SIDE: Dashboard pill + Page Title ---- */}
        <div className="flex h-full items-center gap-4 md:gap-6 relative z-10">
          {/* Dashboard Pill Button */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center h-[22px] md:h-[26px] rounded-full bg-[#d9d9d9]/40 px-3 md:px-4 transition-all hover:bg-[#d9d9d9]/60"
          >
            <span className="font-sans text-[10px] md:text-[12px] font-light text-[#161616] uppercase tracking-wider">
              DASHBOARD
            </span>
          </Link>

          {/* Page Title with Gold Underline */}
          <div className="flex flex-col items-end justify-center">
            <h1 className="font-sans text-[13px] md:text-[15px] font-bold tracking-wider text-[#d3cbba] uppercase whitespace-nowrap">
              {title}
            </h1>
            {/* Divider: explicit size preserves natural aspect ratio (183×9) */}
            <div className="mt-1 w-[77px] md:w-[100px]">
              <Image
                src="/assets/header_pages/divider.png"
                alt="Línea divisora"
                width={183}
                height={9}
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
