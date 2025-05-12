import { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentEvents } from "@/components/recent-events"
import { RecentJobs } from "@/components/recent-jobs"
import { branding } from "@/lib/branding"

export const metadata: Metadata = {
  title: "Dashboard | " + branding.name,
  description: "Welcome to your " + branding.name + " dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8">
        <DashboardNav />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your {branding.name} dashboard
            </p>
          </div>
          
          <div className="grid gap-6">
            <DashboardStats />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentEvents />
              <RecentJobs />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
