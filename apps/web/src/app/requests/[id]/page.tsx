import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRequestById } from '@/actions/requests'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StatusUpdateForm } from '@/components/shared/StatusUpdateForm'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/types/domain'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params

  const { data: request, error } = await getRequestById(id)

  if (error || !request) {
    notFound()
  }

  // Check if the current user is the owner to show the status update form
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user !== null && user.id === request.submitted_by

  const flag = COUNTRY_FLAGS[request.organisations.country] ?? ''
  const countryName = COUNTRY_NAMES[request.organisations.country] ?? request.organisations.country

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/requests">← Back to all requests</Link>
        </Button>
      </div>

      {/* Title area */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <StatusBadge status={request.status} />
          <span className="text-sm text-muted-foreground">
            Submitted {formatDate(request.submitted_date)}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-1">{request.subject_line}</h1>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{flag}</span>
          <span>{request.organisations.name}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{countryName}</span>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Metadata */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6 text-sm">
        <div>
          <dt className="text-muted-foreground font-medium mb-0.5">To</dt>
          <dd>{request.organisations.name}</dd>
        </div>

        <div>
          <dt className="text-muted-foreground font-medium mb-0.5">Subject</dt>
          <dd>{request.subject_line}</dd>
        </div>

        <div>
          <dt className="text-muted-foreground font-medium mb-0.5">Legal basis</dt>
          <dd className="text-muted-foreground italic">{request.legal_basis}</dd>
        </div>

        {request.system_name && (
          <div>
            <dt className="text-muted-foreground font-medium mb-0.5">Regarding</dt>
            <dd>{request.system_name}</dd>
          </div>
        )}

        <div>
          <dt className="text-muted-foreground font-medium mb-0.5">Sent by</dt>
          <dd>
            {request.sender_name}
            {request.sender_organisation && (
              <span className="text-muted-foreground"> ({request.sender_organisation})</span>
            )}
          </dd>
        </div>

        {request.response_date && (
          <div>
            <dt className="text-muted-foreground font-medium mb-0.5">Response received</dt>
            <dd>{formatDate(request.response_date)}</dd>
          </div>
        )}
      </dl>

      <Separator className="mb-6" />

      {/* Letter body */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Letter
        </h2>
        <div className="rounded-xl border border-border bg-muted/20 px-6 py-6">
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90"
          >
            {request.body_final}
          </div>
        </div>
      </div>

      {/* Status update — owner only */}
      {isOwner && (
        <StatusUpdateForm requestId={request.request_id} currentStatus={request.status} />
      )}
    </div>
  )
}
