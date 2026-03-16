'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  COUNTRY_NAMES,
  DOMAIN_LABELS,
  RISK_LABELS,
  SOURCE_LABELS,
} from '@/types/domain'
import type { SystemDomain, EuRiskCategory, SystemSource } from '@/types/database'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'alphabetical', label: 'A – Z' },
]

export function SystemFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [country, setCountry] = useState(searchParams.get('country') ?? '')
  const [domain, setDomain] = useState(searchParams.get('domain') ?? '')
  const [riskCategory, setRiskCategory] = useState(searchParams.get('riskCategory') ?? '')
  const [source, setSource] = useState(searchParams.get('source') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'newest')

  const hasActiveFilters =
    search !== '' ||
    country !== '' ||
    domain !== '' ||
    riskCategory !== '' ||
    source !== '' ||
    sort !== 'newest'

  const buildParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams()
      const values: Record<string, string> = {
        search,
        country,
        domain,
        riskCategory,
        source,
        sort,
        ...overrides,
      }
      for (const [key, value] of Object.entries(values)) {
        if (value && value !== '') {
          params.set(key, value)
        }
      }
      // Reset to page 1 on filter change
      params.delete('page')
      return params.toString()
    },
    [search, country, domain, riskCategory, source, sort]
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/explore?' + buildParams({ search }))
    }, 300)
    return () => clearTimeout(timer)
    // Only run when search changes; other filters use their own onChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function handleCountryChange(value: string | null) {
    const next = value ?? ''
    setCountry(next)
    router.push('/explore?' + buildParams({ country: next }))
  }

  function handleDomainChange(value: string | null) {
    const next = value ?? ''
    setDomain(next)
    router.push('/explore?' + buildParams({ domain: next }))
  }

  function handleRiskCategoryChange(value: string | null) {
    const next = value ?? ''
    setRiskCategory(next)
    router.push('/explore?' + buildParams({ riskCategory: next }))
  }

  function handleSourceChange(value: string | null) {
    const next = value ?? ''
    setSource(next)
    router.push('/explore?' + buildParams({ source: next }))
  }

  function handleSortChange(value: string | null) {
    const next = value ?? 'newest'
    setSort(next)
    router.push('/explore?' + buildParams({ sort: next }))
  }

  function handleClearFilters() {
    setSearch('')
    setCountry('')
    setDomain('')
    setRiskCategory('')
    setSource('')
    setSort('newest')
    router.push('/explore')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search-input">Search</Label>
        <Input
          id="search-input"
          type="search"
          placeholder="Search systems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Country</Label>
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full">
            {country ? (
              <span>{COUNTRY_NAMES[country]}</span>
            ) : (
              <span className="text-muted-foreground">All countries</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Domain</Label>
        <Select value={domain} onValueChange={handleDomainChange}>
          <SelectTrigger className="w-full">
            {domain ? (
              <span>{DOMAIN_LABELS[domain as SystemDomain]}</span>
            ) : (
              <span className="text-muted-foreground">All domains</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(DOMAIN_LABELS) as [SystemDomain, string][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>EU AI Act Risk</Label>
        <Select
          value={riskCategory}
          onValueChange={handleRiskCategoryChange}
        >
          <SelectTrigger className="w-full">
            {riskCategory ? (
              <span>{RISK_LABELS[riskCategory as EuRiskCategory]}</span>
            ) : (
              <span className="text-muted-foreground">All risk levels</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(RISK_LABELS) as [EuRiskCategory, string][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Source</Label>
        <Select value={source} onValueChange={handleSourceChange}>
          <SelectTrigger className="w-full">
            {source ? (
              <span>{SOURCE_LABELS[source as SystemSource]}</span>
            ) : (
              <span className="text-muted-foreground">All sources</span>
            )}
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(SOURCE_LABELS) as [SystemSource, string][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Sort by</Label>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={handleClearFilters} className="w-full">
          Clear filters
        </Button>
      )}
    </div>
  )
}
