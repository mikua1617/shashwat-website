import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export function Pill({
  icon: Icon,
  children,
  className = "",
}: {
  icon?: LucideIcon
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`pill ${className}`}>
      {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
