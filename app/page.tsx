import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // 1. Inicializamos el cliente
  const supabase = await createClient();

  // 2. Hacemos una consulta simple: Traer todas las invitaciones
  const { data: users } = await supabase.from("profiles").select();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-amber-500 mb-4">
          Xclusive Barber Academy
        </h1>
        <p className="text-slate-300 text-xl mb-8">
          Panel de Administración & LMS
        </p>

        {/* CARTA DE PRUEBA DE CONEXIÓN */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-emerald-400 font-bold mb-2">
            📡 Estado de Base de Datos: CONECTADO
          </h2>
          <p className="text-slate-400 mb-4">
            Si ves datos abajo, la conexión Supabase funciona:
          </p>
          
          <pre className="bg-black text-xs text-left text-green-500 p-4 rounded overflow-auto font-mono">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}