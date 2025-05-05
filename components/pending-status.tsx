import { branding } from "@/lib/branding"
import { AlertCircle, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PendingStatus() {
  return (
    <Card className="border-2 border-yellow-400/50 shadow-lg">
      <CardHeader className="text-center space-y-1">
        <div className="flex justify-center mb-2">
          <AlertCircle className="h-12 w-12 text-yellow-500" />
        </div>
        <CardTitle className="text-2xl">Registration Pending</CardTitle>
        <CardDescription>
          Your alumni registration is awaiting admin approval
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Thank you for registering with {branding.name}! Your alumni account registration has been received and is currently pending review by our administrators.
        </p>
        
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">What happens next?</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Our admin team will review your registration information.</li>
                  <li>You'll receive an email notification when your account is approved.</li>
                  <li>Once approved, you'll be able to sign in and access all alumni features.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground text-center">
          If you haven't received approval within 48 hours, please contact our support team.
        </p>
        <div className="flex gap-2 justify-center w-full">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link href="mailto:support@example.com">
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            asChild
          >
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
