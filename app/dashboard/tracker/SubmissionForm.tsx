'use client'

/**
 * SubmissionForm — Implementación 1:1 del diseño Figma
 * Figma node-id: 2132-36
 *
 * Encapsula el estado del formulario (preview, loading) y la lógica de upload.
 * Cuando el envío es exitoso, dispara `onSubmitSuccess`.
 */

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { uploadSubmission } from './actions'

// ─────────────────────────────────────────────────────────────────────────────
// Seguridad client-side: primera línea de defensa (NO reemplaza la validación
// en el servidor). Filtra archivos evidentemente inválidos antes de enviarlos.
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/tiff',
])

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'gif', 'bmp', 'tiff',
])

/** 15 MB */
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

function validateImageFile(file: File): string | null {
  if (file.size === 0) return 'El archivo está vacío'
  if (file.size > MAX_FILE_SIZE_BYTES)
    return `El archivo supera el límite de ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`

  const mimeType = file.type.toLowerCase()
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType))
    return `Tipo de archivo no permitido (${mimeType}). Solo imágenes.`

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.has(ext))
    return `Extensión no permitida (.${ext}). Solo imágenes.`

  return null // ✅ válido
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const CUT_TYPES = [
  { value: 'Low Fade',    label: 'Low Fade' },
  { value: 'Mid Fade',    label: 'Mid Fade' },
  { value: 'High Fade',   label: 'High Fade' },
  { value: 'Taper Fade',  label: 'Taper Fade' },
  { value: 'Buzz Cut',    label: 'Buzz Cut' },
  { value: 'Scissor Cut', label: 'Corte a Tijera' },
]

interface SubmissionFormProps {
  onSubmitSuccess: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// SubmitButton — componente separado para poder usar useFormStatus.
//
// ¿Por qué no funciona useState para el spinner?
// En React 19, al usar `action={asyncFn}` en un <form>, React ejecuta la
// función dentro de una TRANSICIÓN implícita. El estado intermedio de
// `setLoading(true)` se puede agrupar con `setLoading(false)` en un solo
// ciclo de render, por lo que el spinner nunca se pinta.
//
// `useFormStatus` es gestionado internamente por React y SÍ refleja el
// estado `pending` de forma fiable durante la ejecución del form action.
// ─────────────────────────────────────────────────────────────────────────────
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <div className="relative w-[360px] mx-auto mt-2 h-[41px]">
      {/* Imagen del botón como fondo (gradiente dorado) */}
      <Image
        src="/assets/dashboard/tracker/SubmissionForm/bg-button.png"
        fill
        alt=""
        className="object-fill"
      />
      <button
        type="submit"
        disabled={pending}
        className="relative z-10 w-full h-full font-montserrat font-bold text-[#161616] text-[clamp(11px,3.5vw,15px)] text-center tracking-[0.9px] disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            ENVIANDO...
          </>
        ) : (
          'PRESENTAR PARA EVALUACIÓN'
        )}
      </button>
    </div>
  )
}

