import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import ApplyForm from './ApplyForm'
import { AuthCard, AuthCardContent } from '@/components/ui/auth-card'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { getServerLanguage } from '@/lib/i18n/server'
import { buildApplyMetadata } from '@/lib/seo/page-meta'
import { createAdminClient } from '@/utils/supabase/server'

// Title/description in the visitor's language (ES default, EN available) — see lib/seo/page-meta.ts.
export async function generateMetadata(): Promise<Metadata> {
  return buildApplyMetadata(await getServerLanguage())
}

export default async function ApplyPage() {
  const cookieStore = await cookies()
  const trackedPhone = cookieStore.get('tracked_lead_phone')?.value ?? null

  if (trackedPhone) {
    const supabaseAdmin = createAdminClient()
    const now = new Date().toISOString()

    // Etapa 2: el usuario llego a /apply pero aun no completo registro.
    const { data: preLead } = await supabaseAdmin
      .from('crm_leads')
      .select('id, stage2_entered_at')
      .eq('phone_number', trackedPhone)
      .is('profile_id', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (preLead?.id) {
      await supabaseAdmin
        .from('crm_leads')
        .update({
          source: 'apply_page_visit',
          stage2_entered_at: preLead.stage2_entered_at ?? now,
          updated_at: now,
        })
        .eq('id', preLead.id)
    }
  }

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
            <div className="flex items-center justify-center pt-2">
              <Image
                src="/assets/recurso_academia.svg"
                alt="Recurso academia"
                width={174}
                height={14}
                className="w-[174px] h-[14px]"
              />
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
