import type { Metadata } from "next"
import { RegisterForm } from "@/components/register-form"
import { branding } from "@/lib/branding"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Register | " + branding.name,
  description: "Register for an alumni account",
}

export default function RegisterPage() {
  return (    <div className="min-h-screen w-full py-12 flex flex-col items-center justify-center bg-mnit-light/5">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        ← Back to Home
      </Link>      <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[600px] md:w-[700px] lg:w-[800px] max-w-4xl px-4">
        <div className="flex flex-col space-y-2 text-center items-center">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-mnit-primary">
            <img
              src="/images/logo.png"
              alt={branding.name}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Alumni Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an alumni account
          </p>
        </div>
        <div className="bg-white/95 rounded-lg shadow-lg p-6 border border-gray-100">
          <RegisterForm />
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}