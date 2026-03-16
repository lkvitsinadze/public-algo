'use server'

import { createClient } from '@/lib/supabase/server'
import type { FoiRequestWithOrg, FoiRequestStatus } from '@/types/database'
import type { FoiLetterData } from '@/types/domain'
import { createOrganisation } from '@/actions/organisations'
import { getTemplateByCountry } from '@/actions/templates'

const PAGE_SIZE = 20

export async function getRequests(filters: {
  country?: string
  status?: string
  orgId?: string
  page?: number
}): Promise<{ data: FoiRequestWithOrg[]; count: number; error: string | null }> {
  const supabase = await createClient()

  const page = filters.page ?? 1
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('foi_requests')
    .select('*, organisations(name, country)', { count: 'exact' })
    .eq('public', true)

  if (filters.country && filters.country !== '') {
    query = query.eq('country', filters.country)
  }

  if (filters.status && filters.status !== '') {
    query = query.eq('status', filters.status)
  }

  if (filters.orgId && filters.orgId !== '') {
    query = query.eq('org_id', filters.orgId)
  }

  query = query.order('submitted_date', { ascending: false })
  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query

  if (error) {
    return { data: [], count: 0, error: error.message }
  }

  return {
    data: (data ?? []) as FoiRequestWithOrg[],
    count: count ?? 0,
    error: null,
  }
}

export async function getRequestById(requestId: string): Promise<{
  data: FoiRequestWithOrg | null
  error: string | null
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('foi_requests')
    .select('*, organisations(name, country)')
    .eq('request_id', requestId)
    .eq('public', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return { data: null, error: null }
    }
    return { data: null, error: error.message }
  }

  return { data: data as FoiRequestWithOrg, error: null }
}

export async function updateRequestStatus(
  requestId: string,
  status: FoiRequestStatus
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: existing, error: fetchError } = await supabase
    .from('foi_requests')
    .select('request_id')
    .eq('request_id', requestId)
    .eq('submitted_by', user.id)
    .single()

  if (fetchError || !existing) {
    return { error: 'Not authorised' }
  }

  const updatePayload: { status: FoiRequestStatus; response_date?: string } = { status }

  if (status === 'responded') {
    updatePayload.response_date = new Date().toISOString().split('T')[0]
  }

  const { error: updateError } = await supabase
    .from('foi_requests')
    .update(updatePayload)
    .eq('request_id', requestId)
    .eq('submitted_by', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  return { error: null }
}

// Create a new FOI request (called from Step 6: Confirm)
// Security: subject_line and legal_basis are always fetched from DB — never from client input.
export async function createFoiRequest(input: {
  country: string
  orgId?: string         // Existing org UUID
  orgName?: string       // New org name (if orgId not provided)
  bodyEdited: string     // User-edited body text
  systemName?: string
  senderName: string
  senderEmail: string
  senderOrganisation?: string
}): Promise<{ data: FoiLetterData | null; error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: 'You must be signed in to file a request.' }
  }

  // Resolve or create the organisation
  let orgId = input.orgId
  let orgName = ''

  if (!orgId && input.orgName) {
    const { data: newOrg, error: orgError } = await createOrganisation({
      name: input.orgName,
      country: input.country,
    })
    if (orgError || !newOrg) {
      return { data: null, error: orgError ?? 'Failed to create organisation.' }
    }
    orgId = newOrg.org_id
    orgName = newOrg.name
  } else if (orgId) {
    const { data: org } = await supabase
      .from('organisations')
      .select('name')
      .eq('org_id', orgId)
      .single()
    orgName = org?.name ?? ''
  }

  if (!orgId) {
    return { data: null, error: 'Organisation is required.' }
  }

  // Fetch the template from DB (subject_line + legal_basis are NEVER accepted from client)
  const { data: template, error: templateError } = await getTemplateByCountry(
    input.country,
    'en'
  )
  if (templateError || !template) {
    return { data: null, error: 'No FOI template found for this country.' }
  }

  // Insert the request
  const { data: inserted, error: insertError } = await supabase
    .from('foi_requests')
    .insert({
      org_id: orgId,
      template_id: template.template_id,
      country: input.country,
      submitted_by: user.id,
      // Snapshot fields — immutable legal record
      subject_line: template.subject_line,
      legal_basis: template.legal_basis,
      body_final: input.bodyEdited,
      system_name: input.systemName ?? null,
      sender_name: input.senderName,
      sender_email: input.senderEmail,
      sender_organisation: input.senderOrganisation ?? null,
      public: true,
    })
    .select('request_id, submitted_date')
    .single()

  if (insertError || !inserted) {
    return { data: null, error: insertError?.message ?? 'Failed to save request.' }
  }

  return {
    data: {
      requestId: inserted.request_id,
      subjectLine: template.subject_line,
      legalBasis: template.legal_basis,
      bodyFinal: input.bodyEdited,
      systemName: input.systemName ?? null,
      senderName: input.senderName,
      senderOrganisation: input.senderOrganisation ?? null,
      orgName,
      country: input.country,
      submittedDate: inserted.submitted_date,
    },
    error: null,
  }
}
