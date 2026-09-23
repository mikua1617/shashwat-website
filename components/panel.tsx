import type { ReactNode, HTMLAttributes } from "react"

type PanelProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export function Panel({ children, className = "", ...props }: PanelProps) {
  return (
    <div className={`panel ${className}`} {...props}>
      <span className="screw screw-tl" aria-hidden="true" />
      <span className="screw screw-tr" aria-hidden="true" />
      <span className="screw screw-bl" aria-hidden="true" />
      <span className="screw screw-br" aria-hidden="true" />
      {children}
    </div>
  )
}
