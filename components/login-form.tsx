"use client"

import { signIn } from "next-auth/react"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { generateCodeVerifier, getOrCreateDeviceId } from "@/lib/pkce"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string>("")
  const [rememberDevice, setRememberDevice] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check for timeout message in URL
  useEffect(() => {
    const timeout = searchParams.get("timeout")
    if (timeout === "true") {
      setError("Your session has expired due to inactivity. Please sign in again.")
    }
    
    // Generate device ID on component mount
    const generatedDeviceId = getOrCreateDeviceId()
    setDeviceId(generatedDeviceId)
    
    // Store for OAuth providers to use later
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('device_id', generatedDeviceId)
    }
  }, [searchParams])
  
  // Handle session remember preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('remember_device', rememberDevice.toString())
    }
  }, [rememberDevice])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    // Generate PKCE code verifier
    const codeVerifier = generateCodeVerifier()
    
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }
    
    try {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        code_verifier: codeVerifier,
        device_id: deviceId,
        remember_device: rememberDevice.toString(),
        user_agent: userAgent
      })
      
      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }
      
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("An error occurred during sign in")
      console.error("Authentication error:", error)
      setIsLoading(false)
    }
  }

  async function handleOAuthSignIn(provider: string) {
    setIsLoading(true)
    setError(null)
    
    try {
      // Store device preference for OAuth sign-in to use later
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('remember_device', rememberDevice.toString())
      }
      
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      setError(`Error signing in with ${provider}`)
      console.error(`${provider} sign in error:`, error)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="animate-fade-in">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-mnit-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
              className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
            />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="remember-device" 
              checked={rememberDevice}
              onCheckedChange={(checked) => setRememberDevice(checked === true)}
            />
            <Label 
              htmlFor="remember-device" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Remember this device (extends session time)
            </Label>
          </div>
          {error && (
            <div className="text-sm text-red-500 font-medium">{error}</div>
          )}
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-mnit-primary to-mnit-secondary hover:shadow-md transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("google")}
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("apple")}
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaApple className="mr-2 h-4 w-4" />
          Apple
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("facebook")}
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  )
}
