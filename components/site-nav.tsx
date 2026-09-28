import Link from "next/link"
import { Terminal, FileDown } from "lucide-react"
import { LinkedInIcon } from "./linkedin-icon"

export function SiteNav() {
  return (
    <header className="border-b-2 border-forest/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-forest"
          aria-label="Shashwat Mishra home"
        >
          <span className="flex h-8 w-8 items-center justify-center border-2 border-forest bg-cream">
            <Terminal className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="heading text-[0.6rem] leading-tight sm:text-[0.7rem]">
            S. MISHRA
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/#work"
            className="hidden text-sm font-bold uppercase tracking-wide text-forest hover:text-mustard md:inline"
          >
            Work
          </Link>
          <Link
            href="/#about"
            className="hidden text-sm font-bold uppercase tracking-wide text-forest hover:text-mustard md:inline"
          >
            About
          </Link>

          <div className="flex items-center gap-1.5">
            <a
              href="/shashwat-mishra-resume.pdf"
              download
              className="flex h-8 w-8 items-center justify-center rounded border-2 border-forest text-forest transition-transform hover:translate-x-[1px] hover:translate-y-[1px]"
              aria-label="Download resume"
            >
              <FileDown className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/shashwat-mishra-6428a1162/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded border-2 border-forest text-forest transition-transform hover:translate-x-[1px] hover:translate-y-[1px]"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
            </a>
          </div>

          <a href="mailto:shashwat2022@email.iimcal.ac.in" className="btn-cta">
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
