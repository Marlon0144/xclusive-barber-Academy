'use client'

import { type Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon,
  Youtube
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
  addImage: () => void
}

export default function EditorToolbar({ editor, addImage }: EditorToolbarProps) {
  if (!editor) return null

  // Función auxiliar para clases dinámicas
  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      
      {/* GRUPO 1: Texto Básico */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrita">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Cursiva">
        <Italic size={18} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" /> {/* Separador */}

      {/* GRUPO 2: Títulos */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Título 1">
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Título 2">
        <Heading2 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* GRUPO 3: Listas y Citas */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Lista Puntos">
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Lista Números">
        <ListOrdered size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Cita">
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* GRUPO 4: Insertar */}
      <button onClick={addImage} className={btnClass(false)} title="Insertar Imagen">
        <ImageIcon size={18} />
      </button>
      <button onClick={() => {
        const url = window.prompt('URL del video de YouTube:')
        if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
      }} className={btnClass(editor.isActive('youtube'))} title="Insertar Video">
        <Youtube size={18} />
      </button>

      <div className="flex-1" /> {/* Espaciador flexible */}

      {/* GRUPO 5: Control */}
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 text-gray-500 hover:text-white disabled:opacity-30">
        <Undo size={18} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 text-gray-500 hover:text-white disabled:opacity-30">
        <Redo size={18} />
      </button>
    </div>
  )
}