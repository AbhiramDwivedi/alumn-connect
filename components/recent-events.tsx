import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

// Mock data - would normally come from the database
const events = [
  {
    id: "1",
    title: "Annual Alumni Meetup",
    date: "2023-06-15T18:00:00",
    location: "New York, NY",
  },
  {
    id: "2",
    title: "Tech Industry Networking",
    date: "2023-06-22T17:30:00",
    location: "San Francisco, CA",
  },
  {
    id: "3",
    title: "MNIT Reunion 2023",
    date: "2023-07-10T10:00:00",
    location: "Jaipur, India",
  },
]

export function RecentEvents() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between space-x-4 rounded-xl border p-4 hover:border-mnit-primary/30 hover:bg-mnit-light/20 transition-all"
        >
          <div className="space-y-1">
            <h3 className="font-medium">{event.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4 text-mnit-primary" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              <span className="mx-2">•</span>
              <MapPin className="mr-1 h-4 w-4 text-mnit-primary" />
              {event.location}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-mnit-primary hover:bg-mnit-primary/10" asChild>
            <Link href={`/dashboard/events/${event.id}`}>View</Link>
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full group hover:bg-mnit-primary/10 hover:text-mnit-primary hover:border-mnit-primary/30 transition-all"
        asChild
      >
        <Link href="/dashboard/events" className="flex items-center justify-center">
          View all events
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  )
}
