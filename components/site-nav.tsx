import Link from "next/link"
import { Terminal } from "lucide-react"

export function SiteNav() {
  return (
    <header className="border-b-2 border-forest/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-forest"
          aria-label="Shashwat Mishra — home"
        >
          <span className="flex h-8 w-8 items-center justify-center border-2 border-forest bg-cream">
            <Terminal className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="heading text-[0.6rem] leading-tight sm:text-[0.7rem]">
            S. MISHRA
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/#work"
            className="hidden text-sm font-bold uppercase tracking-wide text-forest hover:text-mustard sm:inline"
          >
            Work
          </Link>
          <Link
            href="/#about"
            className="hidden text-sm font-bold uppercase tracking-wide text-forest hover:text-mustard sm:inline"
          >
            About
          </Link>
          <a href="mailto:shashwat@example.com" className="btn-cta">
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
