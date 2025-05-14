"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, MapPin, Mail, Phone, Twitter, Facebook, Instagram, ArrowLeft, Download, Briefcase, Building, Edit } from "lucide-react"
// Import the LinkedIn icon separately to avoid barrel optimization issues
import { Link as LinkedInIcon } from "lucide-react"
import Link from "next/link"

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
  company?: string
  position?: string
}

export default function AlumniProfilePage({ params }: { params: { id: string } }) {
  const [alumnus, setAlumnus] = useState<Alumnus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    async function fetchAlumnus() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/alumni/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Alumnus not found")
          }
          throw new Error("Failed to fetch alumnus")
        }

        const data = await response.json()
        setAlumnus(data.alumnus)
        
        // Check if this is the current user's profile
        if (session?.user?.id === data.alumnus?.id) {
          setIsOwnProfile(true)
        }
      } catch (err: any) {
        console.error("Error fetching alumnus:", err)
        setError(err.message || "Failed to load alumnus. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAlumnus()
    }
  }, [params.id, session?.user?.id])

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

  // Format the display name
  const formatName = (alumnus: Alumnus) => {
    return alumnus.preferred_name 
      ? `${alumnus.name} (${alumnus.preferred_name})`
      : alumnus.name
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex-1 container grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8">
        <DashboardNav />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="mb-6 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </div>

          {isLoading ? (
            <ProfileSkeleton />
          ) : error ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
                <Button 
                  className="mt-4" 
                  onClick={() => router.push('/dashboard/alumni')}
                >
                  Return to Alumni Directory
                </Button>
              </CardContent>
            </Card>
          ) : alumnus ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="relative pb-0">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-mnit-primary/20 to-mnit-secondary/20 rounded-t-lg" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end pt-12">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage src="/placeholder-user.jpg" alt={alumnus.name} />
                        <AvatarFallback className="bg-mnit-light text-mnit-primary text-xl">
                          {alumnus.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl">{formatName(alumnus)}</CardTitle>
                        <CardDescription className="text-base">
                          {alumnus.degree} in {alumnus.major}, {alumnus.graduation_year}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isOwnProfile && (
                        <Button 
                          onClick={() => router.push('/dashboard/profile')}
                          variant="outline"
                          className="mt-4 md:mt-0"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      )}
                      <Button 
                        onClick={() => exportContact(alumnus)} 
                        className="mt-4 md:mt-0"
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Save Contact
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-mnit-primary mr-3" />
                          <a href={`mailto:${alumnus.email}`} className="text-mnit-primary hover:underline">
                            {alumnus.email}
                          </a>
                        </div>
                        
                        {alumnus.phone && (
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-mnit-primary mr-3" />
                            <a href={`tel:${alumnus.phone}`} className="hover:underline">
                              {alumnus.phone}
                            </a>
                          </div>
                        )}
                        
                        {alumnus.location && (
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-mnit-primary mr-3" />
                            <span>{alumnus.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Education</h3>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-mnit-primary mr-3" />
                          <span>
                            {alumnus.degree} in {alumnus.major}, Class of {alumnus.graduation_year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(alumnus.company || alumnus.position) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Professional Information</h3>
                      <Separator className="my-3" />
                      <div className="space-y-3">
                        {alumnus.position && (
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-mnit-primary mr-3" />
                            <span>{alumnus.position}</span>
                          </div>
                        )}
                        {alumnus.company && (
                          <div className="flex items-center">
                            <Building className="h-5 w-5 text-mnit-primary mr-3" />
                            <span>{alumnus.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(alumnus.linkedin_url || alumnus.twitter_url || alumnus.facebook_url || alumnus.instagram_url) && (
                    <>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">Social Media</h3>
                        <Separator className="my-3" />
                        <div className="flex flex-wrap gap-4">
                          {alumnus.linkedin_url && (
                            <a 
                              href={alumnus.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"                              className="inline-flex items-center px-4 py-2 rounded-md bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                            >
                              <LinkedInIcon className="mr-2 h-5 w-5" />
                              LinkedIn
                            </a>
                          )}
                          
                          {alumnus.twitter_url && (
                            <a 
                              href={alumnus.twitter_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-md bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                            >
                              <Twitter className="mr-2 h-5 w-5" />
                              Twitter
                            </a>
                          )}
                          
                          {alumnus.facebook_url && (
                            <a 
                              href={alumnus.facebook_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-md bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
                            >
                              <Facebook className="mr-2 h-5 w-5" />
                              Facebook
                            </a>
                          )}
                          
                          {alumnus.instagram_url && (
                            <a 
                              href={alumnus.instagram_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 rounded-md bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20 transition-colors"
                            >
                              <Instagram className="mr-2 h-5 w-5" />
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader className="relative pb-0">
        <div className="absolute top-0 left-0 w-full h-24 bg-gray-200 rounded-t-lg" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end pt-12">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-1 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-1 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
        <div className="mt-8">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-1 w-full my-3" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
