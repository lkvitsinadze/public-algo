import { ConfirmStep } from '@/components/request/ConfirmStep'

interface Props {
  searchParams: Promise<{
    country?: string
    org_id?: string
    org_name?: string
  }>
}

export default async function RequestConfirmPage({ searchParams }: Props) {
  const { country = 'NL', org_id, org_name } = await searchParams

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Review and Submit</h1>
      <p className="text-muted-foreground mb-8">
        Check your request details and submit. You will receive the final letter to send
        manually to the organisation.
      </p>

      <ConfirmStep country={country} orgId={org_id} orgName={org_name} />
    </div>
  )
}
