import Link from "next/link";
import Image from "next/image";

export default function FinalCtaSection() {
  return (
    <section className="relative w-full bg-[#161616] overflow-hidden -mt-10 z-50">

      {/* ─────────────────────────────────────────────
          MOBILE  (< md) — Fiel al diseño Figma 422 px
      ───────────────────────────────────────────── */}
      <div className="relative md:hidden w-full" style={{ minHeight: "350px" }}>

        {/* Panel crema superior */}
        <div
          className="absolute top-0 left-0 right-0 bg-[rgba(211,203,186,0.7)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{ height: "104px" }}
        />

        {/* Título sobre panel crema */}
        <h2
          className="absolute left-0 right-0 text-center font-sans font-black text-[32px] text-[#2b2b2b] opacity-[0.79] leading-none uppercase z-10"
          style={{ top: "16px" }}
        >
          ¿LISTO PARA DAR EL<br />SIGUIENTE PASO?
        </h2>

        {/* Descripción */}
        <p
          className="absolute left-0 right-0 text-center font-sans font-normal text-[7px] text-[#d3cbba] leading-[1.3] z-10 px-[52px]"
          style={{ top: "123px" }}
        >
          Si estás buscando algo serio, estructurado y con proyección real, puedes aplicar a la academia y comenzar el proceso.
        </p>

        {/* Botón CTA */}
        <Link
          href="/apply"
          className="absolute z-10 hover:brightness-110 transition-all duration-300"
          style={{ top: "192px", left: "81px", width: "250px", height: "38px" }}
        >
          <div className="relative w-full h-full shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <Image
              src="/assets/landing/FinalSection/recurso-boton.png"
              alt="Botón aplicar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans font-black text-[17px] text-[#161616] uppercase leading-none">
                APLICAR A LA ACADEMIA
              </span>
            </div>
          </div>
        </Link>

        {/* Fila de contacto con logo en el centro */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center gap-[14px] z-10"
          style={{ top: "274px" }}
        >
          {/* Instagram */}
          <div className="flex items-center gap-[4px]">
            <div className="relative opacity-70" style={{ width: "14px", height: "14px" }}>
              <Image
                src="/assets/landing/FinalSection/icono.ig.png"
                alt="Instagram"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-sans font-medium text-[10px] text-[#d3cbba] leading-[1.3]">
              @xclusivebarberau
            </span>
          </div>

          {/* Logo — centro */}
          <div className="relative shrink-0" style={{ width: "33px", height: "39px" }}>
            <Image
              src="/assets/landing/FinalSection/logo-academy.png"
              alt="Xclusive Barber Academy"
              fill
              className="object-contain"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-[4px]">
            <div className="relative opacity-70" style={{ width: "15px", height: "16px" }}>
              <Image
                src="/assets/landing/FinalSection/icono-wpp.png"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-sans font-medium text-[10px] text-[#d3cbba] leading-[1.3]">
              +61 413 891 977
            </span>
          </div>
        </div>

        {/* Separador dorado inferior */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: "338px", width: "407px", height: "2px" }}
        >
          <Image
            src="/assets/landing/FinalSection/divide-dorado.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>

      </div>

      {/* ─────────────────────────────────────────────
          DESKTOP  (md+) — Layout expandido
      ───────────────────────────────────────────── */}
      <div className="hidden md:flex md:flex-col md:items-center w-full overflow-hidden">

        {/* Panel crema superior — full width */}
        <div className="relative w-full bg-[rgba(211,203,186,0.7)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center py-10 px-8">
          <h2 className="font-sans font-black text-[56px] lg:text-[72px] xl:text-[80px] text-[#2b2b2b] opacity-[0.79] leading-none uppercase text-center">
            ¿LISTO PARA DAR EL SIGUIENTE PASO?
          </h2>
        </div>

        {/* Descripción */}
        <p className="font-sans font-normal text-sm lg:text-base text-[#d3cbba] leading-[1.3] text-center max-w-[680px] mt-8 mb-10 px-6">
          Si estás buscando algo serio, estructurado y con proyección real, puedes aplicar a la academia y comenzar el proceso.
        </p>

        {/* Botón CTA */}
        <Link href="/apply" className="relative hover:brightness-110 transition-all duration-300 mb-14">
          <div
            className="relative shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            style={{ width: "520px", height: "72px" }}
          >
            <Image
              src="/assets/landing/FinalSection/recurso-boton.png"
              alt="Botón aplicar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-sans font-black text-[28px] lg:text-[34px] text-[#161616] uppercase leading-none">
                APLICAR A LA ACADEMIA
              </span>
            </div>
          </div>
        </Link>

        {/* Logo / ícono tijeras */}
        <div className="relative mb-6" style={{ width: "56px", height: "66px" }}>
          <Image
            src="/assets/landing/FinalSection/logo-academy.png"
            alt="Xclusive Barber Academy"
            fill
            className="object-contain"
          />
        </div>

        {/* Fila de contacto */}
        <div className="flex items-center justify-center gap-16 mb-10">
          {/* Instagram */}
          <div className="flex items-center gap-3">
            <div className="relative opacity-70" style={{ width: "24px", height: "24px" }}>
              <Image
                src="/assets/landing/FinalSection/icono.ig.png"
                alt="Instagram"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-sans font-medium text-lg text-[#d3cbba]">
              @xclusivebarberau
            </span>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-3">
            <div className="relative opacity-70" style={{ width: "26px", height: "27px" }}>
              <Image
                src="/assets/landing/FinalSection/icono-wpp.png"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-sans font-medium text-lg text-[#d3cbba]">
              +61 413 891 977
            </span>
          </div>
        </div>

        {/* Separador dorado inferior */}
        <div className="relative w-full" style={{ height: "4px" }}>
          <Image
            src="/assets/landing/FinalSection/divide-dorado.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>

      </div>

    </section>
  );
}
