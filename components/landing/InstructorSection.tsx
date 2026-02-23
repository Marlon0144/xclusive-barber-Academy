import Image from "next/image";

export default function InstructorSection() {
  return (
    <section className="relative w-full bg-[#161616] overflow-hidden">

      {/* ─────────────────────────────────────────────
          MOBILE  (< md) — Fiel al diseño Figma 422 px
      ───────────────────────────────────────────── */}
      <div className="relative md:hidden w-full" style={{ minHeight: "510px" }}>

        {/* Academia label — centrado, arriba */}
        <p
          className="absolute top-[43px] left-0 right-0 text-center font-sans font-extralight text-[11px] text-[#d3cbba] tracking-[0.99px] uppercase z-20"
        >
          XCLUSIVE BARBER ACADEMY
        </p>

        {/* "JULIAN" — tipografía de impacto */}
        <h2
          className="
            absolute top-[35px] left-0 right-0
            text-center font-sans font-black text-[96px]
            text-[#d3cbba] opacity-[0.79]
            leading-[1.28] z-10 pointer-events-none select-none
          "
        >
          JULIAN
        </h2>

        {/* Subtítulo itálico */}
        <p
          className="absolute top-[194px] left-[28px] font-sans italic font-light text-[14px] text-[#d3cbba] leading-[1.3] w-[202px] z-20"
        >
          Una academia creada desde la experiencia real
        </p>

        {/* Fotografía del instructor — posicionada según Figma */}
        <div
          className="absolute top-[-10px] z-40 pointer-events-none"
          style={{ left: "calc(50% - 60px)", width: "322px", height: "497px" }}
        >
          <Image
            src="/assets/landing/InstructorSection/tutor_julian.png"
            alt="Julian Giraldo — Fundador de Xclusive Barber Academy"
            fill
            className="object-contain object-top"
            priority
          />
        </div>

        {/* Caja descriptiva verde — bottom-left */}
        <div
          className="absolute z-30 bg-[rgba(30,58,39,0.8)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{ top: "317px", left: "0px", width: "310px", minHeight: "100px" }}
        >
          <p className="font-sans font-light not-italic text-[10px] text-[#d3cbba] leading-[1.3] w-[151px] ml-[40px] my-[14px]">
            Xclusive Barber Academy nace desde la experiencia directa de su fundador como migrante, barbero profesional y emprendedor en Australia.
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          DESKTOP  (md+) — Layout expandido
      ───────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full min-h-screen py-28 overflow-hidden">

        {/* "JULIAN" de fondo — enorme */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none select-none z-0">
          <h2 className="font-sans font-black text-[22vw] xl:text-[280px] text-[#d3cbba] opacity-[0.08] leading-none tracking-tighter mt-16">
            JULIAN
          </h2>
        </div>

        <div className="relative z-10 container mx-auto px-8 xl:px-16 max-w-[1440px]">

          {/* Encabezado */}
          <div className="text-center mb-14">
            <p className="font-sans font-extralight text-sm md:text-base text-[#d3cbba] tracking-[0.15em] uppercase mb-4">
              XCLUSIVE BARBER ACADEMY
            </p>
            <p className="font-sans italic font-light text-2xl lg:text-[32px] text-[#d3cbba]">
              Una academia creada desde la experiencia real
            </p>
          </div>

          {/* Grid principal */}
          <div className="relative flex items-end justify-end">

            {/* Caja descriptiva — izquierda, superpuesta */}
            <div
              className="
                absolute left-0 bottom-[80px] z-20
                w-[520px] lg:w-[700px] xl:w-[860px]
                bg-[rgba(30,58,39,0.8)] backdrop-blur-sm
                shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                border-l-4 border-[#d3cbba]
                px-10 py-10
              "
            >
              <p className="font-sans font-light text-xl lg:text-2xl xl:text-[28px] text-[#d3cbba] leading-relaxed">
                Xclusive Barber Academy nace desde la experiencia directa de su
                fundador como migrante, barbero profesional y emprendedor en
                Australia.
              </p>
            </div>

            {/* Fotografía */}
            <div className="relative w-[480px] lg:w-[560px] xl:w-[640px] h-[700px] lg:h-[820px] xl:h-[900px] pointer-events-none shrink-0">
              <Image
                src="/assets/landing/InstructorSection/tutor_julian.png"
                alt="Julian Giraldo — Fundador de Xclusive Barber Academy"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
