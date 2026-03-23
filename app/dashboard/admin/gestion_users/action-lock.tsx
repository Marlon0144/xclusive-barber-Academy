'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type ActionLockContextValue = {
  isLocked: boolean
  setLocked: (locked: boolean) => void
}

const ActionLockContext = createContext<ActionLockContextValue | null>(null)

export function ActionLockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)

  const value = useMemo(
    () => ({
      isLocked,
      setLocked: setIsLocked,
    }),
    [isLocked],
  )

  return (
    <ActionLockContext.Provider value={value}>
      {children}
      {isLocked ? (
        <div className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-[1px]">
          <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-sm border border-white/15 bg-[#101010] px-4 py-2 text-xs uppercase tracking-[0.14em] text-zinc-200">
            Procesando accion...
          </div>
        </div>
      ) : null}
    </ActionLockContext.Provider>
  )
}

function useActionLock() {
  const context = useContext(ActionLockContext)

  if (!context) {
    throw new Error('useActionLock must be used inside ActionLockProvider')
  }

  return context
}

type LockedActionFormProps = {
  action: (formData: FormData) => void | Promise<void>
  className?: string
  children: React.ReactNode
}

export function LockedActionForm({ action, className, children }: LockedActionFormProps) {
  const { isLocked, setLocked } = useActionLock()

  async function wrappedAction(formData: FormData) {
    try {
      await action(formData)
    } finally {
      setLocked(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isLocked) {
      event.preventDefault()
      return
    }

    setLocked(true)
  }

  return (
    <form action={wrappedAction} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  )
}
