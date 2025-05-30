"use client"

import { useState } from "react"
import { Users, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

export function LandingFeatures() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleFeatureClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // If user is not authenticated, prevent the default Link behavior
    if (status !== "authenticated") {
      e.preventDefault()
      
      // Show toast notification
      toast({
        title: "Authentication required",
        description: "Please log in to access this feature",
        variant: "default",
      })
      
      // Set redirecting state to prevent multiple clicks
      if (!isRedirecting) {
        setIsRedirecting(true)
        // Redirect to login page with callback
        router.push(`/login?callbackUrl=${encodeURIComponent(path)}`)
      }
    }
  }

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-mnit-light to-white -z-10"></div>
      <div className="absolute -top-10 left-1/4 w-64 h-64 rounded-full bg-mnit-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-mnit-secondary/5 blur-3xl -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-full bg-mnit-light px-3 py-1 text-sm text-mnit-primary mb-2">
            Features
          </div>
          <div className="space-y-2 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need to <span className="gradient-text">Stay Connected</span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              MNIT AlumConnect provides all the tools you need to reconnect with classmates, discover opportunities, and
              grow your professional network.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/dashboard/alumni" 
            className="block w-full"
            onClick={(e) => handleFeatureClick(e, "/dashboard/alumni")}
          >
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm card-hover bg-white h-full hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-mnit-light p-3">
                <Users className="h-8 w-8 text-mnit-primary" />
              </div>
              <h3 className="text-xl font-bold">Alumni Directory</h3>
              <p className="text-center text-muted-foreground">
                Search and connect with alumni based on graduation year, location, or field of work.
              </p>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/events" 
            className="block w-full"
            onClick={(e) => handleFeatureClick(e, "/dashboard/events")}
          >
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm card-hover bg-white h-full hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-mnit-light p-3">
                <Calendar className="h-8 w-8 text-mnit-primary" />
              </div>
              <h3 className="text-xl font-bold">Events</h3>
              <p className="text-center text-muted-foreground">
                Discover and organize alumni meetups, reunions, and networking events.
              </p>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/jobs" 
            className="block w-full"
            onClick={(e) => handleFeatureClick(e, "/dashboard/jobs")}
          >
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 shadow-sm card-hover bg-white h-full hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-mnit-light p-3">
                <Briefcase className="h-8 w-8 text-mnit-primary" />              </div>
              <h3 className="text-xl font-bold">Job Board</h3>
              <p className="text-center text-muted-foreground">
                Post and find job opportunities within the alumni network.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
