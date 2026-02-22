'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Paths where the global (landing) header should be hidden.
  // Auth pages and ALL dashboard routes (dashboard uses its own headers).
  const hiddenPaths = ['/apply', '/login', '/signup']

  const isHidden =
    hiddenPaths.includes(pathname) ||
    pathname?.startsWith('/apply/') ||
    pathname?.startsWith('/dashboard')

  if (isHidden) {
    return null
  }

  return <>{children}</>
}
