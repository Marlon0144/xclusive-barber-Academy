'use client' // Necesario porque dompurify se ejecuta mejor en el cliente o requiere manejo específico

import DOMPurify from 'isomorphic-dompurify'

interface LessonContentProps {
  content: string | null // Puede venir null de la BD
}

export default function LessonContent({ content }: LessonContentProps) {
  if (!content) return null

  // 1. Sanitizamos el HTML (Limpiamos scripts maliciosos)
  const cleanHTML = DOMPurify.sanitize(content)

  return (
    // 2. Usamos la clase 'prose' de Tailwind Typography
    // prose-invert es para modo oscuro (si lo usas), prose-slate da colores neutros
    <div 
    className="
      prose 
      max-w-none 
      
      /* Forzamos colores claros para todo */
      prose-headings:text-white 
      prose-p:text-gray-300 
      prose-strong:text-yellow-400 
      prose-ul:text-gray-300
      prose-li:marker:text-blue-500

      /* Mantenemos la inversión por si acaso */
      dark:prose-invert
    "
    dangerouslySetInnerHTML={{ __html: cleanHTML }} 
    />
  )
}