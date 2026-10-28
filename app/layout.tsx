import type { Metadata, Viewport } from "next"
import { Press_Start_2P, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Shashwat Mishra - GTM & Product Marketing Leader",
  description:
    "Shashwat Mishra runs GTM strategy like a marketer and ships it like an engineer - positioning, demand gen, and the automation behind both.",
  keywords: [
    "Shashwat Mishra",
    "GTM Strategy",
    "Product Marketing",
    "PMM",
    "AI",
    "Automation",
    "BFSI",
    "BITS Pilani",
  ],
  authors: [{ name: "Shashwat Mishra" }],
  openGraph: {
    title: "Shashwat Mishra - GTM & Product Marketing Leader",
    description:
      "A GTM strategist who ships marketing fast - and builds the systems that keep it running.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#1F5C33",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
