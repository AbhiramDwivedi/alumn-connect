import type { Metadata } from "next"
import { PendingStatus } from "@/components/pending-status"
import { branding } from "@/lib/branding"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Registration Pending | " + branding.name,
  description: "Your registration is pending approval",
}

export default function PendingStatusPage() {
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
      <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px] md:w-[500px] px-4">
        <PendingStatus />
      </div>
    </div>
  )
}