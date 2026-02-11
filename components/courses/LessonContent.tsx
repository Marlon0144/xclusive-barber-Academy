'use client'

import DOMPurify from 'isomorphic-dompurify'

interface LessonContentProps {
  content: string | null 
}

export default function LessonContent({ content }: LessonContentProps) {
  if (!content) return null

  // CORRECCIÓN: Usamos una sola configuración que permite IFRAMES
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'], // Permitir la etiqueta iframe
    ADD_ATTR: [
      'allow', 
      'allowfullscreen', 
      'frameborder', 
      'scrolling', 
      'src', 
      'width', 
      'height',
      'title',
      'data-youtube-video' // Atributo específico de Tiptap
    ],
  })

  return (
    <div 
      className="
        prose 
        max-w-none 
        
        /* Colores del texto */
        prose-headings:text-white 
        prose-p:text-gray-300 
        prose-strong:text-yellow-400 
        prose-ul:text-gray-300
        prose-li:marker:text-blue-500
        prose-a:text-blue-400

        /* Mantenemos la inversión por si acaso */
        dark:prose-invert

        /* --- CLASES MAGICAS PARA EL VIDEO --- */
        /* Esto hace que el iframe ocupe todo el ancho y tenga proporción de video */
        [&_iframe]:w-full 
        [&_iframe]:aspect-video 
        [&_iframe]:rounded-xl 
        [&_iframe]:my-6
        [&_iframe]:shadow-lg
      "
      // CORRECCIÓN: Aquí usamos la variable correcta 'sanitizedContent'
      dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
    />
  )
}