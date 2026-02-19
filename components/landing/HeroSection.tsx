import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[110vh] flex flex-col pt-32 overflow-hidden bg-[#161616]">
      
      {/* 1. BACKGROUND IMAGE (Blurred per Figma) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/landing/hero-bg.png"
          alt="Barber Background"
          fill
          className="object-cover opacity-30 blur-[2.5px]"
          priority
        />
        {/* Helper gradient for text readability if needed */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#161616] to-transparent"></div>
      </div>

      {/* 2. HERO CONTENT */}
      <div className="relative z-20 w-full flex flex-col items-center text-center mt-8 md:mt-16 px-4">
        
        {/* Subtitle */}
        <p className="font-sans font-light tracking-[0.2em] text-[#d3cbba] text-sm md:text-xl lg:text-2xl mb-4 md:mb-8 text-center uppercase">
          EDUCACIÓN PROFESIONAL EN BARBERÍA PARA LATINOS
        </p>

        {/* Main Title Stack */}
        <div className="flex flex-col items-center leading-none text-[#d3cbba] text-center max-w-7xl mx-auto">
          <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-7xl lg:text-[64px] tracking-tight uppercase mb-0">
            FORMACIÓN ORIENTADA A LOS ESTÁNDARES REALES DEL
          </h1>
          <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-[96px] tracking-tight uppercase mt-2 md:mt-4">
            MERCADO AUSTRALIANO
          </h1>
        </div>

        {/* Gold Separator Line */}
        <div className="relative w-[300px] md:w-[812px] h-[5px] mt-12 md:mt-16 shadow-lg">
           <Image 
             src="/assets/landing/gold-separator.png" 
             alt="Separator" 
             fill 
             className="object-cover"
           />
        </div>

      </div>

      {/* 3. ARM TATTOO IMAGE (Absolute positioned left) */}
      <div className="absolute left-[-20px] md:left-[-62px] top-[50%] md:top-[600px] w-[300px] md:w-[617px] h-[500px] md:h-[924px] z-10 opacity-90 pointer-events-none">
        <Image
          src="/assets/landing/hero-tattoo-arm.png"
          alt="Tattoo Arm Detail"
          fill
          className="object-contain md:object-cover"
        />
      </div>

    </section>
  );
}
