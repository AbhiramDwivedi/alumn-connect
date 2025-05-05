import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Briefcase, UserCheck } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-md hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-mnit-primary/10 to-mnit-primary/5 rounded-t-lg">
          <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
          <div className="rounded-full bg-mnit-primary/20 p-2">
            <Users className="h-4 w-4 text-mnit-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">1,234</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-green-500 font-medium bg-green-100 px-1 rounded mr-1">+12</span>
            <p className="text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-md hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-mnit-secondary/10 to-mnit-secondary/5 rounded-t-lg">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <div className="rounded-full bg-mnit-secondary/20 p-2">
            <Calendar className="h-4 w-4 text-mnit-secondary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">8</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-green-500 font-medium bg-green-100 px-1 rounded mr-1">+2</span>
            <p className="text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-md hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-mnit-accent/10 to-mnit-accent/5 rounded-t-lg">
          <CardTitle className="text-sm font-medium">Job Opportunities</CardTitle>
          <div className="rounded-full bg-mnit-accent/20 p-2">
            <Briefcase className="h-4 w-4 text-mnit-accent" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">24</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-green-500 font-medium bg-green-100 px-1 rounded mr-1">+5</span>
            <p className="text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-md hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-t-lg">
          <CardTitle className="text-sm font-medium">Your Connections</CardTitle>
          <div className="rounded-full bg-blue-500/20 p-2">
            <UserCheck className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">42</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-green-500 font-medium bg-green-100 px-1 rounded mr-1">+8</span>
            <p className="text-xs text-muted-foreground">from last month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
