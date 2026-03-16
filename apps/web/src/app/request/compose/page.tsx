import { getTemplateByCountry } from '@/actions/templates'
import { TemplateEditor } from '@/components/request/TemplateEditor'
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/types/domain'

interface Props {
  searchParams: Promise<{
    country?: string
    org_id?: string
    org_name?: string
  }>
}

export default async function RequestComposePage({ searchParams }: Props) {
  const { country = 'NL', org_id, org_name } = await searchParams

  const { data: template, error } = await getTemplateByCountry(country, 'en')

  if (error || !template) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Compose Request</h1>
        <p className="text-destructive">
          No FOI template is available for {COUNTRY_NAMES[country] ?? country} yet.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{COUNTRY_FLAGS[country] ?? '🏳️'}</span>
        <h1 className="text-2xl font-bold">Compose Your Request</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Review and edit the transparency request letter. Locked fields are set by legal advisors
        and cannot be changed.
      </p>

      <TemplateEditor
        template={template}
        country={country}
        orgId={org_id}
        orgName={org_name}
      />
    </div>
  )
}
