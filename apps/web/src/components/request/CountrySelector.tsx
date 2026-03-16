'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COUNTRY_FLAGS } from '@/types/domain'

const ACTIVE_COUNTRIES = [
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
]

const COMING_SOON_COUNTRIES = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SE', name: 'Sweden' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
]

export function CountrySelector() {
  const router = useRouter()

  function handleSelect(country: string) {
    router.push(`/request/organisation?country=${country}`)
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Active Countries
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {ACTIVE_COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => handleSelect(c.code)}
            className="text-left"
          >
            <Card className="cursor-pointer hover:border-primary hover:shadow-sm transition-all">
              <CardContent className="py-6 px-6 flex items-center gap-4">
                <span className="text-4xl">{c.flag}</span>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    FOI template available
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Coming Soon
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMING_SOON_COUNTRIES.map((c) => (
          <Card key={c.code} className="opacity-50 cursor-not-allowed">
            <CardContent className="py-6 px-6 flex items-center gap-4">
              <span className="text-4xl">{COUNTRY_FLAGS[c.code] ?? '🏳️'}</span>
              <div>
                <div className="font-semibold">{c.name}</div>
                <Badge variant="secondary" className="mt-1 text-xs">
                  Template coming soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
