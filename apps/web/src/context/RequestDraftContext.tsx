'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { FoiWizardDraft } from '@/types/domain'

interface RequestDraftContextValue {
  draft: FoiWizardDraft
  updateDraft: (updates: Partial<FoiWizardDraft>) => void
  clearDraft: () => void
}

const RequestDraftContext = createContext<RequestDraftContextValue | null>(null)

export function RequestDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<FoiWizardDraft>({})

  function updateDraft(updates: Partial<FoiWizardDraft>) {
    setDraft((prev) => ({ ...prev, ...updates }))
  }

  function clearDraft() {
    setDraft({})
  }

  return (
    <RequestDraftContext.Provider value={{ draft, updateDraft, clearDraft }}>
      {children}
    </RequestDraftContext.Provider>
  )
}

export function useRequestDraft() {
  const ctx = useContext(RequestDraftContext)
  if (!ctx) throw new Error('useRequestDraft must be used inside RequestDraftProvider')
  return ctx
}
