'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginUser } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const callbackError = searchParams.get('error')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await loginUser(formData)
      if (result.error) {
        setError(result.error)
      } else {
        const next = searchParams.get('next') ?? '/explore'
        router.push(next)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in to PublicAlgo</CardTitle>
        <CardDescription>
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>

          {(error || callbackError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error ??
                  (callbackError === 'auth'
                    ? 'Email verification failed. Please try again or request a new link.'
                    : 'Something went wrong. Please try again.')}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button
          type="submit"
          form="login-form"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log in'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
          >
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