export function SubmissionForm({ onSubmitSuccess }: SubmissionFormProps) {
  const [preview, setPreview]         = useState<string | null>(null)
  const [selectedCut, setSelectedCut] = useState('')
  const [fileError, setFileError]     = useState<string | null>(null)
  const formRef        = useRef<HTMLFormElement>(null)
  /**
   * Guardia de doble envío.
   * `useState` no es suficiente: el valor del estado no está actualizado
   * síncronamente dentro del mismo ciclo de render, pero un `useRef` sí.
   * Esto evita que un tap rápido dispare dos llamadas al servidor.
   */
  const isSubmittingRef = useRef(false)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validación client-side inmediata
    const error = validateImageFile(file)
    if (error) {
      setFileError(error)
      setPreview(null)
      e.target.value = '' // limpiar el input para que el usuario pueda reseleccionar
      return
    }

    setFileError(null)
    setPreview(URL.createObjectURL(file))
  }

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setPreview(null)
    setFileError(null)
    const input = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement
    if (input) input.value = ''
  }

  async function handleSubmit(formData: FormData) {
    // Guardia de doble envío (ref se actualiza síncronamente, antes del re-render)
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    try {
      await uploadSubmission(formData)
      setPreview(null)
      setSelectedCut('')
      setFileError(null)
      formRef.current?.reset()
      onSubmitSuccess()
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Error al subir la práctica'
      alert(message)
    } finally {
      isSubmittingRef.current = false
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#161616]">
      <form ref={formRef} action={handleSubmit}>

        {/* ══════════════════════════════════════════════════════════════════
            CARD — fondo beige (#d3cbba @ 60%) sobre oscuro
            Dimensiones Figma: 333px ancho × 466px alto en un frame de ~359px
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative w-[360px] mx-auto">

          {/* Capa beige — posicionada absolute para no alterar el flujo */}
          <div className="absolute inset-0 bg-[#d3cbba] opacity-60 pointer-events-none" />

          {/* Contenido de la card */}
          <div className="relative z-10 flex flex-col items-center pt-[14px] pb-7">

            {/* ── TÍTULO ── */}
            {/* Figma: Poppins ExtraBold 24px, color #1e3a27 */}
            <h2 className="font-montserrat font-extrabold !text-[#1e3a27] text-[22px] text-center leading-normal tracking-tight px-5">
              ENTREGA DE EVIDENCIA
            </h2>

            {/* ── SUBTÍTULO ── */}
            {/* Figma: Poppins ExtraLight 9px, color #d3cbba, tracking 0.81px */}
            <p className="mt-[10px] font-montserrat font-extralight text-[#d3cbba] text-[9px] text-center tracking-[0.81px]">
              REGISTRO VISUAL
            </p>

            {/* ══════════════════════════════════════════════════════════════
                ZONA DE UPLOAD
                Figma: w=279.5px en frame 359px → 77.9% | aspecto 279:162
            ═══════════════════════════════════════════════════════════════ */}
            <div
              className="relative mt-5 w-[77.9%]"
              style={{ aspectRatio: '279 / 162' }}
            >
              {/* Fondo oscuro + contenido del upload */}
              <div className="absolute inset-0 bg-[rgba(22,22,22,0.64)] z-0">
                {!preview ? (
                  <div className="flex flex-col items-center justify-center h-full gap-[5px]">

                    {/* Silueta — Figma: 49×70px, centered */}
                    <div className="relative" style={{ width: '22%', aspectRatio: '49 / 70' }}>
                      <Image
                        src="/assets/dashboard/tracker/SubmissionForm/icon-hombre-upload.png"
                        fill
                        alt="Subir corte"
                        className="object-contain"
                      />
                    </div>

                    {/* Label "NUEVO CORTE" — Figma: Poppins Bold 14px, #161616 */}
                    <p className="font-montserrat font-extrabold text-[#161616] text-[clamp(10px,3.2vw,14px)] text-center leading-none">
                      NUEVO CORTE
                    </p>

                    {/* Botón "Subir archivo" — Figma: caja negra 21px + borde + texto 9px */}
                    <div className="flex items-stretch h-[21px] mt-[3px]">
                      {/* Cuadrado negro con ícono */}
                      <div className="bg-[#161616] w-[21px] flex items-center justify-center flex-shrink-0">
                        <div className="relative w-[15px] h-[15px]">
                          <Image
                            src="/assets/dashboard/tracker/SubmissionForm/icon_upload.png"
                            fill
                            alt=""
                            className="object-contain opacity-75"
                          />
                        </div>
                      </div>
                      {/* Rectangulo borde + texto */}
                      <div
                        className="h-full flex items-center px-3"
                        style={{ border: '0.2px solid #161616' }}
                      >
                        <span className="font-montserrat text-[#161616] text-[8px] whitespace-nowrap">
                          Subir archivo
                        </span>
                      </div>
                    </div>

                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Marco / corner brackets — overlay sobre todo */}
              <Image
                src="/assets/dashboard/tracker/SubmissionForm/marco-foto.png"
                fill
                alt=""
                className="object-fill pointer-events-none z-10"
              />

              {/* Input file — cubre inset completo */}
              {/* accept limita el selector nativo; la validación real ocurre en JS y el servidor */}
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/gif,image/bmp,image/tiff,.jpg,.jpeg,.png,.webp,.heic,.heif,.gif,.bmp,.tiff"
                required
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
              />

              {/* Botón limpiar (solo con preview activo) */}
              {preview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 z-30 bg-red-900/80 text-white text-[10px] leading-none px-1.5 py-1 hover:bg-red-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ── Error de archivo ──────────────────────────────────── */}
            {fileError && (
              <p className="mt-2 w-[77.9%] text-[10px] font-montserrat text-red-400 text-center leading-snug">
                ⚠ {fileError}
              </p>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN DE INPUTS
                Figma: left=50px w=257px en frame 359px → 71.6% del ancho
                Gap desde upload zone: 28px (274px - 246px)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="w-[71.6%] mt-[28px] flex flex-col">

              {/* ── TÉCNICA IMPLEMENTADA ───────────────────────────────── */}
              <div>
                {/* Barra header — Figma: #1c3123, h=28px, sombra */}
                <div
                  className="w-full h-[28px] flex items-center justify-center"
                  style={{
                    backgroundColor: '#1c3123',
                    boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                  }}
                >
                  <p className="font-montserrat font-medium text-[#d3cbba] text-[11px] text-center leading-[1.3] tracking-tight">
                    TÉCNICA IMPLEMENTADA
                  </p>
                </div>

                {/* Área del select — custom UI + select nativo invisible encima */}
                {/* Figma: rgba(28,49,35,0.45), h=24px */}
                <div
                  className="relative w-full h-[24px] flex items-center justify-between px-2"
                  style={{ backgroundColor: 'rgba(28,49,35,0.45)' }}
                >
                  {/* Texto dinámico */}
                  <span className="font-montserrat font-light text-[#d3cbba] text-[8px] pointer-events-none">
                    {selectedCut
                      ? CUT_TYPES.find(c => c.value === selectedCut)?.label ?? 'Selecciona Tipo de Corte'
                      : 'Selecciona Tipo de Corte'}
                  </span>
                  {/* Flecha — Figma: icon-seleccionar rotado 90° */}
                  <div className="relative w-[6px] h-[6px] flex-shrink-0 pointer-events-none" style={{ transform: 'rotate(90deg)' }}>
                    <Image
                      src="/assets/dashboard/tracker/SubmissionForm/icon-seleccionar.png"
                      fill
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  {/* Select nativo — transparente, cubre toda el área para interacción */}
                  <select
                    name="cutType"
                    required
                    value={selectedCut}
                    onChange={e => setSelectedCut(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  >
                    <option value="" disabled>Selecciona Tipo de Corte</option>
                    {CUT_TYPES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── NOTAS TÉCNICAS ────────────────────────────────────── */}
              {/* Gap desde técnica: 342 - 326 = 16px */}
              <div className="mt-[16px]">
                {/* Barra header */}
                <div
                  className="w-full h-[28px] flex items-center justify-center"
                  style={{
                    backgroundColor: '#1c3123',
                    boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                  }}
                >
                  <p className="font-montserrat font-medium text-[#d3cbba] text-[11px] text-center leading-[1.3]">
                    NOTAS TÉCNICAS
                  </p>
                </div>

                {/* Textarea — Figma: border #575d51 0.4px, h=64px */}
                {/* Placeholder: Poppins Regular 8px, #1e3a27 @ 50% opacity, text-justify */}
                <div style={{ border: '0.4px solid #575d51' }}>
                  <textarea
                    name="description"
                    required
                    placeholder="Describe brevemente el proceso realizado, herramientas utilizadas y consideraciones profesionales aplicadas..."
                    className="w-full min-h-[64px] bg-transparent text-[#1e3a27] text-[8px] font-montserrat font-normal p-2 focus:outline-none resize-none leading-relaxed placeholder:text-[#1e3a27]/50 text-justify tracking-[-0.4px]"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BOTÓN SUBMIT — usa <SubmitButton> con useFormStatus (React 19)
            Figma: left=13px w=333px h=41px, bg-button.png como fondo
            Gap desde card: 474px - 466px = 8px → mt-2
        ═══════════════════════════════════════════════════════════════════ */}
        <SubmitButton />

      </form>
    </div>
  )
}
