import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building, ArrowRight } from "lucide-react"

// Mock data - would normally come from the database
const jobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    postedAt: "2023-05-28T10:00:00",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "Global Solutions Ltd.",
    postedAt: "2023-05-30T14:30:00",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Analytics Pro",
    postedAt: "2023-06-01T09:15:00",
  },
]

export function RecentJobs() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between space-x-4 rounded-xl border p-4 hover:border-mnit-primary/30 hover:bg-mnit-light/20 transition-all"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{job.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="mr-1 h-4 w-4 text-mnit-primary" />
              {job.company}
              <span className="mx-2">•</span>
              <span>Posted {formatTimeAgo(new Date(job.postedAt))}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-mnit-primary hover:bg-mnit-primary/10" asChild>
            <Link href={`/dashboard/jobs/${job.id}`}>View</Link>
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full group hover:bg-mnit-primary/10 hover:text-mnit-primary hover:border-mnit-primary/30 transition-all"
        asChild
      >
        <Link href="/dashboard/jobs" className="flex items-center justify-center">
          View all jobs
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
}
