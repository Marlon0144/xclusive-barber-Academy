'use client' // <--- IMPORTANTE: Esto ahora corre en el navegador

import { useActionState } from 'react'
import { signup } from './actions'

export default function SignupPage() {
  // state: contiene el objeto { error: ... } que devuelve la acción
  // formAction: la función que conectamos al formulario
  // isPending: booleano true mientras se está enviando (útil para loading)
  const [state, formAction, isPending] = useActionState(signup, { error: null, success: false })

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-500">Únete a la Academia</h1>
          <p className="text-slate-400 mt-2">Solo para barberos comprometidos.</p>
        </div>

        {/* ALERTA DE ERROR: Si state.error existe, lo mostramos en rojo */}
        {state?.error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
            <input 
              name="fullName" 
              type="text" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Ej: Julián Barber"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required
              minLength={6}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-500 mb-1">Código de Acceso</label>
            <input 
              name="inviteCode" 
              type="text" 
              required
              className="w-full bg-amber-900/20 border border-amber-500/50 rounded p-2 text-amber-100 placeholder-amber-500/30 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="INGRESA TU CÓDIGO AQUÍ"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-3 rounded transition-colors mt-6"
          >
            {isPending ? 'Procesando...' : 'Aplicar Ahora'}
          </button>
        </form>

      </div>
    </div>
  )
}