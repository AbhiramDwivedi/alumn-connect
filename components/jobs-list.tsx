"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building, Calendar, ExternalLink, Search, Clock, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Job {
  id: string
  title: string
  company: string
  summary: string
  postedAt: string
  expiryDate?: string
  jobUrl?: string
  location?: string
}

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchJobs() {
    try {
      // This would normally fetch from the API
      // For now, we'll use mock data
      const mockJobs = [
        {
          id: "1",
          title: "Senior Software Engineer",
          company: "Tech Innovations Inc.",
          summary:
            "Looking for an experienced software engineer to join our team and help build cutting-edge web applications.",
          postedAt: "2023-05-28T10:00:00",
          expiryDate: "2023-06-28T10:00:00",
          jobUrl: "https://example.com/jobs/1",
          location: "San Francisco, CA",
        },
        {
          id: "2",
          title: "Product Manager",
          company: "Global Solutions Ltd.",
          summary: "Seeking a product manager to lead our product development efforts and drive innovation.",
          postedAt: "2023-05-30T14:30:00",
          expiryDate: "2023-06-30T14:30:00",
          location: "New York, NY",
        },
        {
          id: "3",
          title: "Data Scientist",
          company: "Analytics Pro",
          summary: "Join our data science team to analyze complex datasets and develop machine learning models.",
          postedAt: "2023-06-01T09:15:00",
          expiryDate: "2023-07-01T09:15:00",
          jobUrl: "https://example.com/jobs/3",
          location: "Boston, MA",
        },
        {
          id: "4",
          title: "UX/UI Designer",
          company: "Creative Designs",
          summary:
            "Looking for a talented designer to create beautiful and intuitive user interfaces for our products.",
          postedAt: "2023-06-03T11:45:00",
          expiryDate: "2023-07-03T11:45:00",
          location: "Austin, TX",
        },
        {
          id: "5",
          title: "DevOps Engineer",
          company: "Cloud Systems Inc.",
          summary: "Seeking a DevOps engineer to help us build and maintain our cloud infrastructure.",
          postedAt: "2023-06-05T13:20:00",
          expiryDate: "2023-07-05T13:20:00",
          jobUrl: "https://example.com/jobs/5",
          location: "Seattle, WA",
        },
      ]

      setJobs(mockJobs)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job opportunities",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-mnit-primary rounded-full"></div>
          <div className="h-3 w-3 bg-mnit-primary rounded-full"></div>
          <div className="h-3 w-3 bg-mnit-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search job opportunities..."
          className="pl-8 border-mnit-primary/20 focus-visible:ring-mnit-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No job opportunities found</p>
            <Button variant="link" className="mt-2 text-mnit-primary" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-mnit-accent to-mnit-accent/70 p-6 text-white md:w-48 flex flex-col justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                      <Building className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{job.company}</div>
                      <div className="text-xs mt-1 opacity-80">Posted by Alumni</div>
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div className="space-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">New</Badge>
                        </div>
                        <p className="text-muted-foreground">{job.summary}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {job.location && (
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-1 h-4 w-4 text-mnit-primary" />
                              {job.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-4 w-4 text-mnit-primary" />
                            Posted {formatTimeAgo(new Date(job.postedAt))}
                          </div>
                          {job.expiryDate && (
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-4 w-4 text-mnit-primary" />
                              Expires {formatDate(new Date(job.expiryDate))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.jobUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-mnit-primary/10 hover:text-mnit-primary hover:border-mnit-primary/30"
                            asChild
                          >
                            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-1 h-4 w-4" />
                              Apply
                            </a>
                          </Button>
                        )}
                        <Button
                          asChild
                          className="bg-gradient-to-r from-mnit-primary to-mnit-secondary hover:shadow-md transition-all"
                        >
                          <Link href={`/dashboard/jobs/${job.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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

// Helper function to format date
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}
