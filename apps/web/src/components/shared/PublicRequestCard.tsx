import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { FoiRequestWithOrg } from '@/types/database'
import { COUNTRY_FLAGS } from '@/types/domain'

interface PublicRequestCardProps {
  request: FoiRequestWithOrg
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PublicRequestCard({ request }: PublicRequestCardProps) {
  const flag = COUNTRY_FLAGS[request.organisations.country] ?? ''

  return (
    <Card className="hover:ring-foreground/20 transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
              <span>{flag}</span>
              <span className="truncate">{request.organisations.name}</span>
            </div>
            <CardTitle className="line-clamp-2 text-base leading-snug">
              {request.subject_line}
            </CardTitle>
          </div>
          <div className="shrink-0 mt-0.5">
            <StatusBadge status={request.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {request.system_name && (
          <p className="text-sm text-muted-foreground italic mb-2">
            Re: {request.system_name}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Submitted {formatDate(request.submitted_date)}
        </p>
      </CardContent>

      <CardFooter>
        <Link
          href={`/requests/${request.request_id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View request →
        </Link>
      </CardFooter>
    </Card>
  )
}
