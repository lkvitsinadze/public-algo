import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSystemById } from '@/actions/systems'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { EuRiskCategory } from '@/types/database'
import {
  COUNTRY_FLAGS,
  COUNTRY_NAMES,
  DOMAIN_LABELS,
  SOURCE_LABELS,
} from '@/types/domain'

type FoiStatus = 'responded' | 'pending' | 'no-response'

interface FoiRequest {
  title: string
  submittedBy: string
  date: string
  status: FoiStatus
}

interface ChatMessage {
  author: 'user' | 'ai'
  body: string
}

interface CommunityContribution {
  initials: string
  text: string
  meta: string
  verified: boolean
}

interface NewsMention {
  source: string
  title: string
  date: string
  autoDetected?: boolean
}

interface RelatedAlgorithm {
  name: string
  meta: string
  risk: 'high' | 'unclassified'
}

interface TimelineEntry {
  date: string
  title: string
}

const mockStats = [
  { label: 'FOI requests', value: '4' },
  { label: 'Responses received', value: '2' },
  { label: 'Documents', value: '7' },
  { label: 'Contributions', value: '3' },
  { label: 'News mentions', value: '5' },
]

const mockFoiRequests: FoiRequest[] = [
  {
    title: 'Request re: algorithmic logic and data sources',
    submittedBy: 'Bits of Freedom',
    date: '14 Jan 2024',
    status: 'responded',
  },
  {
    title: 'Request re: impact assessment documentation',
    submittedBy: 'Anonymous',
    date: '3 Mar 2024',
    status: 'pending',
  },
  {
    title: 'Request re: vendor contract and procurement',
    submittedBy: 'Waag',
    date: '19 Nov 2023',
    status: 'responded',
  },
  {
    title: 'Request re: automated decision appeal process',
    submittedBy: 'Clinic for Digital Rights',
    date: '2 Feb 2025',
    status: 'no-response',
  },
]

const aiSummaryFields = [
  {
    label: 'Disclosed',
    content:
      'General system purpose, data categories used, list of municipalities where deployed.',
  },
  {
    label: 'Withheld',
    content:
      'Algorithmic weighting logic, model accuracy metrics, training data sources.',
  },
  {
    label: 'Technical details',
    content: 'Risk score range 0–100. Threshold for manual review: 70+. Updated quarterly.',
  },
  {
    label: 'Refusal basis',
    content: 'Art. 10 Woo — third party commercial interests (vendor contract).',
  },
]

const chatSuggestions = [
  'What data sources does the system use?',
  'Why was algorithmic logic withheld?',
  'Can the refusal be appealed?',
  'What rights do affected citizens have?',
]

const chatMessages: ChatMessage[] = [
  {
    author: 'user',
    body: 'Why was the algorithmic logic withheld?',
  },
  {
    author: 'ai',
    body:
      "The response cites Article 10 of the Wet open overheid (Woo), specifically the exemption protecting third-party commercial interests. The vendor's weighting methodology is considered a trade secret. This exemption can be challenged if you can demonstrate public interest outweighs commercial harm. The Dutch Administrative Court has precedent for overturning such refusals in algorithmic accountability cases.",
  },
]

const communityContributions: CommunityContribution[] = [
  {
    initials: 'BF',
    text:
      'System is still referenced in internal municipal guidelines despite the 2020 court ruling suspending deployment.',
    meta: 'Bits of Freedom · verified · 12 Feb 2025',
    verified: true,
  },
  {
    initials: 'WA',
    text: 'Vendor identified as Capgemini Netherlands based on procurement register cross-reference.',
    meta: 'Waag · verified · 4 Dec 2023',
    verified: true,
  },
  {
    initials: 'AN',
    text:
      'I was flagged by this system in 2022 and denied housing benefit with no explanation given.',
    meta: 'Anonymous citizen · unverified · 1 Mar 2024',
    verified: false,
  },
]

const newsMentions: NewsMention[] = [
  {
    source: 'NRC',
    title: 'Dutch welfare algorithm violated privacy rights, court rules',
    date: '5 Feb 2020',
    autoDetected: true,
  },
  {
    source: 'The Guardian',
    title: 'Netherlands bans fraud detection algorithm after rights violations',
    date: '6 Feb 2020',
  },
  {
    source: 'Wired',
    title: 'SyRI ruling signals new era for algorithmic accountability in Europe',
    date: '14 Mar 2020',
    autoDetected: true,
  },
  {
    source: 'Politico',
    title: 'EU AI Act fallout: which government systems must now be registered?',
    date: '22 Jan 2025',
  },
]

