'use server'

import { createClient } from '@/lib/supabase/server'
import type { FoiTemplate } from '@/types/database'

// Get the active FOI template for a country + language combination
export async function getTemplateByCountry(
  country: string,
  language?: string
): Promise<{ data: FoiTemplate | null; error: string | null }> {
  const supabase = await createClient()

  let q = supabase
    .from('foi_templates')
    .select('*')
    .eq('country', country)
    .eq('active', true)

  // Prefer exact language match; fall back to 'en'
  if (language) {
    q = q.eq('language', language)
  } else {
    q = q.eq('language', 'en')
  }

  const { data, error } = await q.maybeSingle()

  // If no match for the requested language, fall back to English
  if (!data && language && language !== 'en') {
    return getTemplateByCountry(country, 'en')
  }

  return {
    data: data ?? null,
    error: error?.message ?? null,
  }
}

// Get all available templates grouped by country (for the country selector)
export async function getAvailableCountries(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('foi_templates')
    .select('country')
    .eq('active', true)

  if (!data) return []
  return [...new Set(data.map((t) => t.country))]
}
