import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PendingStatus() {
  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Account Pending Approval</AlertTitle>
      <AlertDescription>
        Your account is currently pending approval by an administrator. Some features may be limited until your account
        is approved.
      </AlertDescription>
    </Alert>
  )
}
