import { CountrySelector } from '@/components/request/CountrySelector'

export default function RequestCountryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">File an Algorithm Transparency Request</h1>
      <p className="text-muted-foreground mb-8">
        Select the country of the government organisation you want to send a request to.
      </p>
      <CountrySelector />
    </div>
  )
}
