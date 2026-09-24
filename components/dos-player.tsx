"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Play, Gamepad2, Loader2 } from "lucide-react"

// Real js-dos integration. js-dos v8 ships as a plain script (no npm module
// export), so it's loaded via next/script and used through the global
// `Dos()` function it attaches to window - exactly as js-dos's own docs
// describe: https://js-dos.com/overview.html
declare global {
  interface Window {
    Dos?: (element: HTMLDivElement, options?: Record<string, unknown>) => {
      run: (bundleUrl: string) => Promise<unknown>
      stop?: () => Promise<void>
    }
  }
}

const BUNDLE_URL = "/games/collector.jsdos"

export function DosPlayer() {
  const [state, setState] = useState<"idle" | "booting" | "running" | "error">("idle")
  const [jsdosReady, setJsdosReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const ciRef = useRef<ReturnType<NonNullable<Window["Dos"]>> | null>(null)

  useEffect(() => {
    return () => {
      // Clean up the running instance if the component unmounts mid-game
      ciRef.current?.stop?.()
    }
  }, [])

  function handlePlay() {
    if (!jsdosReady || !window.Dos || !containerRef.current) {
      setState("error")
      return
    }
    setState("booting")
    const ci = window.Dos(containerRef.current, {})
    ciRef.current = ci
    ci.run(BUNDLE_URL)
      .then(() => setState("running"))
      .catch(() => setState("error"))
  }

  return (
    <>
      {/* js-dos is a self-contained emulator bundle, loaded once, globally */}
      <link rel="stylesheet" href="https://v8.js-dos.com/latest/js-dos.css" />
      <Script
        src="https://v8.js-dos.com/latest/js-dos.js"
        strategy="lazyOnload"
        onLoad={() => setJsdosReady(true)}
      />

      <div className="relative aspect-video w-full overflow-hidden rounded border-2 border-forest bg-ink text-mustard">
        {/* scanline sheen - only shown outside the running state so it
            doesn't overlay the actual emulator canvas */}
        {state !== "running" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(240,180,41,0.25) 3px)",
            }}
          />
        )}

        {/* The js-dos canvas mounts into this div once running. It stays in
            the DOM (just hidden) in idle/booting/error states so containerRef
            is always available the instant Play is pressed. */}
        <div
          ref={containerRef}
          className={state === "running" ? "h-full w-full" : "hidden"}
        />

        {state !== "running" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center font-mono">
            {state === "idle" && (
              <>
                <Gamepad2 className="h-10 w-10" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-xs uppercase tracking-[0.2em] text-mustard/80">
                  Shaved Adlabs Productions
                </p>
                <p className="heading text-mustard text-sm sm:text-base">THE COLLECTOR</p>
                <p className="max-w-sm text-xs leading-relaxed text-mustard/70">
                  Original DOS binary, compiled 2013. Runs in-browser via
                  js-dos emulation - the actual compiled program, not a
                  recreation.
                </p>
                <button onClick={handlePlay} className="btn-cta mt-2" disabled={!jsdosReady}>
                  <Play className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  {jsdosReady ? "Play" : "Loading emulator..."}
                </button>
              </>
            )}

            {state === "booting" && (
              <div className="w-full max-w-sm text-left text-xs leading-relaxed text-mustard">
                <p>C:\&gt; COLLEC_1.EXE</p>
                <p className="mt-2">Loading DOSBox core...</p>
                <p>Mounting drive C:...</p>
                <p className="mt-2 inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Booting THE COLLECTOR
                  <span className="cursor-blink" />
                </p>
              </div>
            )}

            {state === "error" && (
              <div className="w-full max-w-md text-left text-xs leading-relaxed text-mustard">
                <p>C:\&gt; COLLEC_1.EXE</p>
                <p className="mt-2 text-mustard/70">
                  [!] Could not start the emulator.
                </p>
                <p className="mt-2 text-mustard/70">
                  This can happen on a slow connection or an older browser.
                  Try reloading the page.
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
        )}
      </div>
    </>
  )
}
