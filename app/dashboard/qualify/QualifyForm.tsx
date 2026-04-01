'use client'

import { useActionState } from 'react'
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle } from 'lucide-react'
import { submitLeadQualification, type QualifyState } from './actions'

const initialState: QualifyState = {
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 rounded-sm bg-[#d3cbba] text-[#1e3a27] font-bold uppercase tracking-[0.18em] text-xs hover:bg-[#c2b9a5] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'GUARDANDO...' : 'FINALIZAR CALIFICACION'}
    </button>
  )
}

function FieldLabel({ children }: { children: string }) {
  return <label className="block text-[10px] uppercase tracking-[0.18em] text-zinc-400 mb-2">{children}</label>
}

function BaseInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-sm border border-white/15 bg-black/70 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#d3cbba]/60 focus:outline-none"
    />
  )
}

function BaseSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-sm border border-white/15 bg-black/70 px-3 text-sm text-zinc-100 focus:border-[#d3cbba]/60 focus:outline-none"
    />
  )
}

export default function QualifyForm() {
  const [state, action] = useActionState(submitLeadQualification, initialState)

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="bg-red-950/20 border-l-2 border-red-500/50 p-4 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-200/80 text-xs leading-relaxed tracking-wide">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <BaseInput name="phoneNumber" type="tel" required placeholder="0452 448 309" autoComplete="tel" />
        </div>
        <div>
          <FieldLabel>City/Suburb you currently live in?</FieldLabel>
          <BaseInput name="citySuburb" type="text" required placeholder="Sydney" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Have you ever cut hair before?</FieldLabel>
          <BaseSelect name="hasCutHairBefore" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </BaseSelect>
        </div>
        <div>
          <FieldLabel>Have you considered other barber programs?</FieldLabel>
          <BaseSelect name="consideredOtherPrograms" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </BaseSelect>
        </div>
      </div>

      <div>
        <FieldLabel>What is your main goal after completing the academy?</FieldLabel>
        <BaseInput name="mainGoal" type="text" required placeholder="Ej: trabajar en un barbershop premium" />
      </div>

      <div>
        <FieldLabel>How serious are you about becoming a barber? (1-10)</FieldLabel>
        <BaseInput name="seriousness" type="number" min={1} max={10} required defaultValue={8} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>What income would you like to earn as a barber?</FieldLabel>
          <BaseSelect name="incomeGoal" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="50k_70k">$50k - $70k</option>
            <option value="70k_100k">$70k - $100k</option>
            <option value="100k_plus">$100k+</option>
            <option value="own_shop">Own my own shop</option>
          </BaseSelect>
        </div>

        <div>
          <FieldLabel>Do you follow barbers/pages online?</FieldLabel>
          <BaseSelect name="followsBarberPages" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </BaseSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Are you financially prepared for the investment?</FieldLabel>
          <BaseSelect name="financialPreparedness" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="yes">Yes</option>
            <option value="payment_plan">I need payment plan option</option>
            <option value="not_yet">Not yet</option>
          </BaseSelect>
        </div>

        <div>
          <FieldLabel>When are you looking to start your barber career?</FieldLabel>
          <BaseSelect name="careerStartWindow" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="immediately">Immediately</option>
            <option value="within_3_months">Within 3 months</option>
            <option value="within_6_months">Within 6 months</option>
            <option value="just_researching">Just researching</option>
          </BaseSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Long-term ambition in barber industry</FieldLabel>
          <BaseSelect name="longTermAmbition" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="senior_barber">Become a senior barber</option>
            <option value="open_shop">Open my own shop</option>
            <option value="personal_brand">Build a personal brand</option>
            <option value="educator">Become an educator</option>
            <option value="not_sure">Not sure yet</option>
          </BaseSelect>
        </div>

        <div>
          <FieldLabel>Willing to jump on a short call with our team?</FieldLabel>
          <BaseSelect name="callWillingness" defaultValue="" required>
            <option value="" disabled>Selecciona una opcion</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </BaseSelect>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
