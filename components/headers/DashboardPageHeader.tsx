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
}

export default function DashboardPageHeader({
  title,
}: DashboardPageHeaderProps) {
  return (
    <header className="relative z-50 w-full h-[61px]">
      {/* Fondo oscuro que ocupa solo los 51px inferiores */}
      <div className="absolute inset-x-0 bottom-0 h-[51px] bg-[#1d1d1d] backdrop-blur-[2px] shadow-md" />

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] justify-between px-4 md:px-8">
        {/* ---- LOGO ---- */}
        <Link href="/dashboard" className="group relative h-full w-[55px]">
          {/* El logo empieza desde arriba (top-0) y mide 67px, sobresaliendo 6px por debajo del fondo */}
          <div className="absolute top-0 left-0 h-[67px] w-[55px] z-10">
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
        {/* Contenedor alineado al fondo, con altura de 51px para centrar sus elementos en la franja oscura */}
        <div className="flex h-[51px] self-end items-center gap-4 md:gap-6 relative z-10">
          {/* Dashboard Pill Button */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center h-[14px] md:h-[20px] rounded-full bg-[#d9d9d9]/40 px-3 md:px-4 transition-all hover:bg-[#d9d9d9]/60"
          >
            <span className="font-sans text-[8px] md:text-[10px] font-light text-[#161616] uppercase tracking-wider">
              DASHBOARD
            </span>
          </Link>

          {/* Page Title with Gold Underline */}
          <div className="flex flex-col items-end justify-center">
            <h1 className="font-sans text-[10px] md:text-xs font-bold tracking-wider text-[#d3cbba] uppercase whitespace-nowrap">
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
