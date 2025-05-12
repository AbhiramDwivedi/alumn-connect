import React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { branding } from "@/lib/branding"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], display: "swap" })
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"]
})
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: {
    default: branding.name,
    template: `%s | ${branding.name}`,
  },
  description: branding.description,
  icons: {
    icon: "/favicon.ico",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${montserrat.variable} ${openSans.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
