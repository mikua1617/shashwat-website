import type { Metadata, Viewport } from "next"
import { Cinzel, EB_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cinzel = Cinzel({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

const garamond = EB_Garamond({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Shashwat Mishra - Product Marketer Who Builds",
  description:
    "Shashwat Mishra is a product marketer who builds the automation and technical systems most PMMs only ask for.",
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
    title: "Shashwat Mishra - Product Marketer Who Builds",
    description:
      "A marketer who builds real automation and technical systems, not just campaigns.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#4A3520",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${garamond.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
