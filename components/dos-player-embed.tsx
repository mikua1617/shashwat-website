"use client"

import dynamic from "next/dynamic"

// `ssr: false` must live in a Client Component in Next.js 16. This wrapper
// dynamically loads the js-dos player so the emulator only ever runs in the
// browser, never during server rendering.
const DosPlayer = dynamic(
  () => import("@/components/dos-player").then((m) => m.DosPlayer),
  { ssr: false, loading: () => <PlayerSkeleton /> }
)

function PlayerSkeleton() {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded border-2 border-forest bg-ink text-mustard/70">
      <span className="font-mono text-xs">Loading emulator...</span>
    </div>
  )
}

export function DosPlayerEmbed() {
  return <DosPlayer />
}
