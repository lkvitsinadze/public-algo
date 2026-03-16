import { SenderForm } from '@/components/request/SenderForm'
import { createClient } from '@/lib/supabase/server'

interface Props {
  searchParams: Promise<{
    country?: string
    org_id?: string
    org_name?: string
  }>
}

export default async function RequestSenderPage({ searchParams }: Props) {
  const { country = 'NL', org_id, org_name } = await searchParams

  // Pre-fill sender details from the user's profile
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let prefillName = ''
  let prefillEmail = ''
  let prefillOrg = ''

  if (user) {
    prefillEmail = user.email ?? ''
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name, organisation')
      .eq('user_id', user.id)
      .single()
    prefillName = profile?.name ?? ''
    prefillOrg = profile?.organisation ?? ''
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Your Details</h1>
      <p className="text-muted-foreground mb-8">
        These details will appear on your request and become part of the public record.
      </p>

      <SenderForm
        country={country}
        orgId={org_id}
        orgName={org_name}
        prefillName={prefillName}
        prefillEmail={prefillEmail}
        prefillOrg={prefillOrg}
      />
    </div>
  )
}
