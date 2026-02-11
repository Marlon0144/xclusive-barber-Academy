'use client'

// 1. IMPORTAMOS SOLO LO QUE FUNCIONA (Core Editor)
import { useEditor, EditorContent } from '@tiptap/react'
import EditorToolbar from './EditorToolbar' // Nuestra barra fija confiable

// 2. EXTENSIONES (Lógica)
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import YoutubeExtension from '@tiptap/extension-youtube'

import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const supabase = createClient()

  // --- LÓGICA DE SUBIDA DE IMÁGENES ---
  const uploadImage = useCallback(async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`

    // Subir
    const { error } = await supabase.storage.from('course_content').upload(fileName, file)
    if (error) {
      console.error('Error subiendo imagen:', error)
      return null
    }

    // Obtener URL
    const { data } = supabase.storage.from('course_content').getPublicUrl(fileName)
    return data.publicUrl
  }, [supabase])

  // Hook para el botón de la barra de herramientas
  const handleAddImage = useCallback(() => {
    // Creamos un input invisible temporalmente
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const url = await uploadImage(file)
        // Necesitamos acceder a 'editor' aquí, pero como es callback externo,
        // usaremos una referencia o lógica interna.
        // TRUCO: Disparamos un evento personalizado o simplemente confiamos en que
        // el usuario arrastre, pero para el botón:
        // (Ver abajo como lo conectamos en el render)
      }
    }
    input.click()
  }, [uploadImage])

  // --- CONFIGURACIÓN DEL EDITOR ---
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'rounded-xl max-w-full my-6 shadow-2xl border border-gray-700' },
      }),
      YoutubeExtension.configure({ controls: false, nocookie: true }),
    ],
    content: content,
    editorProps: {
      attributes: {
        // Estilos "Pro" (Dark Mode, Tipografía limpia)
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] text-gray-300 px-8 py-6',
      },
      // DRAG & DROP DE IMÁGENES (Esto SÍ funciona y es muy útil)
      handleDrop: function (view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if ((file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp")) {
            uploadImage(file).then((url) => {
              if (url && editor) editor.chain().focus().setImage({ src: url }).run()
            });
            return true;
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Función wrapper para conectar el botón de imagen con la instancia del editor
  const onImageClick = useCallback(() => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const url = await uploadImage(file)
        if (url) editor.chain().focus().setImage({ src: url }).run()
      }
    }
    input.click()
  }, [editor, uploadImage])


  if (!editor) return null

  return (
    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-gray-950/50 shadow-inner relative group">

      {/* 1. BARRA DE HERRAMIENTAS FIJA (Estable y Funcional) */}
      <EditorToolbar editor={editor} addImage={onImageClick} />

      {/* 2. ÁREA DE EDICIÓN */}
      <EditorContent editor={editor} />

    </div>
  )
}