import Link from 'next/link'
import { Suspense } from 'react'
import { getSystems } from '@/actions/systems'
import { SystemCard } from '@/components/registry/SystemCard'
import { SystemFilters } from '@/components/registry/SystemFilters'
import { Button } from '@/components/ui/button'

type SearchParams = Record<string, string | string[]>

interface ExplorePageProps {
  searchParams: Promise<SearchParams>
}

function getString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function getNumber(value: string | string[] | undefined, fallback: number): number {
  const str = getString(value)
  const parsed = parseInt(str, 10)
  return isNaN(parsed) ? fallback : parsed
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams

  const filters = {
    search: getString(params.search),
    country: getString(params.country),
    domain: getString(params.domain),
    riskCategory: getString(params.riskCategory),
    source: getString(params.source),
    sort: getString(params.sort) || 'newest',
    page: getNumber(params.page, 1),
  }

  const { data: systems, count, error } = await getSystems(filters)

  const pageSize = 20
  const currentPage = filters.page
  const totalPages = Math.ceil(count / pageSize)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  function buildPageUrl(page: number) {
    const p = new URLSearchParams()
    if (filters.search) p.set('search', filters.search)
    if (filters.country) p.set('country', filters.country)
    if (filters.domain) p.set('domain', filters.domain)
    if (filters.riskCategory) p.set('riskCategory', filters.riskCategory)
    if (filters.source) p.set('source', filters.source)
    if (filters.sort && filters.sort !== 'newest') p.set('sort', filters.sort)
    p.set('page', String(page))
    return '/explore?' + p.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Algorithm Registry</h1>
          <p className="mt-2 text-muted-foreground">
            Browse AI and algorithmic systems used by government bodies across Europe.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-6">
              <h2 className="text-sm font-semibold mb-4 text-foreground">Filters</h2>
              <Suspense>
                <SystemFilters />
              </Suspense>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {error ? (
                  <span className="text-destructive">Failed to load systems.</span>
                ) : (
                  <>
                    <span className="font-medium text-foreground">{count.toLocaleString()}</span>
                    {' '}
                    {count === 1 ? 'system' : 'systems'} found
                  </>
                )}
              </p>
            </div>

            {/* No results */}
            {!error && systems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <p className="text-lg font-medium">No systems match your filters</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms or clearing filters.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/explore">Clear filters</Link>
                </Button>
              </div>
            )}

            {/* Results grid */}
            {systems.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {systems.map((system) => (
                    <SystemCard key={system.system_id} system={system} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <Button variant="outline" asChild disabled={!hasPrev}>
                      {hasPrev ? (
                        <Link href={buildPageUrl(currentPage - 1)}>← Previous</Link>
                      ) : (
                        <span>← Previous</span>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>

                    <Button variant="outline" asChild disabled={!hasNext}>
                      {hasNext ? (
                        <Link href={buildPageUrl(currentPage + 1)}>Next →</Link>
                      ) : (
                        <span>Next →</span>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
