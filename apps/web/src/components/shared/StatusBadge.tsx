import { Badge } from '@/components/ui/badge'
import type { FoiRequestStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/domain'

interface StatusBadgeProps {
  status: FoiRequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status]

  switch (status) {
    case 'sent':
      return (
        <Badge variant="default" className="bg-blue-600 text-white hover:bg-blue-600/80">
          {label}
        </Badge>
      )
    case 'responded':
      return (
        <Badge variant="default" className="bg-green-600 text-white hover:bg-green-600/80">
          {label}
        </Badge>
      )
    case 'no_response':
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          {label}
        </Badge>
      )
    case 'withdrawn':
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