const relatedAlgorithms: RelatedAlgorithm[] = [
  {
    name: 'SCHUFA Score — Germany',
    meta: 'Same domain · same vendor · 2 shared FOI findings',
    risk: 'high',
  },
  {
    name: 'Fraud Risk Model — Estonia',
    meta: 'Same domain · similar refusal pattern',
    risk: 'high',
  },
  {
    name: 'ROBAS — Czech Republic',
    meta: 'Same domain · Capgemini vendor match',
    risk: 'unclassified',
  },
  {
    name: 'Benefits Scoring Tool — Georgia',
    meta: 'Same domain · community flagged',
    risk: 'unclassified',
  },
]

const timelineEntries: TimelineEntry[] = [
  { date: 'Feb 2025', title: 'FOI on appeal process — no response' },
  { date: 'Jan 2024', title: 'Algorithmic logic withheld — vendor exemption cited' },
  { date: 'Nov 2023', title: 'Procurement contract obtained via Waag FOI' },
  { date: 'Feb 2020', title: 'Court ruled SyRI violates privacy — deployment suspended' },
]

interface SystemPageProps {
  params: Promise<{ id: string }>
}

export default async function SystemPage({ params }: SystemPageProps) {
  const { id } = await params
  const { data: system, error } = await getSystemById(id)

  if (error || !system) {
    notFound()
  }

  const countryName = COUNTRY_NAMES[system.country] ?? system.country
  const countryFlag = COUNTRY_FLAGS[system.country] ?? ''
  const domainLabel = DOMAIN_LABELS[system.domain] ?? 'Unclassified domain'
  const sourceLabel = SOURCE_LABELS[system.source] ?? 'Independent submission'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <BreadcrumbTrail
          countryCode={system.country}
          countryLabel={countryName}
          organisationLabel={system.organisations.name}
          systemLabel={system.name}
        />

        <HeaderCard
          systemName={system.name}
          countryLabel={countryName}
          countryFlag={countryFlag}
          domainLabel={domainLabel}
          sourceLabel={sourceLabel}
          statusLabel={system.status}
          organisation={system.organisations.name}
          description={
            system.description ??
            'Algorithmic risk scoring system used by public agencies to identify potentially fraudulent claims. Cross-references data from multiple government databases.'
          }
          riskCategory={system.eu_risk_category}
        />

        <StatsRow stats={mockStats} />

        <section className="mt-10">
          <div className="mx-auto">
            <SectionLabel>FOI requests</SectionLabel>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <FoiRequestList requests={mockFoiRequests} />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <SectionLabel>AI analysis & document chat</SectionLabel>
          <AiAnalysisCard />
        </section>

        <section className="mt-10">
          <SectionLabel>Community, news & connections</SectionLabel>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <CommunityNewsPanel />
            <RelatedAlgorithmsPanel />
          </div>
        </section>
      </div>
    </div>
  )
}

function BreadcrumbTrail({
  countryCode,
  countryLabel,
  organisationLabel,
  systemLabel,
}: {
  countryCode: string
  countryLabel: string
  organisationLabel: string
  systemLabel: string
}) {
  const breadcrumbs = [
    { href: '/explore', label: 'Explore' },
    { href: `/explore?country=${countryCode}`, label: countryLabel },
    { href: `/explore?search=${encodeURIComponent(organisationLabel)}`, label: organisationLabel },
    { label: systemLabel },
  ]

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.label} className="flex items-center gap-1">
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{crumb.label}</span>
          )}
          {index !== breadcrumbs.length - 1 && <span className="text-border">›</span>}
        </div>
      ))}
    </nav>
  )
}

