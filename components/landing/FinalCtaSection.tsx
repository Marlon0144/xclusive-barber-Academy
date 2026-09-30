import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { getServerDictionary } from "@/lib/i18n/server";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export default async function FinalCtaSection() {
  const finalCta = (await getServerDictionary()).landing.finalCta;

  return (
    <section className="relative w-full bg-[#161616] overflow-hidden -mt-10 z-50">

      {/* ─────────────────────────────────────────────
          MOBILE  (< md) — Fiel al diseño Figma 422 px
      ───────────────────────────────────────────── */}
        <div className="relative md:hidden w-full" style={{ minHeight: "272px" }}>

        {/* Panel crema superior */}
        <div
          className="absolute top-0 left-0 right-0 bg-[rgba(211,203,186,0.7)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{ height: "104px" }}
        />

        {/* Título sobre panel crema */}
        <h2
          className="absolute left-0 right-0 text-center font-sans font-black text-[32px] leading-none uppercase z-10"
          style={{ top: "16px", color: "#161616" }}
        >
          {finalCta.titleLineOne}
          <br />
          {finalCta.titleLineTwo}
        </h2>

        {/* Descripción */}
        <p
          className="absolute left-0 right-0 text-center font-sans font-normal text-[7px] text-[#d3cbba] leading-[1.3] z-10 px-[52px]"
          style={{ top: "123px" }}
        >
          {finalCta.description}
        </p>

        {/* Botón CTA — antes era un <div> decorativo sin href, no llevaba a ningún lado */}
        <TrackedLink
          href="/apply"
          event="apply_click"
          className="absolute z-10 hover:brightness-110 transition-all duration-300 select-none block"
          style={{ top: "192px", left: "81px", width: "250px", height: "38px" }}
        >
          <div className="relative w-full h-full shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <Image
              src="/assets/landing/FinalSection/recurso-boton.png"
              alt={finalCta.buttonAlt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans font-black text-[17px] text-[#161616] uppercase leading-none">
                {finalCta.button}
              </span>
            </div>
          </div>
        </TrackedLink>

        {/* Separador dorado inferior */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: "258px", width: "407px", height: "2px" }}
        >
          <Image
            src="/assets/divider.svg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          DESKTOP  (md+) — Layout expandido
      ───────────────────────────────────────────── */}
      <ScrollReveal>
      <div className="hidden md:flex md:flex-col md:items-center w-full overflow-hidden">

        {/* Panel crema superior — full width, Figma: h=276px, bg-[rgba(211,203,186,0.7)] */}
        <div className="relative w-full bg-[rgba(211,203,186,0.7)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center py-[clamp(16px,2.4vw,44px)] px-8">
          <h2
            className="font-sans font-black leading-tight uppercase text-center max-w-[1270px]"
            style={{ fontSize: "clamp(32px,5.8vw,96px)", color: "#161616" }}
          >
            {finalCta.titleLineOne} {finalCta.titleLineTwo}
          </h2>
        </div>

        {/* Descripción — Figma: text-[20px] Poppins Regular, w=908px */}
        <p className="font-sans font-normal text-[clamp(14px,1.4vw,20px)] text-[#d3cbba] leading-[1.3] text-center max-w-[908px] mt-4 lg:mt-6 mb-5 lg:mb-8 px-6">
          {finalCta.description}
        </p>

        {/* Botón CTA — Figma: w=932px, h=135px, text-[64px] ExtraBold */}
        <TrackedLink
          href="/apply"
          event="apply_click"
          className="relative hover:brightness-110 transition-all duration-300 mb-6 lg:mb-10 select-none block"
        >
          <div
            className="relative shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            style={{ width: "clamp(380px,58vw,932px)", height: "clamp(56px,8vw,135px)" }}
          >
            <Image
              src="/assets/landing/FinalSection/recurso-boton.png"
              alt={finalCta.buttonAlt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans font-black text-[clamp(22px,3.8vw,64px)] text-[#161616] uppercase leading-none">
                {finalCta.button}
              </span>
            </div>
          </div>
        </TrackedLink>

        {/* Separador dorado inferior */}
        <div className="relative w-full" style={{ height: "4px" }}>
          <Image
            src="/assets/divider.svg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

      </div>
      </ScrollReveal>

    </section>
  );
}
