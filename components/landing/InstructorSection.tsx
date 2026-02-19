import Image from "next/image";

export default function InstructorSection() {
  return (
    <section className="relative w-full min-h-screen py-32 bg-[#161616] overflow-hidden flex flex-col items-center">
      
      {/* 1. HUGE BACKGROUND TEXT "JULIAN" */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h2 className="font-sans font-black text-[20vw] md:text-[300px] text-[#d3cbba] opacity-[0.08] leading-none tracking-tighter">
          JULIAN
        </h2>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-[1440px]">
        
        {/* Top Titles */}
        <div className="text-center mb-16 relative z-20">
          <h3 className="font-sans font-extralight text-2xl md:text-[32px] text-[#d3cbba] tracking-[0.1em] uppercase mb-4">
            XCLUSIVE BARBER ACADEMY
          </h3>
          <p className="font-serif italic font-light text-2xl md:text-[32px] text-[#d3cbba]">
            Una academia creada desde la experiencia real
          </p>
        </div>

        {/* Content Grid */}
        <div className="relative flex flex-col md:flex-row items-end justify-center">
          
          {/* Left: Description Box (Overlapping) */}
          <div className="md:absolute md:left-0 md:bottom-[100px] w-full md:w-[600px] lg:w-[912px] bg-[#1e3a27]/80 backdrop-blur-sm p-8 md:p-12 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border-l-4 border-[#d3cbba] mb-8 md:mb-0 z-20">
             <p className="font-sans font-light text-xl md:text-[32px] text-[#d3cbba] leading-relaxed">
               Xclusive Barber Academy nace desde la experiencia directa de su fundador como migrante, barbero profesional y emprendedor en Australia.
             </p>
          </div>

          {/* Right: Instructor Image */}
          <div className="relative w-full md:w-[600px] h-[600px] md:h-[900px] ml-auto z-10 pointer-events-none">
             <Image 
               src="/assets/landing/instructor-julian.png" 
               alt="Julian Giraldo" 
               fill 
               className="object-contain object-bottom"
             />
          </div>

        </div>

      </div>
    </section>
  );
}
