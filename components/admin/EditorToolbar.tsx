'use client'

import { type Editor } from '@tiptap/react'
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Undo, Redo, Image as ImageIcon, Youtube // Asegúrate de importar Youtube icono
} from 'lucide-react'
import { useLanguage } from '@/components/i18n/LanguageProvider'

interface EditorToolbarProps {
  editor: Editor | null
  addImage: () => void
}

export default function EditorToolbar({ editor, addImage }: EditorToolbarProps) {
  const { dictionary } = useLanguage()
  const tb = dictionary.dashboard.adminToolbar
  if (!editor) return null

  const btnClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`

  // Función específica para añadir video
  const addYoutubeVideo = () => {
    const url = window.prompt(tb.youtubePrompt)
    
    if (url) {
      // Validación básica
      if (!url.includes('youtube') && !url.includes('youtu.be')) {
        alert(tb.youtubeInvalid)
        return
      }
      
      editor.chain().focus().setYoutubeVideo({ 
        src: url, 
        width: 640, 
        height: 480 
      }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      
      {/* ... (Botones de texto iguales que antes: Bold, Italic, etc.) ... */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title={tb.bold}><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title={tb.italic}><Italic size={18} /></button>
      <div className="w-px h-6 bg-gray-700 mx-2" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title={tb.h1}><Heading1 size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title={tb.h2}><Heading2 size={18} /></button>
      <div className="w-px h-6 bg-gray-700 mx-2" />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title={tb.list}><List size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title={tb.listNumbered} ><ListOrdered size={18} /></button>
      <div className="w-px h-6 bg-gray-700 mx-2" />

      {/* --- BOTONES DE INSERTAR --- */}
      <button onClick={addImage} className={btnClass(false)} title={tb.insertImage}>
        <ImageIcon size={18} />
      </button>
      
      {/* BOTÓN DE YOUTUBE CORREGIDO */}
      <button 
        onClick={addYoutubeVideo} 
        className={btnClass(editor.isActive('youtube'))} 
        title={tb.insertYoutube}
      >
        <Youtube size={18} />
      </button>

      <div className="flex-1" />
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 text-gray-500 hover:text-white disabled:opacity-30"><Undo size={18} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 text-gray-500 hover:text-white disabled:opacity-30"><Redo size={18} /></button>
    </div>
  )
}