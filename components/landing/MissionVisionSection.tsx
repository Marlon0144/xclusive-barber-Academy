import Image from "next/image";

export default function MissionVisionSection() {
  return (
    <section className="relative py-24 bg-[#161616] overflow-hidden">
      <div className="container mx-auto px-4 flex justify-center">
        
        {/* Dark Card Container */}
        <div className="relative w-full max-w-[875px] bg-[#1d1d1d] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-12 md:p-20 flex flex-col items-center text-center space-y-16">
          
          {/* Misión Block */}
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-[280px] h-[64px]">
               <Image 
                 src="/assets/landing/mission-header.png" 
                 alt="Misión" 
                 fill 
                 className="object-contain"
               />
            </div>
            <p className="font-sans font-light text-xl text-[#d3cbba] leading-relaxed max-w-xl">
              Formar barberos con nivel profesional, disciplina y mentalidad de crecimiento, capaces de insertarse laboralmente en Australia y construir estabilidad económica a través de una habilidad real.
              <br /><br />
              <span className="opacity-80">
                No formamos solo técnicos, formamos personas con criterio, ética y visión de futuro.
              </span>
            </p>
          </div>

          {/* Visión Block */}
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-[275px] h-[64px]">
               <Image 
                 src="/assets/landing/vision-header.png" 
                 alt="Visión" 
                 fill 
                 className="object-contain"
               />
            </div>
            <p className="font-sans font-light text-xl text-[#d3cbba] leading-relaxed max-w-xl">
              Construir una de las academias de barbería más sólidas para la comunidad latina en Australia, con proyección a largo plazo, alianzas estratégicas, programas formativos más amplios e impacto real en la vida de quienes confían en este proceso.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Separator Line */}
      <div className="relative w-full max-w-[1457px] mx-auto h-[5px] mt-24 shadow-lg">
         <Image 
           src="/assets/landing/gold-separator.png" 
           alt="Separator" 
           fill 
           className="object-cover"
         />
      </div>

    </section>
  );
}
