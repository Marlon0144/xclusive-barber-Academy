'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before the animation starts once visible */
  delay?: number
  /** Extra classes applied to the wrapper */
  as?: keyof HTMLElementTagNameMap
}

/**
 * Wraps children with IntersectionObserver-based scroll reveal.
 * Only activates on md+ screens (CSS handles the gating).
 * Adds .scroll-reveal + .is-visible classes.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only observe on md+ screens (768px)
    const mq = window.matchMedia('(min-width: 768px)')
    if (!mq.matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('scroll-reveal', className)}
      style={delay > 0 ? { '--reveal-delay': `${delay}s` } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  )
}
