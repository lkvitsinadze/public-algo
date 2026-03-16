// App-level domain types for the FOI wizard and shared UI state

import type { EuRiskCategory, FoiRequestStatus, SystemDomain, SystemSource } from './database'

// State carried through the FOI wizard steps
export interface FoiWizardDraft {
  country?: string
  orgId?: string            // Existing org UUID
  orgName?: string          // User-typed new org name (if not in DB)
  templateId?: string
  bodyEdited?: string       // User's edited version of the template body
  systemName?: string       // Optional: specific system being asked about
  senderName?: string
  senderEmail?: string
  senderOrganisation?: string
}

// The final letter data returned after createFoiRequest
export interface FoiLetterData {
  requestId: string
  subjectLine: string
  legalBasis: string
  bodyFinal: string
  systemName: string | null
  senderName: string
  senderOrganisation: string | null
  orgName: string
  country: string
  submittedDate: string
}

// Filter state for /explore
export interface SystemFilters {
  search?: string
  countries?: string[]
  domains?: SystemDomain[]
  riskCategories?: EuRiskCategory[]
  sources?: SystemSource[]
  sort?: 'newest' | 'alphabetical'
  page?: number
}

// Filter state for /requests
export interface RequestFilters {
  country?: string
  status?: FoiRequestStatus
  orgId?: string
  page?: number
}

// Active countries for FOI wizard
export const ACTIVE_COUNTRIES = ['NL', 'EE'] as const
export type ActiveCountry = (typeof ACTIVE_COUNTRIES)[number]

export const COUNTRY_NAMES: Record<string, string> = {
  NL: 'Netherlands',
  EE: 'Estonia',
  DE: 'Germany',
  FR: 'France',
  SE: 'Sweden',
  AT: 'Austria',
  BE: 'Belgium',
  FI: 'Finland',
  DK: 'Denmark',
  PL: 'Poland',
}

export const COUNTRY_FLAGS: Record<string, string> = {
  NL: '🇳🇱',
  EE: '🇪🇪',
  DE: '🇩🇪',
  FR: '🇫🇷',
  SE: '🇸🇪',
  AT: '🇦🇹',
  BE: '🇧🇪',
  FI: '🇫🇮',
  DK: '🇩🇰',
  PL: '🇵🇱',
}

export const DOMAIN_LABELS: Record<SystemDomain, string> = {
  welfare: 'Welfare',
  policing: 'Policing',
  immigration: 'Immigration',
  border: 'Border Control',
  public_services: 'Public Services',
  other: 'Other',
}

export const SOURCE_LABELS: Record<SystemSource, string> = {
  dutch_register: 'Dutch AI Register',
  community: 'Community',
  foi_response: 'FOI Response',
}

export const RISK_LABELS: Record<EuRiskCategory, string> = {
  high: 'High Risk',
  limited: 'Limited Risk',
  minimal: 'Minimal Risk',
  unclassified: 'Unclassified',
}

export const STATUS_LABELS: Record<FoiRequestStatus, string> = {
  sent: 'Sent',
  responded: 'Response Received',
  no_response: 'No Response',
  withdrawn: 'Withdrawn',
}
