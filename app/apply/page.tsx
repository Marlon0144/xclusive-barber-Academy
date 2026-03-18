import Image from 'next/image'
import Link from 'next/link'
import ApplyForm from './ApplyForm'
import { AuthCard, AuthCardContent } from '@/components/ui/auth-card'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'

export default function ApplyPage() {
  return (
    <div className="min-h-screen w-full bg-[#161616] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background gradients/overlay if needed */}

      {/* Main Container - AuthCard */}
      <AuthCard className="w-full max-w-[350px] bg-[#1d1d1d] border-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-0 overflow-visible mt-20 mb-10 min-h-[700px]">
        
        {/* Header Section */}
        <div className="relative pt-0 flex flex-col items-center text-center w-full">
          
          {/* Back Arrow */}
          <Link href="/" className="absolute top-6 left-6 z-20 opacity-80 hover:opacity-100 transition-opacity">
             <Image 
               src="/assets/apply/icon-back.png" 
               alt="Back" 
               width={24} 
               height={12} 
               className="w-auto h-3"
             />
          </Link>

          {/* Logo */}
          <div className="mb-6 relative w-30 h-30 flex items-center justify-center mt-[-58px]">
            <Image
              src="/assets/logo-academia.svg"
              alt="Xclusive Barber Academy"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title - Green Box */}
          <div className="bg-[#1e3a27]/60 w-full py-5 mb-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm">
            <h1 className="text-[#d3cbba] font-sans font-extrabold text-2xl leading-none tracking-widest">
              ACTIVA TU ACCESO
            </h1>
            <div className="flex items-center justify-center pt-1">
              <Image src="/assets/logo-academia.svg" alt="A la academia" width={200} height={200} />
            </div>
          </div>

          <p className="text-[#d3cbba] text-[6px] font-light tracking-wide mb-6 opacity-80 uppercase">
            Este paso solo se realiza una vez.
          </p>

          <div className="px-8 text-center space-y-4 w-full">
             <div className="text-[#d3cbba] text-[12px] leading-relaxed">
               <p className="font-bold mb-2">¡Ya haces parte de Xclusive Barber Academy!</p>
               <p className="font-light opacity-90 text-[10px]">Completa tus datos para acceder por primera vez a la plataforma académica.</p>
             </div>
             
             {/* Separator Image */}
            <div className="w-full h-[1px] relative opacity-40">
               <Image src="/assets/divider.svg" alt="divider" fill className="object-cover" />
            </div>
          </div>
        </div>

        <AuthCardContent className="px-8 pb-10 pt-4 w-full">
          <ApplyForm />

          {/* Links Footer inside Card */}
          <div className="text-center space-y-3 pt-6 border-t border-[#d3cbba]/10 mt-6">
            <div className="text-[7px] text-[#d3cbba] uppercase tracking-wide">
              <span className="font-light">¿Ya activaste tu acceso? </span>
              <Link href="/login" className="font-bold hover:text-white transition-colors ml-1">Continuar tu formación</Link>
            </div>
          </div>
        </AuthCardContent>

      </AuthCard>

      <DashboardFooter tagline="Formación profesional para construir una carrera real." />

    </div>
  )
}
