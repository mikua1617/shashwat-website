import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Panel } from "./panel"
import { Pill } from "./pill"
import { SiteNav } from "./site-nav"
import { SiteFooter } from "./site-footer"

export type MetaPill = {
  label: string
  icon?: import("lucide-react").LucideIcon
}

export function CaseStudyShell({
  title,
  intro,
  pills,
  children,
}: {
  title: string
  intro: string
  pills: MetaPill[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-forest hover:text-mustard"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Back to work
        </Link>

        <Panel className="mt-6 p-6 text-center sm:p-10">
          <h1 className="heading mx-auto text-lg leading-relaxed sm:text-2xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-forest/85 sm:text-base">
            {intro}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {pills.map((p) => (
              <Pill key={p.label} icon={p.icon}>
                {p.label}
              </Pill>
            ))}
          </div>
        </Panel>

        <div className="mt-10 space-y-10">{children}</div>
      </main>

      <SiteFooter />
    </div>
  )
}

export function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Panel className="p-6 sm:p-8">
      <h2 className="heading text-[0.85rem] sm:text-base">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-forest/85">
        {children}
      </div>
    </Panel>
  )
}
