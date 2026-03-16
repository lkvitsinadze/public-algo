'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRequestDraft } from '@/context/RequestDraftContext'
import type { FoiTemplate } from '@/types/database'

interface TemplateEditorProps {
  template: FoiTemplate
  country: string
  orgId?: string
  orgName?: string
}

export function TemplateEditor({ template, country, orgId, orgName }: TemplateEditorProps) {
  const router = useRouter()
  const { updateDraft } = useRequestDraft()
  const [body, setBody] = useState(template.body)
  const [systemName, setSystemName] = useState('')

  function handleNext() {
    updateDraft({
      country,
      orgId,
      orgName,
      templateId: template.template_id,
      bodyEdited: body,
      systemName: systemName.trim() || undefined,
    })

    const params = new URLSearchParams({ country })
    if (orgId) params.set('org_id', orgId)
    if (orgName) params.set('org_name', orgName)

    router.push(`/request/sender?${params.toString()}`)
  }

  const senderParams = new URLSearchParams({ country })
  if (orgId) senderParams.set('org_id', orgId)
  if (orgName) senderParams.set('org_name', orgName)

  const reviewParams = new URLSearchParams({ country })
  if (orgId) reviewParams.set('org_id', orgId)
  if (orgName) reviewParams.set('org_name', orgName)

  return (
    <div className="space-y-6">
      {/* Locked: Subject line */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Subject line <span className="ml-1 text-xs font-normal normal-case">(locked)</span>
        </Label>
        <div className="px-3 py-2 bg-muted rounded-md text-sm border border-dashed">
          {template.subject_line}
        </div>
      </div>

      {/* Locked: Legal basis */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Legal basis <span className="ml-1 text-xs font-normal normal-case">(locked)</span>
        </Label>
        <div className="px-3 py-2 bg-muted rounded-md text-sm border border-dashed">
          {template.legal_basis}
        </div>
      </div>

      {/* Optional: Specific system name */}
      <div className="space-y-1.5">
        <Label htmlFor="system-name">
          Specific system or dataset name{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="system-name"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          placeholder="e.g. SyRI, CATCH, or leave blank for a general request"
        />
        <p className="text-xs text-muted-foreground mt-1">
          If you know the name of a specific system, add it here. It will appear in your request.
        </p>
      </div>

      {/* Editable: Body */}
      <div className="space-y-1.5">
        <Label htmlFor="body">
          Request body{' '}
          <span className="text-muted-foreground font-normal">(editable)</span>
        </Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
          className="font-mono resize-y"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {body.length} characters — You may edit the body text. The legal basis and subject line
          cannot be changed.
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <a href={`/request/review?${reviewParams.toString()}`}>← Back</a>
        </Button>
        <Button onClick={handleNext} disabled={!body.trim()}>
          Next: Add your details →
        </Button>
      </div>
    </div>
  )
}
