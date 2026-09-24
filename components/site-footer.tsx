import { Mail, FileDown } from "lucide-react"
import { LinkedInIcon } from "./linkedin-icon"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-forest/70">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="heading text-[0.7rem]">SHASHWAT MISHRA</p>
            <p className="mt-2 text-sm text-forest/80">
              Product marketer who builds. Let&apos;s talk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/shashwat-mishra-resume.pdf" download className="btn-cta">
              <FileDown className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Resume
            </a>
            <a
              href="mailto:shashwat2022@email.iimcal.ac.in"
              className="btn-ghost"
              aria-label="Email Shashwat Mishra"
            >
              <Mail className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/shashwat-mishra-6428a1162/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded border-2 border-forest text-forest shadow-[3px_3px_0_rgba(31,92,51,0.25)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px]"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-forest/60">
          {"// built with next.js + typescript + tailwind — no template, just intent"}
        </p>
      </div>
    </footer>
  )
}
