"use client"

import { useState } from "react"
import { Play, Gamepad2, Loader2 } from "lucide-react"

// Client-only shell for the js-dos player. The real integration mounts the
// original compiled Turbo C++ binary via js-dos; until the .jsdos bundle is
// wired up this renders a placeholder "insert cartridge" screen.
export function DosPlayer() {
  const [state, setState] = useState<"idle" | "booting" | "unavailable">("idle")

  function handlePlay() {
    setState("booting")
    // Placeholder boot sequence — swap for js-dos `emulators` mount when the
    // .jsdos bundle is available.
    setTimeout(() => setState("unavailable"), 1800)
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded border-2 border-forest bg-ink text-mustard">
      {/* scanline sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(240,180,41,0.25) 3px)",
        }}
      />

      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center font-mono">
        {state === "idle" && (
          <>
            <Gamepad2 className="h-10 w-10" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.2em] text-mustard/80">
              Shaved Adlabs Productions
            </p>
            <p className="heading text-mustard text-sm sm:text-base">THE COLLECTOR</p>
            <p className="max-w-sm text-xs leading-relaxed text-mustard/70">
              Original DOS binary, compiled circa 2010. Runs in-browser via
              js-dos emulation.
            </p>
            <button onClick={handlePlay} className="btn-cta mt-2">
              <Play className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Play
            </button>
          </>
        )}

        {state === "booting" && (
          <div className="w-full max-w-sm text-left text-xs leading-relaxed text-mustard">
            <p>C:\GAMES\COLLECTOR&gt; collector.exe</p>
            <p className="mt-2">Loading DOSBox core...</p>
            <p>Mounting drive C:...</p>
            <p className="mt-2 inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Booting THE COLLECTOR
              <span className="cursor-blink" />
            </p>
          </div>
        )}

        {state === "unavailable" && (
          <div className="w-full max-w-md text-left text-xs leading-relaxed text-mustard">
            <p>C:\GAMES\COLLECTOR&gt; collector.exe</p>
            <p className="mt-2 text-mustard/70">
              [!] Game bundle not mounted yet.
            </p>
            <p className="mt-2 text-mustard/70">
              The .jsdos bundle of the original compiled binary is being
              prepared. Drop it in and this exact screen boots the real 2010
              build — coin collection, bribe mechanics, bullets, high scores.
            </p>
            <button
              onClick={() => setState("idle")}
              className="btn-ghost mt-4 border-mustard text-mustard shadow-[3px_3px_0_rgba(240,180,41,0.3)]"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
