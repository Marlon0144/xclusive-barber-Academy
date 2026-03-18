'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface EditableTextProps {
  initialText: string
  onSave: (newText: string) => Promise<void>
  className?: string
}

export default function EditableText({ initialText, onSave, className = '' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(initialText)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Foco automático al editar
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (text.trim() === initialText) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    await onSave(text)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setText(initialText)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className="bg-black/50 text-white px-3 py-1.5 rounded-sm border border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 w-full max-w-xs text-sm font-serif placeholder:text-zinc-600"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="p-1.5 bg-green-900/50 text-green-400 hover:bg-green-500/20 rounded-sm border border-green-500/30 transition-colors"
        >
          <Check size={14} />
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="p-1.5 bg-red-900/50 text-red-400 hover:bg-red-500/20 rounded-sm border border-red-500/30 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 group/edit", className)}>
      <span className="truncate">{initialText}</span>
      <button
        onClick={(e) => {
          e.stopPropagation() // Evita abrir el acordeón
          setIsEditing(true)
        }}
        className="opacity-60 md:opacity-0 group-hover/edit:opacity-100 p-1.5 md:p-1 text-zinc-500 hover:text-gold-500 transition-all duration-300 min-w-[28px] min-h-[28px] md:min-w-0 md:min-h-0 flex items-center justify-center"
        title="Renombrar"
      >
        <Edit2 size={12} />
      </button>
    </div>
  )
}