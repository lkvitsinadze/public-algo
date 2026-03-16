import { OrgSearch } from '@/components/request/OrgSearch'
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '@/types/domain'

interface Props {
  searchParams: Promise<{ country?: string }>
}

export default async function RequestOrganisationPage({ searchParams }: Props) {
  const { country } = await searchParams
  const countryCode = country ?? 'NL'

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{COUNTRY_FLAGS[countryCode] ?? '🏳️'}</span>
        <h1 className="text-2xl font-bold">Select Organisation</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Search for the government organisation in{' '}
        <strong>{COUNTRY_NAMES[countryCode] ?? countryCode}</strong> you want to request
        information from.
      </p>
      <OrgSearch country={countryCode} />
    </div>
  )
}
