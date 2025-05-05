"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function SessionMonitor() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  
  // Skip session monitoring on public pages
  const isPublicPage = ['/login', '/register', '/forgot-password', '/'].some(
    path => pathname === path || pathname.startsWith(path + '/')
  )
  
  // Update session activity on user interaction
  useEffect(() => {
    if (isPublicPage || status !== 'authenticated') return
    
    // Define activity events to track
    const activityEvents = [
      'mousedown', 'keydown', 'scroll', 'touchstart', 'click'
    ]
    
    // Activity handler
    const handleActivity = () => {
      setLastActivity(Date.now())
      // Refresh session data to update last_activity in token
      update()
    }
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity)
    })
    
    // Clean up
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [status, isPublicPage, update])
  
  // Session monitoring effect - check if session should expire
  useEffect(() => {
    if (isPublicPage || status !== 'authenticated') return
    
    const isRememberedDevice = session?.user?.is_remembered_device
    const checkInterval = isRememberedDevice ? 60000 : 15000 // Check less frequently for remembered devices
    
    // Set up interval to check session expiry
    const intervalId = setInterval(() => {
      const now = Date.now()
      const inactivityTime = now - lastActivity
      const thirtyMinutesInMs = 30 * 60 * 1000
      
      // For non-remembered devices, sign out after 30 minutes of inactivity
      if (inactivityTime > thirtyMinutesInMs && !isRememberedDevice) {
        // Clear interval
        clearInterval(intervalId)
        
        // Show toast notification
        toast({
          title: "Session expired",
          description: "Your session has timed out due to inactivity.",
          variant: "destructive",
        })
        
        // Sign out and redirect to login with timeout message
        signOut({ 
          redirect: true, 
          callbackUrl: `/login?timeout=true` 
        })
      }
    }, checkInterval)
    
    // Clean up interval
    return () => clearInterval(intervalId)
  }, [session, status, lastActivity, isPublicPage, router, toast])
  
  // No UI, this is just a monitoring component
  return null
}