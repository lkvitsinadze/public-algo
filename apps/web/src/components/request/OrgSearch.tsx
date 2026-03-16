'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { searchOrganisations } from '@/actions/organisations'
import type { Organisation } from '@/types/database'

interface OrgSearchProps {
  country: string
}

export function OrgSearch({ country }: OrgSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Organisation[]>([])
  const [showNewOrg, setShowNewOrg] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [isPending, startTransition] = useTransition()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const { data } = await searchOrganisations(country, query)
        setResults(data)
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [query, country])

  // Load all orgs on mount
  useEffect(() => {
    startTransition(async () => {
      const { data } = await searchOrganisations(country, '')
      setResults(data)
    })
  }, [country])

  function selectOrg(org: Organisation) {
    router.push(
      `/request/review?country=${country}&org_id=${org.org_id}&org_name=${encodeURIComponent(org.name)}`
    )
  }

  function submitNewOrg() {
    if (!newOrgName.trim()) return
    router.push(
      `/request/review?country=${country}&org_name=${encodeURIComponent(newOrgName.trim())}`
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="org-search">Search organisations</Label>
        <Input
          id="org-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="mt-1"
          autoFocus
        />
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground">Searching...</p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((org) => (
            <button
              key={org.org_id}
              onClick={() => selectOrg(org)}
              className="w-full text-left"
            >
              <Card className="cursor-pointer hover:border-primary hover:shadow-sm transition-all">
                <CardContent className="py-4 px-4">
                  <div className="font-medium">{org.name}</div>
                  {org.sector && (
                    <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                      {org.sector}
                    </div>
                  )}
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      {results.length === 0 && !isPending && query && (
        <p className="text-sm text-muted-foreground">
          No organisations found for &ldquo;{query}&rdquo;.
        </p>
      )}

      {/* New org panel */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowNewOrg(!showNewOrg)}
          className="text-sm text-primary hover:underline"
        >
          {showNewOrg ? '▾ Hide' : '▸ Organisation not listed? Add it'}
        </button>

        {showNewOrg && (
          <div className="mt-3 space-y-3">
            <div>
              <Label htmlFor="new-org-name">Organisation name</Label>
              <Input
                id="new-org-name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter full organisation name"
                className="mt-1"
              />
            </div>
            <Button
              onClick={submitNewOrg}
              disabled={!newOrgName.trim()}
              variant="outline"
            >
              Continue with this organisation
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
