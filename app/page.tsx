import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Star, Users, Briefcase } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  return (
    <div className="flex flex-col min-h-screen text-foreground">

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
            alt="Barber Background"
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#050505]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-gold-500 border border-gold-500 p-2 rounded-full inline-block">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-gold-500 tracking-[0.2em] text-sm uppercase font-bold mb-2">Xclusive Barber Academy</h2>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white tracking-tight leading-tight">
            FORMACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">PROFESIONAL</span><br />
            EN BARBERÍA
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            PARA LATINOS EN AUSTRALIA. Sistema de aprendizaje práctico y estructurado para construir una carrera real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                Aplicar a la Academia
              </Button>
            </Link>
            <Link href="/models">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                Quiero ser Modelo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. METHODOLOGY SECTION */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 relative inline-block">
            CONOCER METODOLOGÍA
            <div className="h-1 w-20 bg-gold-500 mx-auto mt-4"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <p className="text-zinc-400 leading-relaxed text-lg">
                Entrenamos barberos con disciplina y visión de negocio para el mercado australiano. No somos un curso más, somos una <span className="text-gold-500 font-bold">formación integral</span>.
              </p>
              <div className="space-y-4">
                <div className="bg-surface p-6 border-l-2 border-gold-500">
                  <h3 className="text-white font-bold mb-2">Para quien es:</h3>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gold-500 mt-1" /> Latinos en Australia que buscan aprender un oficio real.</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gold-500 mt-1" /> Migrantes que quieren estabilidad y crecimiento.</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gold-500 mt-1" /> Barberos principiantes que quieren subir su nivel.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-sm overflow-hidden border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b7f30a?q=80&w=2070&auto=format&fit=crop"
                alt="Barber working"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES (Formamos Profesionales) */}
      <section className="py-24 bg-[#0A1F0A] relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 22.485l.828.83-1.415 1.415-.828-.828-.828.828L-1.415 22.485l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 54.627l.828.83-1.415 1.415-.828-.828-.828.828L-1.415 54.627l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM54.627 60l.83-.828-1.415-1.415-.828.828-.828-.828-1.415 1.415.828.828-.828.828 1.415 1.415.828-.828.828.828 1.415-1.415-.828-.828zM22.485 60l.83-.828-1.415-1.415-.828.828-.828-.828-1.415 1.415.828.828-.828.828 1.415 1.415.828-.828.828.828 1.415-1.415-.828-.828z\' fill=\'%23D4AF37\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full border border-gold-500/30 bg-gold-500/10">
              <Users className="w-8 h-8 text-gold-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white">FORMAMOS PROFESIONALES</h2>
            <p className="text-zinc-500 mt-4 tracking-widest text-sm uppercase">No formamos barberos promedio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "FORMACIÓN PRÁCTICA REAL", desc: "Aprende haciendo, con escenarios realistas y estándares del mercado australiano.", icon: "scissors" },
              { title: "MENTALIDAD PROFESIONAL", desc: "Disciplina, puntualidad, trato al cliente y presentación personal como parte del proceso.", icon: "brain" },
              { title: "ENFOQUE EN CARRERA", desc: "No solo técnica, preparación para el mundo laboral y hogando mentalidad emprendedora.", icon: "briefcase" }
            ].map((item, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-sm border border-white/5 p-8 hover:border-gold-500/50 transition-colors group">
                <h3 className="text-gold-500 font-bold text-xl mb-4 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISION & VISION */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif text-gold-500">MISIÓN</h3>
            <p className="text-zinc-300 leading-relaxed">
              Formar barberos con nivel profesional, disciplina y mentalidad de servicio, capaces de insertarse laboralmente en Australia y construir estabilidad económica a través de un aprendizaje real.
            </p>
          </div>
          <div className="space-y-6 text-right">
            <h3 className="text-3xl font-serif text-gold-500">VISIÓN</h3>
            <p className="text-zinc-300 leading-relaxed">
              Construir una de las academias de barbería más sólidas para la comunidad latina en Australia, con proyección a largo plazo, alianzas estratégicas y programas formativos de alto impacto.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INSTRUCTOR */}
      <section className="py-0 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 py-16 space-y-6">
            <h2 className="text-6xl md:text-8xl font-black text-white/10 uppercase tracking-tighter">JULIAN</h2>
            <div className="-mt-8 md:-mt-12 ml-2">
              <p className="text-gold-500 font-serif text-2xl italic mb-6">&quot;Una academia creada desde la experiencia real&quot;</p>
              <div className="bg-surface p-6 max-w-md border-l-4 border-gold-500">
                <p className="text-zinc-400">
                  Xclusive Barber Academy nace desde la experiencia directa de un fundador como migrante, barbero profesional y emprendedor en Australia.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[500px] md:h-[600px] relative">
            <img
              src="https://images.unsplash.com/photo-1635273052243-5b887160d5b4?q=80&w=1974&auto=format&fit=crop"
              alt="Julian Instructor"
              className="w-full h-full object-cover object-top mask-image-b-fade"
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
            />
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-24 bg-surface border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif text-white uppercase">¿Listo para dar el siguiente paso?</h2>
          <p className="text-zinc-400">
            Si estás buscando algo serio, estructurado y con proyección, aquí puedes aplicar a la academia y comenzar el proceso.
          </p>
          <div className="flex justify-center">
            <Link href="/apply">
              <Button className="w-full sm:w-auto px-12 py-6 text-lg shadow-gold">
                APLICAR A LA ACADEMIA
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}