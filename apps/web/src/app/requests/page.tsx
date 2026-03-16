import Link from 'next/link'
import { getRequests } from '@/actions/requests'
import { PublicRequestCard } from '@/components/shared/PublicRequestCard'
import { Button } from '@/components/ui/button'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/types/domain'

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{
    country?: string
    status?: string
    page?: string
  }>
}

export default async function RequestsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const country = params.country ?? ''
  const status = params.status ?? ''
  const page = parseInt(params.page ?? '1', 10)

  const { data: requests, count, error } = await getRequests({
    country: country || undefined,
    status: status || undefined,
    page,
  })

  const totalPages = Math.ceil(count / PAGE_SIZE)

  function buildUrl(overrides: Record<string, string | undefined>) {
    const next: Record<string, string> = {}
    if (country) next.country = country
    if (status) next.status = status
    if (page > 1) next.page = String(page)
    Object.assign(next, overrides)
    // Remove empty/undefined keys
    Object.keys(next).forEach((k) => {
      if (!next[k]) delete next[k]
    })
    const qs = new URLSearchParams(next).toString()
    return `/requests${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">FOI Requests</h1>
          <p className="text-muted-foreground">
            Public Freedom of Information requests filed through PublicAlgo.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/request">File a Transparency Request</Link>
        </Button>
      </div>

      {/* Filters */}
      <form method="GET" action="/requests" className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="country" className="text-xs font-medium text-muted-foreground">
            Country
          </label>
          <select
            id="country"
            name="country"
            defaultValue={country}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="">All countries</option>
            <option value="NL">{COUNTRY_FLAGS['NL']} {COUNTRY_NAMES['NL']}</option>
            <option value="EE">{COUNTRY_FLAGS['EE']} {COUNTRY_NAMES['EE']}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="">All statuses</option>
            <option value="sent">Sent</option>
            <option value="responded">Response Received</option>
            <option value="no_response">No Response</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        <Button type="submit" variant="outline" size="default">
          Filter
        </Button>

        {(country || status) && (
          <Button type="button" variant="ghost" size="default" asChild>
            <Link href="/requests">Clear filters</Link>
          </Button>
        )}
      </form>

      {/* Result count */}
      <p className="text-sm text-muted-foreground mb-5">
        {count === 1 ? '1 request' : `${count} requests`}
        {(country || status) && ' matching your filters'}
      </p>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive mb-6">
          Failed to load requests: {error}
        </div>
      )}

      {/* Request list */}
      {!error && requests.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-base mb-2">No requests found.</p>
          {(country || status) && (
            <p className="text-sm">
              Try adjusting your filters or{' '}
              <Link href="/requests" className="text-primary hover:underline">
                clear them
              </Link>
              .
            </p>
          )}
        </div>
      )}

      {!error && requests.length > 0 && (
        <div className="grid gap-4">
          {requests.map((request) => (
            <PublicRequestCard key={request.request_id} request={request} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <div>
            {page > 1 ? (
              <Button variant="outline" asChild>
                <Link href={buildUrl({ page: page > 2 ? String(page - 1) : undefined })}>
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Previous
              </Button>
            )}
          </div>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <div>
            {page < totalPages ? (
              <Button variant="outline" asChild>
                <Link href={buildUrl({ page: String(page + 1) })}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
