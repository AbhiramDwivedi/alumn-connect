"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Home, Users, Calendar, Briefcase, Search, Settings, Shield } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string
  admin?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="mr-2 h-4 w-4" />,
  },
  {
    title: "Alumni Directory",
    href: "/dashboard/alumni",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: <Calendar className="mr-2 h-4 w-4" />,
    badge: "New",
  },
  {
    title: "Job Opportunities",
    href: "/dashboard/jobs",
    icon: <Briefcase className="mr-2 h-4 w-4" />,
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: <Search className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
  {
    title: "Admin Panel",
    href: "/dashboard/admin",
    icon: <Shield className="mr-2 h-4 w-4" />,
    admin: true,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  // In a real app, we would check if the user is an admin
  const isAdmin = true

  return (
    <nav className="grid items-start gap-2 p-2">
      {navItems
        .filter((item) => !item.admin || (item.admin && isAdmin))
        .map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "bg-mnit-light text-mnit-primary hover:bg-mnit-light hover:text-mnit-primary"
                : "hover:bg-mnit-light/50 hover:text-mnit-primary",
              "justify-start relative group transition-all",
            )}
          >
            {item.icon}
            {item.title}
            {item.badge && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-mnit-accent text-white">
                {item.badge}
              </span>
            )}
            <span className="absolute left-0 top-0 h-full w-0.5 bg-mnit-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r-full" />
          </Link>
        ))}
    </nav>
  )
}
