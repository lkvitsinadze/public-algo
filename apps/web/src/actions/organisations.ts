'use server'

import { createClient } from '@/lib/supabase/server'
import type { Organisation } from '@/types/database'

// Search organisations by name within a specific country
export async function searchOrganisations(
  country: string,
  query: string
): Promise<{ data: Organisation[]; error: string | null }> {
  const supabase = await createClient()

  let q = supabase
    .from('organisations')
    .select('*')
    .eq('country', country)
    .order('name')

  if (query.trim()) {
    q = q.ilike('name', `%${query.trim()}%`)
  }

  const { data, error } = await q.limit(20)

  return {
    data: (data ?? []) as Organisation[],
    error: error?.message ?? null,
  }
}

// Get a single organisation by ID
export async function getOrganisationById(
  orgId: string
): Promise<{ data: Organisation | null; error: string | null }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('org_id', orgId)
    .single()

  return {
    data: (data as Organisation | null) ?? null,
    error: error?.code === 'PGRST116' ? null : (error?.message ?? null),
  }
}

// Insert a new organisation (used when user types an org not in the list)
export async function createOrganisation(input: {
  name: string
  country: string
  sector?: string
  website?: string
}): Promise<{ data: Organisation | null; error: string | null }> {
  const supabase = await createClient()

  // Check if it already exists (race condition guard)
  const { data: existing } = await supabase
    .from('organisations')
    .select('*')
    .eq('name', input.name)
    .eq('country', input.country)
    .maybeSingle()

  if (existing) {
    return { data: existing as Organisation, error: null }
  }

  const { data, error } = await supabase
    .from('organisations')
    .insert({
      name: input.name,
      country: input.country,
      sector: input.sector ?? null,
      website: input.website ?? null,
    })
    .select()
    .single()

  return {
    data: (data as Organisation | null) ?? null,
    error: error?.message ?? null,
  }
}

// Get FOI request count for an organisation (for the review step)
export async function getOrgRequestCount(orgId: string): Promise<number> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('foi_requests')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('public', true)

  return count ?? 0
}
