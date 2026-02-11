'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'

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
          className="bg-gray-800 text-white px-2 py-1 rounded border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[200px]"
        />
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="p-1 text-green-400 hover:bg-green-400/10 rounded"
        >
          <Check size={16} />
        </button>
        <button 
          onClick={handleCancel} 
          disabled={isSaving}
          className="p-1 text-red-400 hover:bg-red-400/10 rounded"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 group/edit ${className}`}>
      <span className="font-medium truncate">{initialText}</span>
      <button
        onClick={(e) => {
          e.stopPropagation() // Evita abrir el acordeón
          setIsEditing(true)
        }}
        className="opacity-0 group-hover/edit:opacity-100 p-1 text-gray-500 hover:text-blue-400 transition-opacity"
        title="Renombrar"
      >
        <Edit2 size={14} />
      </button>
    </div>
  )
}