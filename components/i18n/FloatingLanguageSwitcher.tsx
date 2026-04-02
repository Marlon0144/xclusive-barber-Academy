'use client'

import { usePathname } from 'next/navigation'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'

export default function FloatingLanguageSwitcher() {
  const pathname = usePathname()

  const isDashboardRoute = pathname?.startsWith('/dashboard')
  const usesGreenDashboardHeader =
    pathname === '/dashboard' || pathname?.startsWith('/dashboard/progreso_profesional')

  const hidesGlobalHeader =
    pathname === '/apply' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname?.startsWith('/apply/') ||
    Boolean(isDashboardRoute)

  // Fixed positions (no scroll-following), with a slightly larger responsive gap below headers.
  const topOffset = usesGreenDashboardHeader
    ? 'top-[77px] md:top-[94px] lg:top-[102px]'
    : isDashboardRoute || !hidesGlobalHeader
      ? 'top-[77px]'
      : 'top-3 md:top-4'

  return (
    <div className={`absolute ${topOffset} right-2 md:right-3 z-[90]`}>
      <LanguageSwitcher />
    </div>
  )
}
