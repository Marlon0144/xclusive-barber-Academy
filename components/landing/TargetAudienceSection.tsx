import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function TargetAudienceSection() {
  const items = [
    "Latinos en Australia que buscan aprender un oficio real.",
    "Migrantes que quieren estabilidad y crecimiento.",
    "Barberos principiantes o intermedios que quieren subir su nivel."
  ];

  return (
    <section className="relative py-24 bg-[#161616]">
      {/* Background dark overlay for separation if needed */}
      <div className="absolute inset-0 bg-[#161616] pointer-events-none -z-10" />

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Intro Text Block (From Figma Top Section) */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <h2 className="font-sans font-black text-4xl md:text-6xl text-[#d3cbba] tracking-tight uppercase">
            ¿LISTO PARA DAR EL SIGUIENTE PASO?
          </h2>
          <p className="font-sans text-xl md:text-2xl text-[#d3cbba] font-normal max-w-3xl mx-auto leading-relaxed">
            Sistema de aprendizaje práctico y estructurado para construir una carrera real, con estándares profesionales y mentalidad de negocio.
          </p>
        </div>

        {/* The Card */}
        <div className="relative w-full max-w-[1259px] bg-[#1d1d1d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-12 md:p-20 flex flex-col items-center text-center">
          
          <p className="font-sans text-xl md:text-[20px] text-[#d3cbba] mb-12">
            Entrenamos barberos con disciplina y visión de negocio para el mercado australiano.
          </p>

          <h3 className="font-sans font-black text-3xl md:text-[60px] text-[#d3cbba] leading-tight uppercase mb-16 tracking-wide">
            XCLUSIVE BARBER ACADEMY ES PARA
          </h3>

          <div className="space-y-6 w-full max-w-3xl">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-4 group">
                {/* Custom Check Icon from Figma assets if available, or stay consistent with design style */}
                <div className="w-5 h-5 rounded-full border border-[#d3cbba] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#d3cbba] rounded-full opacity-100" />
                </div>
                <p className="font-sans font-light text-lg md:text-2xl text-[#d3cbba] tracking-wide text-left">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Scissors Icon at bottom */}
          <div className="relative w-[168px] h-[204px] mt-16 opacity-100">
             <Image 
               src="/assets/landing/icon-scissors.png" 
               alt="Scissors" 
               fill 
               className="object-contain"
             />
          </div>

        </div>

      </div>
    </section>
  );
}
