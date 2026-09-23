import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"
import { Panel } from "./panel"
import { Pill } from "./pill"
import type { Project } from "@/lib/projects"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus:outline-none"
      aria-label={`View case study: ${project.title}`}
    >
      <Panel className="flex h-full flex-col p-6 transition-transform group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <div className="flex items-center justify-between gap-3">
          <Pill icon={Tag}>{project.category}</Pill>
          {project.metric ? (
            <span className="rounded border border-forest bg-mustard/25 px-2 py-1 text-xs font-bold text-forest">
              {project.metric}
            </span>
          ) : null}
        </div>

        <h3 className="heading mt-5 text-[0.85rem] leading-relaxed">
          {project.title}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-forest/85">
          {project.hook}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border border-forest/60 px-2 py-0.5 text-xs text-forest/75"
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-forest group-hover:text-mustard">
          Open case study
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>
      </Panel>
    </Link>
  )
}
