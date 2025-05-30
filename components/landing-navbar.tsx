"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings } from "lucide-react"

export function LandingNavbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated" && session?.user

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get the display name (preferred_name if available, otherwise name)
  const displayName = session?.user?.preferred_name || session?.user?.name || ""

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
        </div>        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-mnit-primary relative group"
          >
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mnit-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/dashboard/alumni"
            className="text-sm font-medium transition-colors hover:text-mnit-primary relative group"
          >
            Directory
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mnit-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/dashboard/events"
            className="text-sm font-medium transition-colors hover:text-mnit-primary relative group"
          >
            Events
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mnit-primary transition-all group-hover:w-full"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-mnit-primary/10 hover:text-mnit-primary">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/placeholder-user.jpg" alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}
