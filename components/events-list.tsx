"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Search, Users, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  title: string
  summary: string
  event_date: string
  location: string
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const { toast } = useToast()
  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchEvents() {
    try {
      // This would normally fetch from the API
      // For now, we'll use mock data
      const mockEvents = [
        {
          id: "1",
          title: "Annual Alumni Meetup",
          summary: "Join us for our annual alumni gathering with networking opportunities and guest speakers.",
          event_date: "2023-06-15T18:00:00",
          location: "New York, NY",
        },
        {
          id: "2",
          title: "Tech Industry Networking",
          summary: "Connect with alumni working in the tech industry and learn about career opportunities.",
          event_date: "2023-06-22T17:30:00",
          location: "San Francisco, CA",
        },
        {
          id: "3",
          title: "MNIT Reunion 2023",
          summary: "Celebrate with your classmates at the official MNIT reunion event.",
          event_date: "2023-07-10T10:00:00",
          location: "Jaipur, India",
        },
        {
          id: "4",
          title: "Career Development Workshop",
          summary: "Learn strategies for advancing your career with guidance from successful alumni.",
          event_date: "2023-07-18T14:00:00",
          location: "Boston, MA",
        },
        {
          id: "5",
          title: "Entrepreneurship Panel",
          summary: "Hear from alumni entrepreneurs about their journeys and get inspired.",
          event_date: "2023-08-05T16:00:00",
          location: "Austin, TX",
        },
      ]

      setEvents(mockEvents)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Filter events based on search query and location
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.summary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = locationFilter === "" || event.location.toLowerCase().includes(locationFilter.toLowerCase())

    return matchesSearch && matchesLocation
  })

  // Group events by month
  const groupedEvents = filteredEvents.reduce(
    (groups, event) => {
      const date = new Date(event.event_date)
      const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      if (!groups[monthYear]) {
        groups[monthYear] = []
      }

      groups[monthYear].push(event)
      return groups
    },
    {} as Record<string, Event[]>,
  )

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 border-mnit-primary/20 focus-visible:ring-mnit-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Input
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
          />
        </div>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No events found</p>
            <Button
              variant="link"
              className="mt-2 text-mnit-primary"
              onClick={() => {
                setSearchQuery("")
                setLocationFilter("")
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-mnit-primary" />
                {monthYear}
              </h3>
              <div className="grid gap-4">
                {monthEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-gradient-to-br from-mnit-primary to-mnit-secondary p-6 text-white md:w-48 flex flex-col justify-center items-center">
                          <div className="text-3xl font-bold">{new Date(event.event_date).getDate()}</div>
                          <div className="text-sm uppercase">
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="mt-2 text-xs">
                            {new Date(event.event_date).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col justify-between gap-4 md:flex-row">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <Badge className="ml-2 bg-mnit-primary/10 text-mnit-primary hover:bg-mnit-primary/20">
                                  Upcoming
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{event.summary}</p>
                              <div className="flex items-center text-sm pt-2">
                                <MapPin className="mr-1 h-4 w-4 text-mnit-primary" />
                                {event.location}
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="mr-1 h-4 w-4 text-mnit-primary" />
                                42 attendees
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-mnit-primary/10 hover:text-mnit-primary hover:border-mnit-primary/30"
                              >
                                <ExternalLink className="mr-1 h-4 w-4" />
                                RSVP
                              </Button>
                              <Button
                                asChild
                                className="bg-gradient-to-r from-mnit-primary to-mnit-secondary hover:shadow-md transition-all"
                              >
                                <Link href={`/dashboard/events/${event.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
