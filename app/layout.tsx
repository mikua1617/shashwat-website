import type { Metadata, Viewport } from "next"
import { Press_Start_2P, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Shashwat Mishra — Product Marketer Who Builds",
  description:
    "Shashwat Mishra is a product marketer with an engineering background who builds the automation and technical systems most PMMs only ask for.",
  keywords: [
    "Shashwat Mishra",
    "Product Marketing",
    "PMM",
    "AI",
    "Automation",
    "BFSI",
    "BITS Pilani",
  ],
  authors: [{ name: "Shashwat Mishra" }],
  openGraph: {
    title: "Shashwat Mishra — Product Marketer Who Builds",
    description:
      "A marketer who builds real automation and technical systems, not just campaigns.",
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
    <html lang="en" className={`${pressStart.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
