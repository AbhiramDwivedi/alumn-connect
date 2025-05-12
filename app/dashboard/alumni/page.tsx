import { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { AlumniDirectory } from "@/components/alumni-directory"
import { branding } from "@/lib/branding"

export const metadata: Metadata = {
  title: "Alumni Directory | " + branding.name,
  description: "Browse the alumni directory of " + branding.name,
}

export default function AlumniDirectoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8">
        <DashboardNav />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Alumni Directory</h1>
            <p className="text-muted-foreground">
              Connect with fellow alumni from around the world
            </p>
          </div>
          <AlumniDirectory />
        </main>
      </div>
    </div>
  )
}
