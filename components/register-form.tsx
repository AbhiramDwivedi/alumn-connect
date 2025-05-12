"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  preferred_name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  location: z.string().optional(),
  graduation_year: z.string().refine((val) => {
    const year = parseInt(val)
    const currentYear = new Date().getFullYear()
    return !isNaN(year) && year >= 1950 && year <= currentYear
  }, { message: "Please enter a valid graduation year between 1950 and current year" }),
  degree: z.string(),
  major: z.string(),
  linkedin_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  twitter_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  facebook_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  instagram_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  subscribe_to_notifications: z.boolean().default(true)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      subscribe_to_notifications: true
    }
  });

  // Generate graduation year options
  const currentYear = new Date().getFullYear()
  const startYear = 1950
  const graduationYearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    // Remove confirmPassword as it's not needed in the API call
    const { confirmPassword, ...registrationData } = data
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }
      
      setSuccess("Registration successful! Your account is pending approval.");
      
      // Redirect to pending status page after a delay
      setTimeout(() => {
        router.push("/pending-status");
      }, 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during registration");
      }
      setIsLoading(false);
    }
  }
  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferred_name">Preferred Name</Label>
              <Input
                id="preferred_name"
                {...register("preferred_name")}
                placeholder="Johnny"
                disabled={isLoading}
              />
              {errors.preferred_name && (
                <p className="text-sm text-red-500">{errors.preferred_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.doe@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="City, Country"
                disabled={isLoading}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Account Security Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Account Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Education Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Education Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduation_year">Graduation Year <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue("graduation_year", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                type="hidden"
                {...register("graduation_year")}
              />
              {errors.graduation_year && (
                <p className="text-sm text-red-500">{errors.graduation_year.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Degree <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue("degree", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MSc">MSc</SelectItem>
                  <SelectItem value="BSc">BSc</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="hidden"
                {...register("degree")}
              />
              {errors.degree && (
                <p className="text-sm text-red-500">{errors.degree.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="major">Major/Department <span className="text-red-500">*</span></Label>
              <Input
                id="major"
                {...register("major")}
                placeholder="Computer Science"
                disabled={isLoading}
              />
              {errors.major && (
                <p className="text-sm text-red-500">{errors.major.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Social Media Profiles Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Social Media Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin_url"
                {...register("linkedin_url")}
                placeholder="https://linkedin.com/in/username"
                disabled={isLoading}
              />
              {errors.linkedin_url && (
                <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter Profile URL</Label>
              <Input
                id="twitter_url"
                {...register("twitter_url")}
                placeholder="https://twitter.com/username"
                disabled={isLoading}
              />
              {errors.twitter_url && (
                <p className="text-sm text-red-500">{errors.twitter_url.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook Profile URL</Label>
              <Input
                id="facebook_url"
                {...register("facebook_url")}
                placeholder="https://facebook.com/username"
                disabled={isLoading}
              />
              {errors.facebook_url && (
                <p className="text-sm text-red-500">{errors.facebook_url.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram Profile URL</Label>
              <Input
                id="instagram_url"
                {...register("instagram_url")}
                placeholder="https://instagram.com/username"
                disabled={isLoading}
              />
              {errors.instagram_url && (
                <p className="text-sm text-red-500">{errors.instagram_url.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Preferences</h3>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="subscribe_to_notifications" 
              checked={watch("subscribe_to_notifications")}
              onCheckedChange={(checked) => setValue("subscribe_to_notifications", checked === true)}
            />
            <Label 
              htmlFor="subscribe_to_notifications" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Subscribe to notifications about events and job opportunities
            </Label>
          </div>
        </div>
        
        {error && (
          <div className="px-4 py-3 text-sm text-white bg-red-500 rounded">{error}</div>
        )}
        
        {success && (
          <div className="px-4 py-3 text-sm text-white bg-green-500 rounded">{success}</div>
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-mnit-primary to-mnit-secondary hover:shadow-md transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  )
}