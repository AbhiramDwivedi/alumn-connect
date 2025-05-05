"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, MapPin, GraduationCap, Briefcase, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - would normally come from the database
const alumni = [
  {
    id: "1",
    name: "John Doe",
    graduationYear: 2015,
    degree: "B.Tech",
    major: "Computer Science",
    location: "San Francisco, CA",
    company: "Google",
    position: "Senior Software Engineer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Jane Smith",
    graduationYear: 2018,
    degree: "M.Tech",
    major: "Electronics",
    location: "New York, NY",
    company: "Microsoft",
    position: "Product Manager",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Raj Patel",
    graduationYear: 2010,
    degree: "B.Tech",
    major: "Mechanical Engineering",
    location: "Bangalore, India",
    company: "Amazon",
    position: "Engineering Manager",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Priya Sharma",
    graduationYear: 2020,
    degree: "B.Tech",
    major: "Civil Engineering",
    location: "Mumbai, India",
    company: "Tata Consultancy Services",
    position: "Project Engineer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function AlumniDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [degree, setDegree] = useState("")
  const [major, setMajor] = useState("")
  const [location, setLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Generate graduation years (current year - 50 to current year)
  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 51 }, (_, i) => currentYear - i)

  // Filter alumni based on search criteria
  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.major.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGraduationYear = graduationYear ? alumnus.graduationYear.toString() === graduationYear : true
    const matchesDegree = degree ? alumnus.degree === degree : true
    const matchesMajor = major ? alumnus.major.toLowerCase().includes(major.toLowerCase()) : true
    const matchesLocation = location ? alumnus.location.toLowerCase().includes(location.toLowerCase()) : true

    return matchesSearch && matchesGraduationYear && matchesDegree && matchesMajor && matchesLocation
  })

  // Function to export contact as VCF
  const exportContact = (alumnus: (typeof alumni)[0]) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${alumnus.name}
ORG:${alumnus.company}
TITLE:${alumnus.position}
ADR;TYPE=WORK:;;${alumnus.location}
END:VCARD`

    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${alumnus.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Count active filters
  const activeFilterCount = [graduationYear, degree !== "all" && degree, major, location].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alumni..."
                className="pl-8 border-mnit-primary/20 focus-visible:ring-mnit-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            className={`md:w-auto ${activeFilterCount > 0 ? "border-mnit-primary text-mnit-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && <Badge className="ml-2 bg-mnit-primary">{activeFilterCount}</Badge>}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-mnit-light/50 rounded-lg animate-fade-in">
            <Select value={graduationYear} onValueChange={setGraduationYear}>
              <SelectTrigger className="border-mnit-primary/20 focus:ring-mnit-primary">
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {graduationYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={degree} onValueChange={setDegree}>
              <SelectTrigger className="border-mnit-primary/20 focus:ring-mnit-primary">
                <SelectValue placeholder="Degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Degrees</SelectItem>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
            />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAlumni.map((alumnus) => (
          <Card
            key={alumnus.id}
            className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all card-hover"
          >
            <CardContent className="p-0">
              <div className="h-12 bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20"></div>
              <div className="p-6 pt-0 -mt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-4 border-background">
                      <AvatarImage src={alumnus.avatar || "/placeholder.svg"} alt={alumnus.name} />
                      <AvatarFallback className="bg-mnit-light text-mnit-primary">
                        {alumnus.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="pt-4">
                      <h3 className="font-semibold">{alumnus.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {alumnus.position} at {alumnus.company}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => exportContact(alumnus)}
                    title="Export contact"
                    className="text-mnit-primary hover:bg-mnit-primary/10"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Export contact</span>
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-mnit-primary" />
                    {alumnus.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4 text-mnit-primary" />
                    {alumnus.degree}, {alumnus.major}, {alumnus.graduationYear}
                  </div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 text-mnit-primary" />
                    {alumnus.company}
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-mnit-primary/10 hover:text-mnit-primary hover:border-mnit-primary/30 transition-all"
                    asChild
                  >
                    <Link href={`/dashboard/alumni/${alumnus.id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No alumni found</p>
            <Button
              variant="link"
              className="mt-2 text-mnit-primary"
              onClick={() => {
                setSearchQuery("")
                setGraduationYear("")
                setDegree("")
                setMajor("")
                setLocation("")
              }}
            >
              Clear all filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
