'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { registerUser } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const COUNTRIES = [
  { value: 'NL', label: 'Netherlands' },
  { value: 'EE', label: 'Estonia' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'SE', label: 'Sweden' },
]

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [country, setCountry] = useState<string>('')
  const [formErrors, setFormErrors] = useState<{ country?: string }>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFormErrors({})

    if (!country) {
      setFormErrors({ country: 'Please select your country.' })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    // Inject the controlled Select value since Base UI Select doesn't
    // natively participate in FormData via a name attribute.
    formData.set('country', country)

    startTransition(async () => {
      const result = await registerUser(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account created</CardTitle>
          <CardDescription>Verify your email to finish setting things up.</CardDescription>
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
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Join PublicAlgo to track and challenge AI systems in European governments.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="register-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="country-trigger">Country</Label>
            <Select
              value={country}
              onValueChange={(v) => {
                setCountry(v ?? '')
                setFormErrors((prev) => ({ ...prev, country: undefined }))
              }}
            >
              <SelectTrigger
                id="country-trigger"
                className="w-full"
                aria-required="true"
                aria-invalid={formErrors.country ? true : undefined}
              >
                {country ? (
                  <span>{COUNTRIES.find((c) => c.value === country)?.label}</span>
                ) : (
                  <span className="text-muted-foreground">Select your country</span>
                )}
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.country ? (
              <p className="text-xs text-destructive">{formErrors.country}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Picking a country tailors the FOI templates we suggest.
              </p>
            )}
          </div>

          {/* Organisation (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organisation">
              Organisation{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="organisation"
              name="organisation"
              type="text"
              placeholder="Your organisation or institution"
              autoComplete="organization"
            />
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3">
        <Button
          type="submit"
          form="register-form"
          size="lg"
          className="w-full"
          disabled={isPending || !country}
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4 hover:text-foreground/80"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
