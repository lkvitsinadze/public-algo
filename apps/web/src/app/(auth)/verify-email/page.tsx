import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
      </CardHeader>

      <CardContent>
        <Alert variant="success">
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>
            We sent a verification link to your email address. Click the link to activate your
            account.
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter>
        <Link
          href="/login"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to login
        </Link>
      </CardFooter>
    </Card>
  )
}
