import * as React from "react"
import { cn } from "@/lib/utils"

const AuthCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full max-w-md mx-auto relative overflow-hidden rounded-sm",
      "bg-[#1A1A1A] border border-zinc-800 shadow-2xl",
      className
    )}
    {...props}
  />
))
AuthCard.displayName = "AuthCard"

const AuthCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 md:p-10 pb-0 md:pb-0 text-center", className)}
    {...props}
  />
))
AuthCardHeader.displayName = "AuthCardHeader"

const AuthCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 md:p-10 pt-6 md:pt-8", className)} {...props} />
))
AuthCardContent.displayName = "AuthCardContent"

export { AuthCard, AuthCardHeader, AuthCardContent }
