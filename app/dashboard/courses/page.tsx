import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { BookOpen, PlayCircle, Layers, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default async function CoursesIndexPage() {
  const supabase = await createClient()

  // 1. Obtenemos los módulos ordenados
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index', { ascending: true }) // Changed to order_index as per schema

  // prepare first lesson map using parallel requests to avoid waterfall/N+1
  const firstLessonMap: Record<string, string | null> = {}
  if (modules && modules.length) {
    const promises = modules.map((m) =>
      supabase
        .from('lessons')
        .select('id')
        .eq('module_id', m.id)
        .order('order_index', { ascending: true })
        .limit(1)
        .single()
    )
    const results = await Promise.all(promises)
    results.forEach((r, idx) => {
      firstLessonMap[modules[idx].id] = r.data?.id ?? null
    })
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-12">

      {/* HEADER */}
      <div className="relative border-b border-white/10 pb-8">
        <div className="absolute top-0 right-0 opacity-10 hidden md:block">
          <Layers className="w-32 h-32 text-gold-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            <h2 className="text-gold-500 text-xs tracking-[0.3em] uppercase font-bold">Plan de Estudios</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Academia <span className="text-gold-500">Xclusive</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg font-light">
            Domina el arte de la barbería moderna. Selecciona un módulo para comenzar tu camino hacia la excelencia.
          </p>
        </div>
      </div>

      {!modules || modules.length === 0 ? (
        <div className="text-center py-24 bg-surface/50 rounded-sm border border-dashed border-white/10">
          <div className="bg-black/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <Layers className="h-8 w-8 text-zinc-600" />
          </div>
          <h3 className="mt-2 text-xl font-serif text-white">No hay módulos disponibles</h3>
          <p className="mt-2 text-zinc-500">El contenido educativo se está preparando.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="group bg-surface border border-white/5 hover:border-gold-500/50 rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] overflow-hidden flex flex-col relative"
            >
              {/* Número de Módulo de Fondo */}
              <div className="absolute -right-4 -top-6 text-[150px] font-serif font-black text-white/[0.02] pointer-events-none group-hover:text-gold-500/[0.05] transition-colors">
                {index + 1}
              </div>

              {/* Header decorativo de la tarjeta */}
              <div className="h-48 bg-[#050505] flex items-center justify-center relative overflow-hidden group-hover:bg-[#0A0A0A] transition-colors">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                <div className="relative z-10 p-6 border border-gold-500/20 rounded-full bg-black/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 group-hover:border-gold-500/50">
                  <BookOpen size={32} className="text-gold-500" />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gold-500 uppercase border border-gold-500/20 px-2 py-1 rounded-sm">
                    Módulo 0{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-gold-500 transition-colors">
                  {module.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1 font-light group-hover:text-zinc-400 transition-colors">
                  {module.description || "Aprende las técnicas avanzadas y fundamentos esenciales en este módulo completo de barbería."}
                </p>

                {/* build the button based on pre‑fetched first lesson */}
                {firstLessonMap[module.id] ? (
                  <Link href={`/dashboard/courses/${module.id}/${firstLessonMap[module.id]}`} className="w-full">
                    <Button className="w-full font-bold tracking-widest group-hover:bg-gold-500 group-hover:text-black transition-all">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      ENTRAR AL MÓDULO
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full opacity-50 cursor-not-allowed border-zinc-800 text-zinc-500 hover:bg-transparent hover:text-zinc-500"
                    disabled
                  >
                    Próximamente
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

