import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

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
            src="/assets/imagen-julian.svg"
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
          DESKTOP  (md+) — 1:1 Figma 1440px canvas
          Section height = photo height = 1314px at 1440px viewport.
          All children absolutely positioned to match Figma coords.
          Coordinates expressed as vw-clamp for fluid scaling.
      ───────────────────────────────────────────── */}
      <ScrollReveal>
      <div
        className="hidden md:block relative w-full overflow-hidden"
        style={{ height: "clamp(380px, 55vw, 960px)" }}
      >

        {/* ── Instructor photo — Figma: x=802 y=0 w=851 h=1314 (full section height) */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            top: 0,
            left: "46%",
            width: "clamp(260px, 48vw, 810px)",
            height: "100%",
          }}
        >
          <Image
            src="/assets/imagen-julian.svg"
            alt="Julian Giraldo — Fundador de Xclusive Barber Academy"
            fill
            className="object-contain object-top"
            sizes="(max-width: 1440px) 59vw, 851px"
            priority
          />
        </div>

        {/* ── "XCLUSIVE BARBER ACADEMY" — above JULIAN, centered */}
        <p
          className="absolute z-30 font-sans font-extralight text-[#d3cbba] tracking-[0.09em] uppercase text-center"
          style={{
            top: "clamp(10px, 1.8vw, 32px)",
            left: 0,
            right: 0,
            fontSize: "clamp(11px, 1.5vw, 28px)",
          }}
        >
          XCLUSIVE BARBER ACADEMY
        </p>

        {/* ── "JULIAN" — below academy label, centered */}
        <h2
          className="absolute z-10 font-sans font-black text-[#d3cbba] opacity-[0.79] leading-none tracking-tighter text-center pointer-events-none select-none"
          style={{
            top: "clamp(28px, 4.2vw, 75px)",
            left: 0,
            right: 0,
            fontSize: "clamp(60px, 14vw, 260px)",
          }}
        >
          JULIAN
        </h2>

        {/* ── Italic subtitle — Figma: x=301 y=464 w=837 text-[32px] Light Italic */}
        <p
          className="absolute z-30 font-sans italic font-light text-[#d3cbba] leading-[1.3]"
          style={{
            top: "clamp(130px, 20vw, 350px)",
            left: "clamp(44px, 12.8vw, 254px)",
            width: "clamp(180px, 28vw, 460px)",
            fontSize: "clamp(12px, 1.5vw, 28px)",
          }}
        >
          Una academia creada desde la experiencia real
        </p>

        {/* ── Green description box — behind photo (z-10 < photo z-20) */}
        <div
          className="absolute z-10 bg-[rgba(30,58,39,0.8)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{
            top: "clamp(240px, 34vw, 590px)",
            left: "clamp(30px, 10vw, 200px)",
            width: "clamp(220px, 50vw, 830px)",
            minHeight: "clamp(80px, 14vw, 250px)",
          }}
        >
          {/* Text inside — Figma: offset 68px left from box, 67px top, w=659 text-[32px] Light */}
          <p
            className="font-sans font-light text-[#d3cbba] leading-[1.3]"
            style={{
              padding: "clamp(14px, 2.8vw, 50px) clamp(14px, 2.8vw, 54px)",
              maxWidth: "600px",
              fontSize: "clamp(11px, 1.5vw, 28px)",
            }}
          >
            Xclusive Barber Academy nace desde la experiencia directa de su
            fundador como migrante, barbero profesional y emprendedor en
            Australia.
          </p>
        </div>

      </div>
      </ScrollReveal>

    </section>
  );
}
