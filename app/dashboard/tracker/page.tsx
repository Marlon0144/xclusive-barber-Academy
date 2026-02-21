'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { uploadSubmission } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Upload, Clock, CheckCircle, Eye, Star, Camera, ChevronDown, X } from 'lucide-react'
import FeedbackModal from './FeedbackModal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Submission } from '@/types/submissions'
import Image from 'next/image'
import { SubmissionCard } from './SubmissionCard'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'

export default function TrackerPage() {
  const [loading, setLoading] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // 2. ESTADO PARA CONTROLAR EL MODAL
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  // Referencia directa al form – evita querySelector que puede agarrar otro form (ej. logout)
  const formRef = useRef<HTMLFormElement>(null)

  // singleton client – stable reference
  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching history:', error)
    } else if (data) {
      setSubmissions(data as Submission[])
    }
  }, [supabase])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setFileName(file.name)
    }
  }

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setPreview(null)
    setFileName(null)
    const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await uploadSubmission(formData)
      setPreview(null)
      setFileName(null)
      formRef.current?.reset()
      await fetchHistory()
    } catch (error) {
      console.error(error)
      alert('Error al subir la práctica')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen bg-[#161616] text-[#D3CBBA] font-sans pb-20 overflow-x-hidden selection:bg-gold-500/30'>
      
      {/* NAV HEADER - Dark variant (sticky) */}
      <DashboardPageHeader title="Evolución Profesional" />

      {/* Background Effects */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        {/* Subtle texture overlay - consistent with other pages if they have it, or just clean */}
        
        {/* Ambient gradients matching design - made more subtle */}
        <div className='absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-950/20 blur-[120px] rounded-full'></div>
        <div className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-600/5 blur-[120px] rounded-full'></div>
      </div>

      {/* MODAL */}
      {selectedSubmission && (
        <FeedbackModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {/* TOP NAVIGATION & COURSE BANNER */}
      <div className='relative z-20 pt-6 px-6 flex flex-col items-center w-full'>
         {/* Back Arrow */}
         <button className='absolute top-6 left-6 text-[#d3cbba] hover:text-white transition-colors' onClick={() => window.history.back()}>
            <Image 
               src="/assets/login/icon-arrow-back.png" 
               alt="Back" 
               width={24} 
               height={24}
               className="opacity-80 hover:opacity-100 transition-opacity"
            />
         </button>

         {/* Course Name Banner */}
         <div className="w-full max-w-md bg-[#0F1F15] border border-[#1E3A27] py-6 px-4 mb-10 text-center shadow-lg">
            <h2 className="font-serif font-bold text-[#D4AF37] text-xl tracking-wider mb-1">
              NOMBRE DEL CURSO
            </h2>
            <p className="text-[#5A7A66] text-[10px] uppercase tracking-[0.2em] font-light">
              Formación Profesional en Barbería
            </p>
         </div>
      </div>

      {/* HEADER CONTENT */}
      <header className='relative z-10 flex flex-col items-center text-center px-6'>
        
        {/* Title Group */}
        <div className='relative mb-6'>
           <h1 className='font-serif font-bold text-[#E5E5E5] text-2xl md:text-3xl tracking-wide leading-tight drop-shadow-sm uppercase'>
            Seguimiento y<br/>Evaluación
          </h1>
          {/* Gold Underline */}
          <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-4"></div>
        </div>
        
        {/* Description */}
        <p className='font-light text-[#d3cbba]/80 text-[11px] text-center max-w-[340px] leading-relaxed mb-8'>
          Revisa observaciones, evaluaciones y retroalimentación profesional sobre tu desempeño y evolución dentro del programa.
        </p>

        {/* Gold Square Icon */}
        <div className='w-4 h-4 bg-gradient-to-b from-[#D4AF37] to-[#8C721F] shadow-[0_0_15px_rgba(212,175,55,0.4)] rotate-45 mb-10'></div>
      </header>

      <div className='relative z-10 px-6 pb-20 max-w-lg mx-auto'>
        
        {/* HERO / CONTEXT SECTION */}
        <div className='flex flex-col items-center mb-10'>
          {/* Dark Button Label */}
          <div className='relative w-full max-w-[280px] py-4 bg-[#111] border border-[#222] shadow-black/50 shadow-lg mb-8 mx-auto flex items-center justify-center rounded-sm'>
             <p className='font-montserrat font-medium text-[#888] text-[10px] tracking-[3px] text-center uppercase'>
               Formación Profesional
             </p>
          </div>

          <p className='font-serif font-bold text-[#E5E5E5] text-xl text-center mb-3 tracking-widest uppercase'>
            Entrega de Evidencia
          </p>
          
          <p className='font-light text-[#d3cbba]/60 text-[10px] tracking-wider text-center max-w-[300px] leading-relaxed uppercase'>
            ENVÍA TU PRÁCTICA, RECIBE EVALUACIÓN PROFESIONAL Y ELEVA TU ESTÁNDAR TÉCNICO.
          </p>
        </div>

        {/* FORM SECTION */}
        <section className='relative mb-16 w-full max-w-[360px] mx-auto'>
          
          {/* Main Card Container matching the reference color (taupe/grey) */}
          <div className='bg-[#8C8C84] rounded-sm p-1 pb-16 shadow-2xl relative overflow-hidden'>
             
             {/* Header inside card */}
             <div className="pt-8 pb-4 text-center">
                <h3 className="font-montserrat font-black text-[#1A2E1A] text-2xl uppercase tracking-tighter shadow-sm">
                   ENTREGA DE EVIDENCIA
                </h3>
                <p className="text-[#E5E5E5]/60 text-[9px] font-light tracking-[0.2em] mt-2 uppercase">
                   REGISTRO VISUAL
                </p>
             </div>

             <form ref={formRef} action={handleSubmit} className='flex flex-col items-center space-y-6 px-4'>
            
              {/* Image Upload Area with Brackets */}
              <div className='w-full relative py-2'>
                 {/* Corner Brackets */}
                 <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#D9D9D9]/40 -translate-x-1 -translate-y-1"></div>
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#D9D9D9]/40 translate-x-1 -translate-y-1"></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#D9D9D9]/40 -translate-x-1 translate-y-1"></div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#D9D9D9]/40 translate-x-1 translate-y-1"></div>

                 <div className='relative aspect-video w-full group cursor-pointer bg-[#3A3A3A] shadow-inner'>
                    {/* Background/Preview */}
                    <div className="absolute inset-2 bg-[#252525] flex flex-col items-center justify-center overflow-hidden border border-white/5">
                       {preview ? (
                         <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex flex-col items-center opacity-40">
                            {/* Icon placeholder */}
                            <div className="w-16 h-16 bg-black rounded-full mb-2 blur-[1px]"></div> 
                            <Upload size={32} className="text-[#666] mb-2" />
                         </div>
                       )}
                    </div>
                    
                    {/* Center Text Layout */}
                    {!preview && (
                      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10'>
                          <div className="mt-12 text-center">
                            <span className='block text-[#111] font-black text-lg uppercase leading-none drop-shadow-md text-stroke'>
                              NUEVO CORTE
                            </span>
                            <div className="mt-2 bg-[#333] flex items-center gap-2 px-3 py-1 border border-white/10 rounded-sm">
                               <div className="bg-[#555] rounded-full p-0.5"><Upload size={10} className="text-white"/></div>
                               <span className="text-[9px] text-[#999] uppercase tracking-wide">Subir archivo</span>
                            </div>
                          </div>
                      </div>
                    )}

                    {/* Input hidden */}
                    <input
                      type='file'
                      name='image'
                      accept='image/*'
                      required
                      onChange={handleImageChange}
                      className='absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full'
                    />
                    
                    {/* Clear Button */}
                    {preview && (
                      <button 
                        onClick={clearImage}
                        type="button" 
                        className="absolute top-4 right-4 z-30 bg-red-900/80 text-white p-1.5 hover:bg-red-700 transition-colors pointer-events-auto rounded-sm"
                      >
                        <X size={14} />
                      </button>
                    )}
                 </div>
              </div>

              {/* Inputs Container */}
              <div className='w-full space-y-5 pt-2'>
                
                {/* Technique Selection */}
                <div className='space-y-0'>
                  {/* Label Bar */}
                  <div className="bg-[#102818] py-2 px-4 shadow-lg border-b border-[#2C4835]">
                     <p className='text-[#E5E5E5] text-[11px] font-bold text-center uppercase tracking-wider'>
                       TÉCNICA IMPLEMENTADA
                     </p>
                  </div>
                  {/* Input Area */}
                  <div className='relative h-[40px] w-full'>
                     <select 
                        name='cutType' 
                        required
                        className='w-full h-full bg-[#4A4A44] text-[#D3CBBA] text-[10px] font-medium text-center focus:outline-none appearance-none px-4 shadow-inner border-t border-black/20 cursor-pointer'
                     >
                        <option value='' className='bg-[#4A4A44]'>⊝ Selecciona Estilo de Corte</option>
                        <option value='Low Fade' className='bg-[#1c3123]'>Low Fade</option>
                        <option value='Mid Fade' className='bg-[#1c3123]'>Mid Fade</option>
                        <option value='High Fade' className='bg-[#1c3123]'>High Fade</option>
                        <option value='Taper Fade' className='bg-[#1c3123]'>Taper Fade</option>
                        <option value='Buzz Cut' className='bg-[#1c3123]'>Buzz Cut</option>
                        <option value='Scissor Cut' className='bg-[#1c3123]'>Corte a Tijera</option>
                     </select>
                  </div>
                </div>

                 {/* Notes Input */}
                 <div className='space-y-0'>
                  {/* Label Bar */}
                  <div className="bg-[#102818] py-2 px-4 shadow-lg border-b border-[#2C4835]">
                     <p className='text-[#E5E5E5] text-[11px] font-bold text-center uppercase tracking-wider'>
                       NOTAS TÉCNICAS
                     </p>
                  </div>
                  {/* Textarea Area */}
                  <div className='w-full bg-[#999990] p-1 shadow-inner'>
                      <textarea
                        name='description'
                        required
                        placeholder='Describe brevemente el proceso realizado, herramientas utilizadas y consideraciones profesionales aplicadas...'
                        className='w-full h-[80px] bg-transparent text-[#1a1a1a] text-[9px] font-medium p-3 focus:outline-none resize-none placeholder:text-[#1a1a1a]/40 leading-relaxed text-center'
                      />
                  </div>
                </div>

              </div>
             </form>
             
             {/* Bottom Gold Button (Full Width of Card) */}
             <div className="absolute bottom-0 left-0 right-0">
                <Button 
                  type="button"
                  onClick={() => formRef.current?.requestSubmit()}
                  disabled={loading}
                  className='w-full h-[54px] bg-gradient-to-r from-[#C5A028] via-[#E8C547] to-[#C5A028] hover:via-[#F0D570] text-[#111] font-black tracking-[1px] text-[13px] shadow-[0_-5px_15px_rgba(0,0,0,0.2)] rounded-none uppercase transition-all duration-300 border-t border-[#FFF8E6]/20'
                >
                  {loading ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='animate-spin w-4 h-4'/> ENVIANDO...
                    </span>
                  ) : (
                    'PRESENTAR PARA EVALUACIÓN'
                  )}
                </Button>
             </div>
          </div>
        </section>


        {/* HISTORY SECTION */}
        <section className='relative mt-20 px-4'>
           {/* Section Title */}
           <div className='relative flex flex-col items-center mb-12'>
              <h2 className='text-[#d3cbba] font-serif font-bold text-[18px] text-center tracking-wide uppercase border-b border-[#d3cbba]/20 pb-4 w-full'>
                HISTORIAL DE PRÁCTICAS
              </h2>
           </div>

           {/* List */}
           <div className='space-y-4 relative px-2 max-w-md mx-auto'>
              
              {submissions.length === 0 ? (
                 <div className="py-12 text-center border border-dashed border-[#d3cbba]/10 rounded-lg bg-white/5 mx-4">
                    <p className='text-[#d3cbba]/40 text-[10px] uppercase tracking-widest'>No hay prácticas registradas</p>
                 </div>
              ) : (
                submissions.map((sub, index) => (
                  <SubmissionCard 
                    key={sub.id}
                    submission={sub}
                    index={index}
                    total={submissions.length}
                    onClick={() => sub.status === 'reviewed' && setSelectedSubmission(sub)}
                  />
                ))
              )}

           </div>

        </section>
      </div>

    </div>
  )
}