function HeaderCard({
  systemName,
  countryLabel,
  countryFlag,
  domainLabel,
  sourceLabel,
  statusLabel,
  organisation,
  description,
  riskCategory,
}: {
  systemName: string
  countryLabel: string
  countryFlag: string
  domainLabel: string
  sourceLabel: string
  statusLabel: string
  organisation: string
  description: string
  riskCategory: EuRiskCategory | null
}) {
  const metaBadges = [
    {
      label: countryLabel,
      className: 'bg-blue-50 text-blue-800 border border-blue-100',
    },
    {
      label: domainLabel,
      className: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
    },
    {
      label: sourceLabel,
      className: 'bg-stone-100 text-stone-700 border border-stone-200',
    },
    {
      label: `${statusLabel} deployment`,
      className: 'bg-amber-50 text-amber-700 border border-amber-100 capitalize',
    },
  ]

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <span>{countryFlag}</span>
            <span>{organisation}</span>
          </div>
          <h1 className="text-2xl font-semibold">{systemName}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {riskCategory ? (
              <RiskBadge category={riskCategory} />
            ) : (
              <span className="inline-flex items-center rounded-xl border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                Unclassified risk
              </span>
            )}
            {metaBadges.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-4 flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              AI classification
            </div>
            <p>
              {riskCategory
                ? `Classified as ${riskCategory.toLowerCase()} risk under EU AI Act Annex III.`
                : 'Classification pending under the EU AI Act.'}{' '}
              Governments must register systems like this publicly. <strong>Registration status:</strong> incomplete.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <Button className="w-full justify-between">
            <span>Request algorithm information</span>
            <span aria-hidden>↗</span>
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>Submit what you know</span>
            <span aria-hidden>＋</span>
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>Share this profile</span>
            <span aria-hidden>⤴︎</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatsRow({ stats }: { stats: typeof mockStats }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border/60 bg-muted px-4 py-3">
          <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function FoiRequestList({ requests }: { requests: FoiRequest[] }) {
  const statusMap: Record<FoiStatus, { label: string; dotClass: string; textClass: string }> = {
    responded: {
      label: 'Responded',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700',
    },
    pending: {
      label: 'Pending',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-700',
    },
    'no-response': {
      label: 'No response',
      dotClass: 'bg-muted-foreground',
      textClass: 'text-muted-foreground',
    },
  }

  return (
    <ul className="space-y-3 text-sm">
      {requests.map((request) => (
        <li
          key={request.title}
          className="flex flex-col gap-2 border-b border-border/60 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-center"
        >
          <div className="flex-1">
            <div className="font-medium">{request.title}</div>
            <div className="text-xs text-muted-foreground">
              Filed by {request.submittedBy} · {request.date}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${statusMap[request.status].dotClass}`}
              aria-hidden
            />
            <span className={`text-xs font-medium ${statusMap[request.status].textClass}`}>
              {statusMap[request.status].label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function AiAnalysisCard() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 text-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold">AI-generated summary — FOI response · Bits of Freedom · Jan 2024</div>
          <div className="text-xs text-muted-foreground">
            Based on uploaded document · 34 pages · always verify against original
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          AI summary
        </Badge>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/40 p-4 sm:grid-cols-2">
        {aiSummaryFields.map((field) => (
          <div key={field.label} className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {field.label}
            </div>
            <p className="mt-1 text-sm text-foreground/80">{field.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Ask about this document
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {chatSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted"
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {chatMessages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${
                message.author === 'user' ? 'flex-row-reverse text-right' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  message.author === 'user'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.author === 'user' ? 'You' : 'AI'}
              </div>
              <div
                className={`max-w-xl rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  message.author === 'user'
                    ? 'bg-primary/10 text-primary'
                    : 'border border-border bg-card text-foreground'
                }`}
              >
                {message.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground"
            placeholder="Ask a question about this document…"
            disabled
          />
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground" disabled>
            Ask ↗
          </button>
        </div>
      </div>
    </div>
  )
}

function CommunityNewsPanel() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div>
        <SectionLabel>Community contributions</SectionLabel>
        <div className="space-y-4">
          {communityContributions.map((item) => (
            <div key={item.text} className="flex gap-3 border-b border-border/60 pb-3 last:pb-0 last:border-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {item.initials}
              </div>
              <div>
                <p className="text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground">
                  {item.meta} {item.verified ? '• verified' : '• unverified'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full text-xs">
          + Submit what you know
        </Button>
      </div>

      <div className="mt-6 border-t border-border/60 pt-4">
        <SectionLabel>News mentions</SectionLabel>
        <div className="space-y-3">
          {newsMentions.map((news) => (
            <div key={news.title} className="flex gap-3 border-b border-border/60 pb-3 last:border-none last:pb-0">
              <span className="mt-1 inline-flex w-16 justify-center rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                {news.source}
              </span>
              <div className="flex-1 text-sm">
                <div className="font-medium text-primary">
                  {news.title}{' '}
                  {news.autoDetected && (
                    <span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      auto-detected
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{news.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RelatedAlgorithmsPanel() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <SectionLabel>Related algorithm profiles</SectionLabel>
      <div className="space-y-3">
        {relatedAlgorithms.map((item) => (
          <div key={item.name} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-none last:pb-0">
            <div>
              <div className="text-sm font-semibold text-primary">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.meta}</div>
            </div>
            <Badge
              className={`text-[11px] ${
                item.risk === 'high'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.risk === 'high' ? 'High risk' : 'Unclassified'}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-muted p-4 text-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          AI pattern detected
        </div>
        <p className="mt-1">
          4 welfare scoring systems across the EU share the same vendor and a consistent pattern of
          withholding algorithmic logic under commercial interest exemptions. Refusal rate: 87%.
        </p>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <SectionLabel>Accountability timeline</SectionLabel>
        <div className="space-y-4">
          {timelineEntries.map((entry, index) => (
            <div key={entry.title} className="flex gap-3">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full border-2 border-primary/40 bg-primary/10" />
                {index !== timelineEntries.length - 1 && (
                  <div className="mx-auto h-full w-px flex-1 bg-border/60" />
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{entry.date}</div>
                <div className="text-sm">{entry.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  )
}
