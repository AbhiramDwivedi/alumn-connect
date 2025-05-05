"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Here we would normally authenticate the user
    // For now, we'll just simulate a delay and redirect
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="animate-fade-in">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
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
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
              className="border-mnit-primary/20 focus-visible:ring-mnit-primary"
            />
          </div>
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
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaApple className="mr-2 h-4 w-4" />
          Apple
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="hover:bg-mnit-light hover:text-mnit-primary hover:border-mnit-primary/50 transition-all"
        >
          <FaFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  )
}
