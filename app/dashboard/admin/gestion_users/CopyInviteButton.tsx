'use client'

import { useState } from 'react'

type CopyInviteButtonProps = {
  code: string
}

export default function CopyInviteButton({ code }: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1300)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="h-8 px-3 rounded-sm border border-blue-700/60 text-xs uppercase tracking-[0.12em] text-blue-200 hover:bg-blue-950/40"
      aria-label={`Copiar invitacion ${code}`}
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}
