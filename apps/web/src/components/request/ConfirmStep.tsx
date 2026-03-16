'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRequestDraft } from '@/context/RequestDraftContext'
import { createFoiRequest } from '@/actions/requests'
import { LetterPreview } from '@/components/request/LetterPreview'
import type { FoiLetterData } from '@/types/domain'
import { COUNTRY_NAMES } from '@/types/domain'

interface ConfirmStepProps {
  country: string
  orgId?: string
  orgName?: string
}

export function ConfirmStep({ country, orgId, orgName }: ConfirmStepProps) {
  const { draft, clearDraft } = useRequestDraft()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [letter, setLetter] = useState<FoiLetterData | null>(null)

  // Use draft values with URL param fallbacks
  const effectiveOrgId = draft.orgId ?? orgId
  const effectiveOrgName = draft.orgName ?? orgName ?? 'Unknown organisation'
  const effectiveCountry = draft.country ?? country

  // Guard: if no sender name (user skipped steps), show warning
  if (!draft.senderName || !draft.bodyEdited) {
    const senderParams = new URLSearchParams({ country })
    if (orgId) senderParams.set('org_id', orgId)
    if (orgName) senderParams.set('org_name', orgName)
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            It looks like you navigated here directly. Please complete the previous steps first.
          </p>
          <Button asChild variant="outline">
            <Link href={`/request/sender?${senderParams.toString()}`}>← Go back</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await createFoiRequest({
        country: effectiveCountry,
        orgId: effectiveOrgId,
        orgName: effectiveOrgId ? undefined : effectiveOrgName,
        bodyEdited: draft.bodyEdited!,
        systemName: draft.systemName,
        senderName: draft.senderName!,
        senderEmail: draft.senderEmail!,
        senderOrganisation: draft.senderOrganisation,
      })

      if (result.error || !result.data) {
        setError(result.error ?? 'An unexpected error occurred.')
        return
      }

      clearDraft()
      setLetter(result.data)
    })
  }

  // After submission — show the letter
  if (letter) {
    return <LetterPreview letter={letter} />
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="pt-6 space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-32 shrink-0">To</span>
            <span className="font-medium">{effectiveOrgName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-32 shrink-0">Country</span>
            <span>{COUNTRY_NAMES[effectiveCountry] ?? effectiveCountry}</span>
          </div>
          {draft.systemName && (
            <div className="flex gap-2">
              <span className="text-muted-foreground w-32 shrink-0">Regarding</span>
              <span>{draft.systemName}</span>
            </div>
          )}
          <Separator />
          <div className="flex gap-2">
            <span className="text-muted-foreground w-32 shrink-0">From</span>
            <span>{draft.senderName}</span>
          </div>
          {draft.senderOrganisation && (
            <div className="flex gap-2">
              <span className="text-muted-foreground w-32 shrink-0">Organisation</span>
              <span>{draft.senderOrganisation}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-muted-foreground w-32 shrink-0">Email</span>
            <span className="text-muted-foreground">{draft.senderEmail}</span>
          </div>
        </CardContent>
      </Card>

      <Alert variant="info">
        <AlertTitle>After you submit</AlertTitle>
        <AlertDescription>
          Your request will be saved as a public record. You will receive the finalised letter to
          copy and send manually to the organisation — PublicAlgo does not send emails on your behalf.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit and generate letter'}
        </Button>
      </div>
    </div>
  )
}
