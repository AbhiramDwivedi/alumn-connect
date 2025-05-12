"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, MapPin, GraduationCap, Briefcase, Filter, Loader2, LinkIcon, ArrowUp, ArrowDown, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type Alumnus = {
  id: string
  name: string
  preferred_name?: string
  email: string
  phone?: string
  location?: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  graduation_year: number
  degree: string
  major: string
  status: string
}

type AlumniResponse = {
  alumni: Alumnus[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

type SortOption = 'name' | 'graduation_year' | 'company' | 'location'

export function AlumniDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [degree, setDegree] = useState("")
  const [major, setMajor] = useState("")
  const [location, setLocation] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alumni, setAlumni] = useState<Alumnus[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 0,
  })
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Generate graduation years (current year - 50 to current year)
  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 51 }, (_, i) => currentYear - i)

  // Get current user ID
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        if (session?.user?.id) {
          setCurrentUserId(session.user.id)
        }
      } catch (error) {
        console.error('Failed to get user session:', error)
      }
    }
    
    getCurrentUser()
  }, [])

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])  // Fetch alumni data
  useEffect(() => {
    async function fetchAlumni() {
      setIsLoading(true);
      setError(null);

      try {
        // Construct query parameters
        const params = new URLSearchParams();
        if (debouncedSearchQuery) params.append("query", debouncedSearchQuery);
        if (graduationYear) params.append("graduationYear", graduationYear);
        if (degree) params.append("degree", degree);
        if (major) params.append("major", major);
        if (location) params.append("location", location);
        params.append("page", pagination.page.toString());
        params.append("limit", pagination.limit.toString());
        params.append("sortBy", sortBy);
        params.append("sortDirection", sortDirection);
        
        const response = await fetch(`/api/alumni?${params.toString()}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", response.status, errorText);
          throw new Error(`Failed to fetch alumni: ${response.status} - ${errorText}`);
        }

        const data: AlumniResponse = await response.json()
        setAlumni(data.alumni)
        setPagination(data.pagination)
      } catch (err) {
        console.error("Error fetching alumni:", err)
        setError("Failed to load alumni. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [debouncedSearchQuery, graduationYear, degree, major, location, pagination.page, pagination.limit, sortBy, sortDirection])

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  // Function to format display name
  const formatName = (alumnus: Alumnus) => {
    return alumnus.preferred_name 
      ? `${alumnus.name} (${alumnus.preferred_name})`
      : alumnus.name
  }

  // Function to export contact as VCF
  const exportContact = (alumnus: Alumnus) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${alumnus.name}
${alumnus.email ? `EMAIL:${alumnus.email}` : ""}
${alumnus.phone ? `TEL:${alumnus.phone}` : ""}
${alumnus.location ? `ADR;TYPE=WORK:;;${alumnus.location}` : ""}
${alumnus.linkedin_url ? `URL;TYPE=WORK:${alumnus.linkedin_url}` : ""}
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
  const activeFilterCount = [
    debouncedSearchQuery, 
    graduationYear, 
    degree, 
    major, 
    location
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {currentUserId && (
        <Card className="border-2 border-mnit-primary/30 bg-mnit-light/30 shadow-md mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-3 md:mb-0">
                <div className="mr-3 bg-mnit-primary/10 p-2 rounded-full">
                  <Users className="h-6 w-6 text-mnit-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-mnit-primary">Your Alumni Profile</h3>
                  <p className="text-sm text-muted-foreground">View and edit your profile information</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-mnit-primary/20 hover:bg-mnit-primary/10 hover:text-mnit-primary"
                  onClick={() => window.location.href = `/dashboard/alumni/${currentUserId}`}
                >
                  View Profile
                </Button>
                <Button 
                  className="bg-mnit-primary hover:bg-mnit-primary/90 text-white"
                  onClick={() => window.location.href = '/dashboard/profile'}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] border-mnit-primary/20 focus:ring-mnit-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="graduation_year">Graduation Year</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="border-mnit-primary/20 hover:bg-mnit-primary/10 hover:text-mnit-primary"
              title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'asc' ? 
                <ArrowUp className="h-4 w-4" /> : 
                <ArrowDown className="h-4 w-4" />
              }
            </Button>
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
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-mnit-light/50 rounded-lg animate-in fade-in duration-200">            <Select value={graduationYear} onValueChange={setGraduationYear}>
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
                <SelectItem value="">All Degrees</SelectItem>
                <SelectItem value="B.Tech">B.Tech</SelectItem>
                <SelectItem value="M.Tech">M.Tech</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="MSc">MSc</SelectItem>
                <SelectItem value="BSc">BSc</SelectItem>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-mnit-primary" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setGraduationYear("")
                setDegree("")
                setMajor("")
                setLocation("")
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              Reset and try again
            </Button>
          </div>
        </div>
      ) : (
        <>          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {alumni.map((alumnus) => (
              <Card
                key={alumnus.id}
                className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all card-hover"
              >
                <CardContent className="p-0">
                  <div className="h-12 bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20"></div>
                  <div className="p-6 pt-0 -mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <Avatar className="h-16 w-16 border-4 border-background mb-3 sm:mb-0">
                          <AvatarImage src="/placeholder-user.jpg" alt={alumnus.name} />
                          <AvatarFallback className="bg-mnit-light text-mnit-primary">
                            {alumnus.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="pt-0 sm:pt-4">
                          <h3 className="font-semibold">{formatName(alumnus)}</h3>                          <p className="text-sm text-muted-foreground">
                            {`${alumnus.major} graduate`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => exportContact(alumnus)}
                        title="Export contact"
                        className="text-mnit-primary hover:bg-mnit-primary/10 mt-3 sm:mt-0"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export contact</span>
                      </Button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {alumnus.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-mnit-primary" />
                          {alumnus.location}
                        </div>
                      )}                      <div className="flex items-center text-sm">
                        <GraduationCap className="mr-2 h-4 w-4 text-mnit-primary" />
                        {alumnus.degree}, {alumnus.major}, {alumnus.graduation_year}
                      </div>
                      {alumnus.linkedin_url && (
                        <div className="flex items-center text-sm">
                          <LinkIcon className="mr-2 h-4 w-4 text-mnit-primary" />
                          <a 
                            href={alumnus.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-mnit-primary hover:underline truncate"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
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

          {alumni.length === 0 && (
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
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.page - 1);
                    }}
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, current page, and pages adjacent to current page
                    const isFirstPage = page === 1;
                    const isLastPage = page === pagination.totalPages;
                    const isCurrentPage = page === pagination.page;
                    const isAdjacentToCurrent = 
                      page === pagination.page - 1 || 
                      page === pagination.page + 1;
                    return isFirstPage || isLastPage || isCurrentPage || isAdjacentToCurrent;
                  })
                  .map((page, index, array) => {
                    // Add ellipsis where needed
                    const isPreviousPageNotAdjacent = 
                      index > 0 && array[index - 1] !== page - 1;
                    
                    return (
                      <div key={page} className="flex items-center">
                        {isPreviousPageNotAdjacent && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <Button
                            variant={pagination.page === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className={pagination.page === page ? "bg-mnit-primary" : ""}
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      </div>
                    );
                  })}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.page + 1);
                    }}
                    className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
