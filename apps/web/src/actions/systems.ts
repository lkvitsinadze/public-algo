'use server'

import { createClient } from '@/lib/supabase/server'
import type { AlgorithmSystemWithOrg } from '@/types/database'

const PAGE_SIZE = 20

export async function getSystems(filters: {
  search?: string
  country?: string
  domain?: string
  riskCategory?: string
  source?: string
  sort?: string
  page?: number
}): Promise<{ data: AlgorithmSystemWithOrg[]; count: number; error: string | null }> {
  const supabase = await createClient()

  const page = filters.page ?? 1
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('algorithm_systems')
    .select('*, organisations(name, country, sector, website)', { count: 'exact' })

  if (filters.search && filters.search.trim() !== '') {
    const search = filters.search.trim()
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (filters.country && filters.country !== '') {
    query = query.eq('country', filters.country)
  }

  if (filters.domain && filters.domain !== '') {
    query = query.eq('domain', filters.domain)
  }

  if (filters.riskCategory && filters.riskCategory !== '') {
    query = query.eq('eu_risk_category', filters.riskCategory)
  }

  if (filters.source && filters.source !== '') {
    query = query.eq('source', filters.source)
  }

  if (filters.sort === 'alphabetical') {
    query = query.order('name', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return {
    data: (data ?? []) as AlgorithmSystemWithOrg[],
    count: count ?? 0,
    error: null,
  }
}

export async function getSystemById(systemId: string): Promise<{
  data: AlgorithmSystemWithOrg | null
  error: string | null
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('algorithm_systems')
    .select('*, organisations(name, country, sector, website)')
    .eq('system_id', systemId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return { data: null, error: null }
    }
    return { data: null, error: error.message }
  }

  return { data: data as AlgorithmSystemWithOrg, error: null }
}

export async function getFoiRequestCountForSystem(systemName: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('foi_requests')
    .select('*', { count: 'exact', head: true })
    .eq('system_name', systemName)
    .eq('public', true)

  if (error || count === null) {
    return 0
  }

  return count
}
