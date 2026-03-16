import { RequestDraftProvider } from '@/context/RequestDraftContext'
import { Card, CardContent } from '@/components/ui/card'

const STEPS = [
  { label: 'Country', href: '/request' },
  { label: 'Organisation', href: '/request/organisation' },
  { label: 'Review', href: '/request/review' },
  { label: 'Compose', href: '/request/compose' },
  { label: 'Your details', href: '/request/sender' },
  { label: 'Submit', href: '/request/confirm' },
]

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequestDraftProvider>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="py-4">
            <nav aria-label="FOI request steps">
              <ol className="flex items-center gap-0">
                {STEPS.map((step, i) => (
                  <li key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {i + 1}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-8 sm:w-12 h-px bg-border mx-1 mb-4" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </CardContent>
        </Card>

        {children}
      </div>
    </RequestDraftProvider>
  )
}
