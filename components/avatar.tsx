import Image from "next/image"

export function Avatar() {
  return (
    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded border-2 border-forest shadow-[4px_4px_0_rgba(31,92,51,0.25)] sm:h-44 sm:w-44">
      <Image
        src="/avatar-photo.jpg"
        alt="Shashwat Mishra"
        fill
        sizes="176px"
        className="object-cover"
      />
    </div>
  )
}
