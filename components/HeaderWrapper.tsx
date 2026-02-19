'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // List of paths where the header should be hidden
  const hiddenPaths = ['/apply', '/login', '/signup']
  
  if (hiddenPaths.includes(pathname) || pathname?.startsWith('/apply/')) {
    return null
  }

  return <>{children}</>
}
