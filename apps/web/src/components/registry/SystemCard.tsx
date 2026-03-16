import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RiskBadge } from '@/components/shared/RiskBadge'
import type { AlgorithmSystemWithOrg } from '@/types/database'
import { COUNTRY_FLAGS, DOMAIN_LABELS, SOURCE_LABELS } from '@/types/domain'

interface SystemCardProps {
  system: AlgorithmSystemWithOrg
}

export function SystemCard({ system }: SystemCardProps) {
  const countryFlag = COUNTRY_FLAGS[system.country] ?? ''
  const domainLabel = DOMAIN_LABELS[system.domain]
  const sourceLabel = SOURCE_LABELS[system.source]

  const deploymentYear = system.deployment_date
    ? new Date(system.deployment_date).getFullYear()
    : null

  return (
    <Link href={`/system/${system.system_id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md hover:ring-foreground/20">
        <CardHeader>
          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {system.name}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
            <span>{countryFlag}</span>
            <span>{system.organisations.name}</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{domainLabel}</Badge>
            <RiskBadge category={system.eu_risk_category} />
          </div>

          {system.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {system.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{sourceLabel}</span>
            {deploymentYear && (
              <>
                <span className="text-border">·</span>
                <span>Deployed {deploymentYear}</span>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <span className="text-sm text-primary font-medium group-hover:underline">
            View dossier →
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
