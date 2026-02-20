import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col pt-32 pb-20 overflow-hidden bg-[#050505]">
      
      {/* 1. BACKGROUND IMAGE & GRADIENT */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/landing/hero-bg.png"
          alt="Barber Background"
          fill
          className="object-cover opacity-20" // Reducimos opacidad para igualar el Figma
          priority
        />
        {/* Este gradiente hace que el fondo se funda a negro sólido hacia abajo */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col flex-1 px-4 md:px-8 mt-4 md:mt-10">
        
        {/* BLOQUE SUPERIOR: Títulos Centrados */}
        <div className="flex flex-col items-center text-center w-full">
          
          <p className="font-sans font-light tracking-[0.25em] text-[#d3cbba]/80 text-xs md:text-sm lg:text-base mb-6 uppercase">
            Educación profesional en barbería para latinos
          </p>

          <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.2] tracking-tight text-[#E8E4D9] uppercase max-w-4xl">
            Formación orientada a los<br />estándares reales del
          </h1>
          
          {/* Bloque "MERCADO AUSTRALIANO" con su línea asimétrica */}
          <div className="relative mt-4 md:mt-6 inline-block">
            <h2 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[90px] tracking-tight text-[#d3cbba] uppercase">
              Mercado Australiano
            </h2>
            {/* Línea dorada CSS pura, alineada a la derecha */}
            <div className="absolute -bottom-2 md:-bottom-4 right-0 w-[55%] h-[2px] md:h-[3px] bg-[#D4AF37]"></div>
          </div>

        </div>

        {/* BLOQUE INFERIOR: Párrafo alineado a la derecha */}
        <div className="flex-1 w-full flex flex-col justify-end mt-24 md:mt-32 relative z-30">
            <div className="w-full md:w-[420px] ml-auto text-right md:text-right mb-10 md:mb-0">
              <p className="font-sans font-light text-[#d3cbba]/90 text-sm md:text-base leading-relaxed">
                Sistema de aprendizaje práctico y estructurado para construir una carrera real, con estándares profesionales y mentalidad de negocio.
              </p>
            </div>
        </div>
      </div>

      {/* 3. ARM TATTOO IMAGE */}
      <div className="absolute left-[-20px] bottom-0 w-[300px] md:w-[500px] lg:w-[650px] h-[400px] md:h-[600px] lg:h-[750px] z-30 pointer-events-none">
        <Image
          src="/assets/landing/hero-tattoo-arm.png"
          alt="Tattoo Arm Detail"
          fill
          className="object-contain object-bottom md:object-left-bottom"
        />
      </div>

    </section>
  );
}