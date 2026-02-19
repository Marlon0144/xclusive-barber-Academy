import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      title: "MENTALIDAD PROFESIONAL",
      desc: "Disciplina, puntualidad, trato al cliente y presentación personal como parte del proceso.",
      icon: "/assets/landing/icon-mindset.png",
      width: 45,
      height: 45
    },
    {
      title: "FORMACIÓN PRÁCTICA REAL",
      desc: "Aprendes haciendo, con corrección constante y estándares reales del mercado australiano.",
      icon: "/assets/landing/icon-training.png",
      width: 37,
      height: 37
    },
    {
      title: "ENFOQUE EN CARRERA Y NEGOCIO",
      desc: "No solo técnica: preparación para el mundo laboral y bases de mentalidad emprendedora.",
      icon: "/assets/landing/icon-career.png",
      width: 42,
      height: 42
    },
  ];

  return (
    <section className="relative py-32 bg-[#161616] overflow-hidden">
      
      {/* Background Image (Barber working) */}
      <div className="absolute inset-x-0 top-0 h-[1200px] z-0 opacity-40 mix-blend-overlay pointer-events-none">
         <Image 
           src="/assets/landing/formamos-profesionales-bg.png" 
           alt="Barber Background" 
           fill 
           className="object-cover object-top"
         />
         <div className="absolute inset-0 bg-[#161616]/60 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        
        {/* Section Header */}
        <div className="mb-24 flex flex-col items-center leading-none text-[#d3cbba] tracking-[0.2em]">
          <h2 className="font-sans font-black text-6xl md:text-[130px] uppercase mb-0 opacity-90 drop-shadow-2xl">
            FORMAMOS
          </h2>
          <h2 className="font-sans font-black text-5xl md:text-[96px] uppercase -mt-2 md:-mt-8 text-[#d3cbba]">
            PROFESIONALES
          </h2>
          {/* Gold separator */}
          <div className="w-[100px] md:w-[160px] h-[3px] bg-[#d3cbba] mt-12 mb-4 md:mb-12 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" />
        </div>

        {/* Features List */}
        <div className="w-full max-w-5xl space-y-24">
          {features.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              
              {/* Icon */}
              <div className="relative mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                 <Image 
                   src={item.icon} 
                   alt={item.title} 
                   width={item.width * 2} 
                   height={item.height * 2}
                   className="object-contain"
                 />
              </div>

              {/* Description */}
              <p className="font-sans font-normal text-xl md:text-2xl text-[#d3cbba] max-w-3xl leading-relaxed">
                {item.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
