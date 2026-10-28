"use client"

import { useState } from "react"
import Image from "next/image"

export function AvatarReveal() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
      <button
        type="button"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onClick={() => setRevealed((r) => !r)}
        aria-label={revealed ? "Show pixel portrait" : "Show photo"}
        aria-pressed={revealed}
        className="group relative block h-40 w-40 overflow-hidden rounded border-2 border-forest shadow-[4px_4px_0_rgba(31,92,51,0.25)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] sm:h-44 sm:w-44"
      >
        <Image
          src="/avatar-pixel.png"
          alt=""
          fill
          sizes="176px"
          className={`object-cover [image-rendering:pixelated] transition-opacity duration-300 ${
            revealed ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src="/avatar-photo.jpg"
          alt="Shashwat Mishra"
          fill
          sizes="176px"
          className={`object-cover transition-opacity duration-300 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-forest/60">
        {"[ tap / hover to decrypt ]"}
      </span>
    </div>
  )
}
