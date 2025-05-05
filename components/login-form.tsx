"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  rememberDevice: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get error message from URL if any
  useEffect(() => {
    const errorParam = searchParams?.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("Invalid email or password")
          break
        case "SessionRequired":
          setError("You must be signed in to access this page")
          break
        default:
          setError("Authentication error")
          break
      }
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberDevice: false
    },
  });

  // Get or generate a device ID to track sessions
  const getDeviceId = () => {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('device_id')
    
    // If no device ID exists, generate and store a new one
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('device_id', deviceId)
    }
    
    return deviceId
  }

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)
    
    // Get or generate device ID
    const deviceId = getDeviceId()
    
    // Store device remember preference in session storage for OAuth flows
    localStorage.setItem('remember_device', data.rememberDevice.toString())
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        device_id: deviceId,
        remember_device: data.rememberDevice.toString(),
        redirect: false,
      })
      
      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }
      
      // Redirect to intended destination or dashboard
      const callbackUrl = searchParams?.get("callbackUrl") || "/"
      router.push(callbackUrl)
      
    } catch (error) {
      setError("An error occurred during sign in")
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <a href="/forgot-password">Forgot password?</a>
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="rememberDevice" 
              checked={watch("rememberDevice")}
              onCheckedChange={(checked) => setValue("rememberDevice", checked === true)}
            />
            <Label 
              htmlFor="rememberDevice" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Remember this device
            </Label>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <Button
            type="submit"
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
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" disabled={isLoading} onClick={() => signIn("google", { callbackUrl: "/" })}>
          <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
          Google
        </Button>
        <Button variant="outline" disabled={isLoading} onClick={() => signIn("facebook", { callbackUrl: "/" })}>
          <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </Button>
        <Button variant="outline" disabled={isLoading} onClick={() => signIn("apple", { callbackUrl: "/" })}>
          <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg"><title>Apple</title><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
          Apple
        </Button>
      </div>
    </div>
  )
}
