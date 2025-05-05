"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function LandingNavbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo href="/" size="md" variant="default" />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium transition-colors hover:text-mnit-primary relative group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mnit-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/#about" className="text-sm font-medium transition-colors hover:text-mnit-primary relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mnit-primary transition-all group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-mnit-primary/10 hover:text-mnit-primary">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-mnit-primary text-white hover:bg-mnit-dark hover:shadow-md transition-all">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
