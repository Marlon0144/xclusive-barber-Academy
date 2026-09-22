import type { Metadata } from 'next'

// Legacy registration flow, superseded by /apply. Kept live for now but
// noindexed so it doesn't compete with /apply in search results.
export const metadata: Metadata = {
  title: 'Sign Up',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
