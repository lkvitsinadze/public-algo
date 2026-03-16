import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Government AI — Seen, Questioned, Accountable
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          PublicAlgo helps civil society organisations, journalists, and citizens
          discover, document, and challenge AI systems used by European governments.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/explore">Explore the Registry</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/request">File a Transparency Request</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/requests">View All Requests</Link>
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-muted-foreground mb-3">01</div>
              <h3 className="font-semibold mb-2">Find</h3>
              <p className="text-sm text-muted-foreground">
                Search our registry of government AI systems across Europe. Filter by country,
                domain, and EU AI Act risk category.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-muted-foreground mb-3">02</div>
              <h3 className="font-semibold mb-2">Request</h3>
              <p className="text-sm text-muted-foreground">
                File a legally-grounded Freedom of Information request to any government
                organisation. We generate the letter; you send it.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-muted-foreground mb-3">03</div>
              <h3 className="font-semibold mb-2">Document</h3>
              <p className="text-sm text-muted-foreground">
                Track your requests and contribute what you know to build collective
                accountability for algorithmic governance in Europe.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data sources note */}
      <p className="text-center text-sm text-muted-foreground">
        Data sourced from the Dutch AI Register, community submissions, and FOI responses.
      </p>
    </div>
  )
}
