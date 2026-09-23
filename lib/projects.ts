export type Project = {
  slug: string
  title: string
  hook: string
  metric?: string
  category: string
  tags: string[]
  hasDemo: boolean
}

export const projects: Project[] = [
  {
    slug: "the-collector",
    title: "The Collector",
    hook: "A maze game I built at 15 in Borland Turbo C++ — still playable today, in your browser.",
    metric: "Est. 2010",
    category: "Builder Origin",
    tags: ["Turbo C++", "DOS", "js-dos"],
    hasDemo: true,
  },
  {
    slug: "personalization",
    title: "Personalization Pipeline",
    hook: "AI-driven outreach personalization for outbound email — research, personalize, draft.",
    metric: "+50–70% open rate",
    category: "AI Automation",
    tags: ["Python", "LLM", "Scraping"],
    hasDemo: true,
  },
  {
    slug: "writing-style-llm",
    title: "Writing Style LLM",
    hook: "Fine-tuned an open-weight model on my own writing corpus to reproduce my voice.",
    metric: "LoRA fine-tune",
    category: "Applied ML",
    tags: ["LoRA", "Fine-tuning", "Eval"],
    hasDemo: false,
  },
  {
    slug: "competitive-search",
    title: "Competitive Search Agent",
    hook: "A live AI agent that researches and summarizes competitor positioning in real time.",
    metric: "Live agent",
    category: "AI Agent",
    tags: ["Agent", "Scraping", "Summarize"],
    hasDemo: true,
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
