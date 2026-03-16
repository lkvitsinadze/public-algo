import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getOrganisationById, getOrgRequestCount } from '@/actions/organisations'
import { COUNTRY_FLAGS } from '@/types/domain'

interface Props {
  searchParams: Promise<{
    country?: string
    org_id?: string
    org_name?: string
  }>
}

export default async function RequestReviewPage({ searchParams }: Props) {
  const { country = 'NL', org_id, org_name } = await searchParams

  let orgName = org_name ?? 'Unknown organisation'
  let sector: string | null = null
  let website: string | null = null
  let requestCount = 0

  // Load existing org if we have an ID
  if (org_id) {
    const { data: org } = await getOrganisationById(org_id)
    if (org) {
      orgName = org.name
      sector = org.sector
      website = org.website
      requestCount = await getOrgRequestCount(org_id)
    }
  }

  // Build the params for the compose step
  const composeParams = new URLSearchParams({ country })
  if (org_id) composeParams.set('org_id', org_id)
  if (org_name) composeParams.set('org_name', org_name)

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{COUNTRY_FLAGS[country] ?? '🏳️'}</span>
        <h1 className="text-2xl font-bold">Review Organisation</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Review what is already known about this organisation before filing your request.
      </p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-1">{orgName}</h2>
          {sector && (
            <p className="text-sm text-muted-foreground capitalize mb-1">{sector}</p>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {website}
            </a>
          )}
        </CardContent>
      </Card>

      {/* Existing requests count */}
      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        {requestCount > 0 ? (
          <p className="text-sm">
            <strong>{requestCount}</strong> FOI{' '}
            {requestCount === 1 ? 'request has' : 'requests have'} already been filed to this
            organisation via PublicAlgo.{' '}
            {org_id && (
              <Link
                href={`/requests?org_id=${org_id}`}
                className="text-primary hover:underline"
              >
                View them →
              </Link>
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No requests have been filed to this organisation yet. Yours would be the first.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/request/organisation?country=${country}`}>← Back</Link>
        </Button>
        <Button asChild>
          <Link href={`/request/compose?${composeParams.toString()}`}>
            File a Transparency Request →
          </Link>
        </Button>
      </div>
    </div>
  )
}
