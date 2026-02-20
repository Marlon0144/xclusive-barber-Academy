import { Submission } from '@/types/submissions'
import { cn } from '@/lib/utils'
import { CheckCircle, Clock, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface SubmissionCardProps {
  submission: Submission
  index: number
  total: number // Added to correctly display practice number if needed (e.g. descending)
  onClick: () => void
}

export function SubmissionCard({ submission, index, total, onClick }: SubmissionCardProps) {
  const isReviewed = submission.status === 'reviewed'
  
  // Format based on the first image "PRÁCTICA 1", "TÉCNICA IMPLEMENTADA", "Notas técnicas"
  // The first image shows a card with:
  // Left: Image
  // Right: 
  //   - "PRÁCTICA X" (small)
  //   - "TÉCNICA IMPLEMENTADA" (Bold Title)
  //   - "Notas técnicas" (smaller text)
  // Botton Badge (on the left image part): "EN PROCESO DE REVISIÓN" or "RETROALIMENTACIÓN"

  return (
    <div 
      className="group relative w-full h-[140px] mb-4 cursor-pointer overflow-hidden rounded-sm shadow-xl transition-transform hover:scale-[1.01]"
      onClick={onClick}
    >
      <div className="flex h-full w-full bg-[#161616]">
        
        {/* Left: Image Container (approx 35-40%) */}
        <div className="relative w-[140px] sm:w-[160px] h-full flex-shrink-0">
           {submission.image_url ? (
             <Image 
               src={submission.image_url} 
               alt="Corte" 
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
             />
           ) : (
             <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                <span className="text-white/20 text-[10px]">SIN FOTO</span>
             </div>
           )}
           
           {/* Gradient Overlay on Image */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

           {/* Status Badge - Absolute Bottom Left of the whole card context usually, but here inside image area matches design */}
           <div className={cn(
             "absolute bottom-0 left-0 right-0 py-1.5 px-3 flex items-center justify-center z-20 text-center border-t border-white/10",
             isReviewed ? "bg-[#1E3A27]" : "bg-[#C4C4BC]"
           )}>
              <div className="flex items-center gap-1">
                 <span className={cn(
                   "text-[9px] font-bold uppercase tracking-widest",
                   isReviewed ? "text-white" : "text-[#4A4A44]"
                 )}>
                   {isReviewed ? "RETROALIMENTACIÓN" : "EN PROCESO DE REVISIÓN"}
                 </span>
                 {isReviewed && <ChevronDown size={10} className="text-[#D4AF37]" />}
              </div>
           </div>
        </div>

        {/* Right: Content Area with Angled Background (100% fill like first image) */}
        <div className="relative flex-1 h-full z-10 ml-0 overflow-hidden"> 
           {/* Background Shape */}
           <div className="absolute inset-0 bg-[#8C8C84]" 
                style={{ 
                   clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' 
                }}>
           </div>
           
           {/* Decorative Black Corner on Right if needed, but first image shows the card simply ending with the slant revealing the black background BEHIND it. 
               Wait, the image shows the grey shape CUTTING into the black.
               Let's stick to the polygon clipping the grey shape.
           */}

           {/* Text Content */}
           <div className="relative z-20 pl-6 pr-10 h-full flex flex-col justify-center items-start text-[#1A2E1A]">
              
              {/* Top Label */}
              <span className="font-medium text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1 mix-blend-multiply">
                PRÁCTICA {total - index}
              </span>

              {/* Main Title */}
              <div className="mb-1 leading-none">
                 <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tighter text-[#1A2E1A] drop-shadow-sm leading-none">
                   TÉCNICA IMPLEMENTADA
                 </h3>
                 <p className="font-bold text-[11px] uppercase tracking-wider text-[#1A2E1A]/80 mt-1">
                   {submission.cut_type || 'SIN TIPO'}
                 </p>
              </div>

              {/* Notes / Description */}
              <p className="text-[10px] font-medium leading-tight text-[#1A2E1A]/60 line-clamp-2 max-w-[200px] mt-2">
                 {submission.description || 'Notas técnicas...'}
              </p>

           </div>
        </div>

      </div>
    </div>
  )
}
