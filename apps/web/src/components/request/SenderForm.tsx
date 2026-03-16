'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRequestDraft } from '@/context/RequestDraftContext'

interface SenderFormProps {
  country: string
  orgId?: string
  orgName?: string
  prefillName: string
  prefillEmail: string
  prefillOrg: string
}

export function SenderForm({
  country,
  orgId,
  orgName,
  prefillName,
  prefillEmail,
  prefillOrg,
}: SenderFormProps) {
  const router = useRouter()
  const { updateDraft } = useRequestDraft()
  const [name, setName] = useState(prefillName)
  const [email, setEmail] = useState(prefillEmail)
  const [organisation, setOrganisation] = useState(prefillOrg)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (!name.trim()) e.name = 'Name is required.'
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (!validate()) return

    updateDraft({
      senderName: name.trim(),
      senderEmail: email.trim(),
      senderOrganisation: organisation.trim() || undefined,
    })

    const params = new URLSearchParams({ country })
    if (orgId) params.set('org_id', orgId)
    if (orgName) params.set('org_name', orgName)

    router.push(`/request/confirm?${params.toString()}`)
  }

  const composeParams = new URLSearchParams({ country })
  if (orgId) composeParams.set('org_id', orgId)
  if (orgName) composeParams.set('org_name', orgName)

  return (
    <div className="space-y-5">
      <Alert variant="warning">
        <AlertTitle>Public visibility</AlertTitle>
        <AlertDescription>
          Your name and organisation (if provided) will be shown publicly on the filed request. Your
          email address will stay private.
        </AlertDescription>
      </Alert>

      <div className="space-y-1.5">
        <Label htmlFor="sender-name">
          Your name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sender-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sender-email">
          Email address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sender-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Not shown publicly.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sender-org">
          Organisation <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="sender-org"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          placeholder="Organisation or affiliation"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button asChild variant="outline">
          <a href={`/request/compose?${composeParams.toString()}`}>← Back</a>
        </Button>
        <Button onClick={handleNext}>Review and submit →</Button>
      </div>
    </div>
  )
}
