import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, GraduationCap, Users } from "lucide-react"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mnit-light to-white -z-10"></div>

      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-[5%] w-72 h-72 rounded-full bg-gradient-to-r from-mnit-secondary/10 to-mnit-accent/10 blur-3xl -z-10"></div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Connect with <span className="gradient-text">MNIT Alumni</span> Worldwide
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Reconnect with classmates, discover career opportunities, and attend alumni events. Your college network
                is just a click away.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-mnit-primary to-mnit-secondary hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-mnit-primary text-mnit-primary hover:bg-mnit-primary/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20 rounded-2xl rotate-3 transform-gpu"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20 rounded-2xl -rotate-3 transform-gpu"></div>
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-float">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-mnit-primary to-mnit-secondary flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">MNIT AlumConnect</h3>
                  <p className="text-sm text-muted-foreground">Your alumni network</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-mnit-light">
                  <Users className="h-5 w-5 text-mnit-primary" />
                  <div>
                    <p className="font-medium">1000+ Alumni</p>
                    <p className="text-xs text-muted-foreground">Connected worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-mnit-light">
                  <Calendar className="h-5 w-5 text-mnit-primary" />
                  <div>
                    <p className="font-medium">25+ Events</p>
                    <p className="text-xs text-muted-foreground">Happening this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-mnit-light">
                  <Briefcase className="h-5 w-5 text-mnit-primary" />
                  <div>
                    <p className="font-medium">50+ Job Opportunities</p>
                    <p className="text-xs text-muted-foreground">Posted by alumni</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
