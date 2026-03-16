import { Badge } from '@/components/ui/badge'
import type { EuRiskCategory } from '@/types/database'
import { RISK_LABELS } from '@/types/domain'

interface RiskBadgeProps {
  category: EuRiskCategory
}

export function RiskBadge({ category }: RiskBadgeProps) {
  const label = RISK_LABELS[category]

  switch (category) {
    case 'high':
      return (
        <Badge variant="destructive">
          {label}
        </Badge>
      )
    case 'limited':
      return (
        <Badge variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-400">
          {label}
        </Badge>
      )
    case 'minimal':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400">
          {label}
        </Badge>
      )
    case 'unclassified':
      return (
        <Badge variant="secondary">
          {label}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          {label}
        </Badge>
      )
  }
}
