'use client'

import { useEffect } from 'react'
import { fbqTrackWhenReady } from '@/lib/analytics/meta'

/**
 * Meta Pixel `ViewContent` for a program page (Barber Starter, Programa
 * Profesional, Mentoría Elite 1 a 1, Barber Business). Renders nothing.
 */
export function ViewContentTracker({ contentName, contentId }: { contentName: string; contentId: string }) {
  useEffect(
    () =>
      fbqTrackWhenReady('ViewContent', {
        content_name: contentName,
        content_ids: [contentId],
        content_type: 'product',
      }),
    [contentName, contentId],
  )

  return null
}
