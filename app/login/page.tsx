import { login } from './actions'
import { AuthCard, AuthCardContent, AuthCardHeader } from "@/components/ui/auth-card"
import { AuthInput } from "@/components/ui/auth-input"
import { AuthButton } from "@/components/ui/auth-button"
import Link from "next/link"
import Image from "next/image"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.error

  return (
    <div className="min-h-screen w-full bg-[#161616] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background gradients/overlay if needed */}

      {/* Main Container - AuthCard */}
      <AuthCard className="w-full max-w-[350px] bg-[#1d1d1d] border-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-0 overflow-visible mt-20 mb-10 min-h-[600px]">
        
        {/* Header Section */}
        <div className="relative pt-0 flex flex-col items-center text-center w-full">
          
          {/* Back Arrow - Absolute positioned */}
          <Link href="/" className="absolute top-6 left-6 z-20 opacity-80 hover:opacity-100 transition-opacity">
             <Image 
               src="/assets/login/icon-arrow-back.png" 
               alt="Back" 
               width={24} 
               height={12} 
               className="w-auto h-3"
             />
          </Link>

          {/* Logo - Centered at top, overflowing if needed or just padding top */}
          <div className="mt-8 mb-6 relative w-24 h-24 flex items-center justify-center">
            <Image
              src="/assets/login/logo-footer.png"
              alt="Xclusive Barber Academy"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title - Dark Green Strip */}
          <div className="bg-[#1e3a27]/60 w-full py-5 mb-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm">
            <h1 className="text-[#d3cbba] font-cinzel font-bold text-2xl leading-none tracking-widest">
              ACCEDE A LA
              <br />
              <span className="text-[#d3cbba]">ACADEMIA</span>
            </h1>
          </div>

          <p className="text-[#d3cbba] text-[10px] font-light tracking-wide mb-6 opacity-80">
            Acceso exclusivo para estudiantes activos.
          </p>

          <div className="px-8 text-center space-y-4 w-full">
             <div className="text-[#d3cbba] text-[12px] leading-relaxed">
               <p className="font-bold mb-2">¡Bienvenido a Xclusive Barber Academy!</p>
               <p className="font-light opacity-90">Ingresa para acceder a tus clases, contenidos exclusivos y seguimiento académico.</p>
             </div>
             
             {/* Separator Image */}
            <div className="w-full h-[1px] relative opacity-40">
               <Image src="/assets/login/divider.png" alt="divider" fill className="object-cover" />
            </div>
          </div>
        </div>

        <AuthCardContent className="px-8 pb-10 pt-6 space-y-6 w-full">
          <form className="flex flex-col gap-6">
            
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1">
                <AuthInput
                  name="email"
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  required
                  className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/40 placeholder:font-light placeholder:tracking-widest"
                />
              </div>

               {/* Password Input */}
              <div className="space-y-1">
                <AuthInput
                  name="password"
                  type="password"
                  placeholder="CONTRASEÑA"
                  required
                  className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/40 placeholder:font-light placeholder:tracking-widest"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center -mt-2">
               <Link href="/auth/forgot-password" className="text-[9px] text-[#d3cbba] hover:text-white transition-colors tracking-wide font-light opacity-80">
                 ¿OLVIDASTE TU CONTRASEÑA?
               </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AuthButton
                formAction={login}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#1e3a27] hover:brightness-110 font-bold tracking-[0.2em] text-[13px] py-6 shadow-[0px_4px_15px_rgba(212,175,55,0.15)] border-none rounded-sm"
              >
                ACCEDER A MI FORMACIÓN
              </AuthButton>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-sm text-red-200 text-xs text-center uppercase tracking-wide">
                {errorMessage}
              </div>
            )}
          </form>

          {/* Links Footer inside Card */}
          <div className="text-center space-y-3 pt-4 border-t border-[#d3cbba]/10">
            <div className="text-[9px] text-[#d3cbba]">
              <span className="font-light">¿ES TU PRIMER INGRESO? </span>
              <Link href="/apply" className="font-bold hover:text-white transition-colors ml-1">ACTIVAR CUENTA</Link>
            </div>
            
            <div className="text-[9px] text-[#d3cbba]">
              <p className="opacity-80 mb-1">¿TIENES PROBLEMAS PARA INGRESAR?</p>
              <Link href="/contact" className="font-bold hover:text-white transition-colors">CONTÁCTANOS</Link>
            </div>
          </div>
        </AuthCardContent>

      </AuthCard>

      {/* Footer Outside Card */}
      <div className="mt-8 mb-4 w-full max-w-[350px] flex flex-col items-center justify-center space-y-4">
          
          <div className="flex items-center justify-center gap-6 opacity-70">
             {/* Logo Footer */}
             <div className="w-8 h-8 relative">
               <Image src="/assets/login/logo-footer.png" alt="Footer Logo" fill className="object-contain" />
             </div>
             
             {/* Social Handles */}
             <div className="flex flex-col text-[9px] text-[#d3cbba] font-medium leading-tight text-right">
                <span>@xclusivebarberau</span>
             </div>

             {/* Icons */}
             <div className="flex gap-3">
               <Link href="#" className="w-5 h-5 relative hover:opacity-80 transition-opacity">
                  <Image src="/assets/login/icon-instagram.png" alt="Instagram" fill className="object-contain" />
               </Link>
               <Link href="#" className="w-4 h-4 relative hover:opacity-80 transition-opacity">
                  <Image src="/assets/login/icon-whatsapp.png" alt="WhatsApp" fill className="object-contain" />
               </Link>
             </div>
             
             <div className="flex flex-col text-[9px] text-[#d3cbba] font-medium leading-tight">
                <span>+61 413 891 977</span>
             </div>
          </div>
          
          {/* Separator */}
          <div className="w-full h-[1px] relative opacity-50">
             <Image src="/assets/login/divider.png" alt="divider" fill className="object-cover" />
          </div>

          <p className="text-[8px] text-[#d3cbba] text-center font-medium opacity-80 uppercase tracking-wider">
            Formación profesional para construir una carrera real
          </p>

      </div>
    </div>
  )
}