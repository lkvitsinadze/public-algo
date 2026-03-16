'use client'

import { useState, useTransition } from 'react'
import { updateRequestStatus } from '@/actions/requests'
import { Button } from '@/components/ui/button'
import type { FoiRequestStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/domain'

interface StatusUpdateFormProps {
  requestId: string
  currentStatus: FoiRequestStatus
}

const ALL_STATUSES: FoiRequestStatus[] = ['sent', 'responded', 'no_response', 'withdrawn']

export function StatusUpdateForm({ requestId, currentStatus }: StatusUpdateFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<FoiRequestStatus>(currentStatus)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedStatus === currentStatus) {
      setFeedback({ type: 'error', message: 'Please select a different status.' })
      return
    }

    setFeedback(null)

    startTransition(async () => {
      const { error } = await updateRequestStatus(requestId, selectedStatus)
      if (error) {
        setFeedback({ type: 'error', message: error })
      } else {
        setFeedback({ type: 'success', message: 'Status updated successfully.' })
      }
    })
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-5 py-5">
      <h2 className="text-sm font-semibold mb-4">Update Request Status</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="new-status" className="text-xs font-medium text-muted-foreground">
            New status
          </label>
          <select
            id="new-status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as FoiRequestStatus)
              setFeedback(null)
            }}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="default" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save status'}
        </Button>
      </form>

      {feedback && (
        <p
          className={`mt-3 text-sm ${
            feedback.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-destructive'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  )
}
