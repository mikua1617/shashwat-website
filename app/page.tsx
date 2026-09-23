import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { ProjectCard } from "@/components/project-card"
import { Panel } from "@/components/panel"
import { projects } from "@/lib/projects"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <HomeHero />

      {/* About */}
      <section id="about" className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <Panel className="p-6 sm:p-10">
          <h2 className="heading text-[0.85rem] sm:text-base">// ABOUT</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-forest/90 sm:text-base">
            <p>
              I started as an engineer — Chemical Engineering at BITS Pilani,
              then a stint writing software at a product studio. That&apos;s where I
              learned that shipping beats theorizing.
            </p>
            <p>
              From there I moved into B2B services marketing, then an MBA in
              marketing to sharpen the go-to-market side. The through-line was
              always the same: I&apos;d rather build the thing than write a brief
              asking someone else to build it.
            </p>
            <p>
              Today I do product marketing at a BFSI-focused AI startup, where I
              build AI-driven marketing and product systems — personalization
              pipelines, fine-tuned models, research agents. The positioning is
              simple: a marketer who ships real automation and technical systems,
              not just campaigns.
            </p>
          </div>
        </Panel>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="heading text-[0.85rem] sm:text-base">// SELECTED WORK</h2>
          <span className="text-xs text-forest/60">{`[${projects.length}] projects`}</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
