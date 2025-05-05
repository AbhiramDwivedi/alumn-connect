import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"
import { branding } from "@/lib/branding"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Login | " + branding.name,
  description: "Login to your alumni account",
}

export default function LoginPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-mnit-light/5">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        ← Back to Home
      </Link>
      <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px] px-4">
        <div className="flex flex-col space-y-2 text-center items-center">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-mnit-primary">
            <img
              src="/images/logo.png"
              alt={branding.name}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your alumni account
          </p>
        </div>
        <Suspense fallback={<div>Loading login form...</div>}>
          <LoginForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          New to {branding.name}?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}