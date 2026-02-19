import * as React from "react"
import { cn } from "@/lib/utils"

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, id, required, ...props }, ref) => {
    // Generate a random ID if none provided, for accessibility
    const inputId = id || React.useId()

    return (
      <div className="space-y-4 group relative">
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500 transition-colors duration-300",
              "group-focus-within:text-[#D4AF37]",
              error && "text-red-500"
            )}
          >
            {label} {required && <span className="text-[#D4AF37]">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full bg-transparent border-b border-zinc-700 px-0 py-2 text-base ring-offset-background",
            "placeholder:text-zinc-700 placeholder:font-light placeholder:tracking-wide",
            "focus-visible:outline-none focus:border-[#D4AF37] focus-visible:ring-0",
            "transition-all duration-300 ease-out",
            "text-zinc-200 font-light tracking-wide",
            error && "border-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          required={required}
          {...props}
        />
        {/* Animated bottom border effect */}
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ease-out group-focus-within:w-full" />
        
        {error && (
          <p className="text-[10px] text-red-500 font-medium tracking-wide animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
AuthInput.displayName = "AuthInput"

export { AuthInput }
