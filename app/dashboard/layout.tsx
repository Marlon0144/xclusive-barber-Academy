import type { Metadata } from 'next'
import { ApplicationSuccessTracker } from '@/components/analytics/ApplicationSuccessTracker'

// Entire /dashboard subtree is authenticated (enforced by middleware) and
// has no SEO value. Noindex as defense-in-depth in case a crawler ever
// reaches a URL before the auth redirect.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ApplicationSuccessTracker />
      {children}
    </>
  )
}
