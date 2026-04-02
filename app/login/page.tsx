import { login } from './actions'
import { AuthCard, AuthCardContent } from "@/components/ui/auth-card"
import { AuthInput } from "@/components/ui/auth-input"
import { AuthButton } from "@/components/ui/auth-button"
import Link from "next/link"
import Image from "next/image"
import { DashboardFooter } from "@/components/dashboard/DashboardFooter"
import { getServerDictionary } from "@/lib/i18n/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMessage = params.error
  const dictionary = await getServerDictionary()
  const text = dictionary.loginPage

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
               alt={text.back} 
               width={24} 
               height={12} 
               className="w-auto h-3"
             />
          </Link>

          {/* Logo - Centered at top, overflowing if needed or just padding top */}
          <div className="mb-6 relative w-30 h-30 flex items-center justify-center mt-[-58px]">
            <Image
              src="/assets/logo-academia.svg"
              alt="Xclusive Barber Academy"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title - Dark Green Strip */}
          <div className="bg-[#1e3a27]/60 w-full py-5 mb-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm">
            <h1 className="text-[#d3cbba] font-sans font-extrabold text-2xl leading-none tracking-widest">
              {text.titleLineOne}
              <br />
              <span className="text-[#d3cbba]">{text.titleLineTwo}</span>
            </h1>
          </div>

          <p className="text-[#d3cbba] text-[10px] font-light tracking-wide mb-6 opacity-80">
            {text.subtitle}
          </p>

          <div className="px-8 text-center space-y-4 w-full">
             <div className="text-[#d3cbba] text-[12px] leading-relaxed">
               <p className="font-bold mb-2">{text.welcomeTitle}</p>
               <p className="font-light opacity-90">{text.welcomeBody}</p>
             </div>
             
             {/* Separator Image */}
            <div className="w-full h-[1px] relative opacity-40">
               <Image src="/assets/divider.svg" alt="divider" fill className="object-cover" />
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
                  placeholder={text.emailPlaceholder}
                  required
                  className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/40 placeholder:font-light placeholder:tracking-widest"
                />
              </div>

               {/* Password Input */}
              <div className="space-y-1">
                <AuthInput
                  name="password"
                  type="password"
                  placeholder={text.passwordPlaceholder}
                  required
                  className="text-center placeholder:text-[10px] placeholder:text-[#d3cbba]/40 placeholder:font-light placeholder:tracking-widest"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center -mt-2">
               <Link href="/auth/forgot-password" className="text-[9px] text-[#d3cbba] hover:text-white transition-colors tracking-wide font-light opacity-80">
                 {text.forgotPassword}
               </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AuthButton
                formAction={login}
                className="w-full bg-[#D3CBBA] text-[#1e3a27] hover:brightness-110 font-bold tracking-[0.2em] text-[13px] py-6 shadow-[0px_4px_15px_rgba(212,175,55,0.15)] border-none "
              >
                {text.submit}
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
              <span className="font-light">{text.firstAccessPrefix} </span>
              <Link href="/apply" className="font-bold hover:text-white transition-colors ml-1">{text.activateAccount}</Link>
            </div>
            
            <div className="text-[9px] text-[#d3cbba]">
              <p className="opacity-80 mb-1">{text.issuesLine}</p>
              <Link href="/contact" className="font-bold hover:text-white transition-colors">{text.contact}</Link>
            </div>
          </div>
        </AuthCardContent>

      </AuthCard>

      <DashboardFooter tagline={text.footerTagline} />

    </div>
  )
}