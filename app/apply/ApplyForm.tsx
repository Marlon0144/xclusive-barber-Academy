'use client'

import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { applyAccess } from './actions'
import { AuthInput } from '@/components/ui/auth-input'
import { AuthButton } from '@/components/ui/auth-button'
import { AlertCircle } from 'lucide-react'
import { useLanguage } from '@/components/i18n/LanguageProvider'

// Initial state matching the server action's return type
const initialState = {
  error: null as string | null,
  success: false
}

function SubmitButton() {
  const { pending } = useFormStatus()
  const { dictionary } = useLanguage()
  const text = dictionary.applyForm

  return (
    <AuthButton 
      type="submit" 
      disabled={pending}
      className="w-full bg-[#d3cbba] text-[#1e3a27] hover:bg-[#c2b9a5] hover:text-[#0f1f14] font-bold tracking-widest text-[14px] py-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-none mt-2"
      isLoading={pending}
    >
      {pending ? text.pending : text.submit}
    </AuthButton>
  )
}

export default function ApplyForm() {
  const [state, formAction] = useActionState(applyAccess, initialState)
  const { dictionary } = useLanguage()
  const text = dictionary.applyForm

  return (
    <div className="w-full">
        {/* Error Message */}
        {state?.error && (
          <div className="bg-red-950/20 border-l-2 border-red-500/50 p-4 mb-6 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200/80 text-xs leading-relaxed tracking-wide font-light">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <AuthInput
                name="fullName"
                type="text"
                placeholder={text.fullNamePlaceholder}
                required
                autoComplete="name"
                className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/50 placeholder:font-light tracking-wide"
              />
            </div>

            <div className="space-y-1">
              <AuthInput
                name="email"
                type="email"
                placeholder={text.emailPlaceholder}
                required
                autoComplete="email"
                className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/50 placeholder:font-light tracking-wide"
              />
            </div>

            <div className="space-y-1">
              <AuthInput
                name="inviteCode"
                type="text"
                placeholder={text.inviteCodePlaceholder}
                required
                className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/50 placeholder:font-light tracking-wide"
              />
            </div>

            <div className="space-y-1">
              <AuthInput
                name="password"
                type="password"
                placeholder={text.passwordPlaceholder}
                required
                autoComplete="new-password"
                className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/50 placeholder:font-light tracking-wide"
              />
            </div>
          </div>
          
          <SubmitButton />
        </form>
    </div>
  )
}
