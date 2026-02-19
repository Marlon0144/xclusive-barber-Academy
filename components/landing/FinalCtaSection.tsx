import Link from "next/link";
import Image from "next/image";

export default function FinalCtaSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#161616]">
       
       {/* 1. Cream Background Overlay Panel */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1484px] h-[300px] md:h-[400px] bg-[#d3cbba]/70 z-0 shadow-lg" />

       <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
         
         {/* Title (Dark text on cream) */}
         <div className="mt-12 md:mt-24 mb-6">
           <h2 className="font-sans font-black text-4xl md:text-[96px] text-[#161616] leading-none uppercase tracking-tight">
             ¿LISTO PARA DAR EL<br />SIGUIENTE PASO?
           </h2>
         </div>

         {/* Description */}
         <p className="font-sans text-xl md:text-2xl text-[#161616]/80 max-w-2xl mx-auto mb-20 font-medium">
           Si estás buscando algo serio, estructurado y con proyección real, puedes aplicar a la academia y comenzar el proceso.
         </p>

         {/* Button (Gold texture background) */}
         <Link href="/apply" className="relative group block mb-32">
            <div className="relative w-[300px] md:w-[932px] h-[80px] md:h-[135px] shadow-2xl hover:scale-105 transition-transform duration-300">
               <Image 
                 src="/assets/landing/gold-separator.png" 
                 alt="Button Background" 
                 fill 
                 className="object-cover rounded-sm"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-sans font-black text-2xl md:text-[64px] text-[#161616] uppercase tracking-tight">
                   APLICAR A LA ACADEMIA
                 </span>
               </div>
            </div>
         </Link>

         {/* Scissors Icon Divider */}
         <div className="relative w-[60px] md:w-[110px] h-[80px] md:h-[133px] mb-12 opacity-80">
            <Image 
              src="/assets/landing/icon-scissors.png" 
              alt="Scissors" 
              fill 
              className="object-contain"
             />
         </div>

         {/* Contact Info (Gold/Cream text on Dark bg) */}
         <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 w-full">
           
           {/* Instagram */}
           <div className="flex items-center gap-4 group cursor-pointer">
             <div className="relative w-[40px] h-[40px] md:w-[56px] md:h-[56px] opacity-70 group-hover:opacity-100 transition-opacity">
               <Image src="/assets/landing/icon-instagram.png" alt="Instagram" fill className="object-contain" />
             </div>
             <span className="font-sans font-medium text-xl md:text-2xl text-[#d3cbba]">
               @xclusivebarberau
             </span>
           </div>

           {/* Phone */}
           <div className="flex items-center gap-4 group cursor-pointer">
             <div className="relative w-[40px] h-[40px] md:w-[60px] md:h-[63px] opacity-70 group-hover:opacity-100 transition-opacity">
               <Image src="/assets/landing/icon-whatsapp.png" alt="WhatsApp" fill className="object-contain" />
             </div>
             <span className="font-sans font-medium text-xl md:text-2xl text-[#d3cbba]">
               +61 413 891 977
             </span>
           </div>

         </div>

         {/* Bottom Border */}
         <div className="relative w-full h-[5px] mt-24 shadow-lg">
            <Image src="/assets/landing/gold-separator.png" alt="Footer Line" fill className="object-cover" />
         </div>

       </div>
    </section>
  );
}
