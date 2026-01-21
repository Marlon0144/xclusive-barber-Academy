import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Manejo de error simple via URL params (ej: /login?error=...)
  const params = await searchParams
  const errorMessage = params.error

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
          <p className="text-slate-400 mt-2">Ingresa a tu cuenta.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <button 
            formAction={login}
            className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 rounded transition-colors mt-6"
          >
            Entrar
          </button>
        </form>

      </div>
    </div>
  )
}