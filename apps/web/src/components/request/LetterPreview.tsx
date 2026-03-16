'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { FoiLetterData } from '@/types/domain'
import { COUNTRY_NAMES } from '@/types/domain'

interface LetterPreviewProps {
  letter: FoiLetterData
}

export function LetterPreview({ letter }: LetterPreviewProps) {
  const formattedDate = new Date(letter.submittedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  async function copyToClipboard() {
    const text = buildLetterText(letter)
    await navigator.clipboard.writeText(text)
    alert('Letter copied to clipboard.')
  }

  function printLetter() {
    window.print()
  }

  return (
    <div>
      {/* Success banner */}
      <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 text-sm text-green-800 mb-6">
        <strong>Request submitted.</strong> Your request has been saved as a public record.
        Copy or download the letter below, then send it to the organisation yourself.
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6 print:hidden">
        <Button onClick={copyToClipboard} variant="outline">
          Copy letter to clipboard
        </Button>
        <Button onClick={printLetter} variant="outline">
          Download / Print as PDF
        </Button>
        <Button asChild>
          <Link href={`/requests/${letter.requestId}`}>Track this request →</Link>
        </Button>
      </div>

      {/* The letter — styled for screen and print */}
      <div
        id="letter"
        className="border rounded-lg p-8 bg-white max-w-2xl font-mono text-sm leading-relaxed print:border-none print:p-0 print:max-w-full"
      >
        {/* Sender block */}
        <div className="mb-6">
          <div>{letter.senderName}</div>
          {letter.senderOrganisation && <div>{letter.senderOrganisation}</div>}
          <div className="text-muted-foreground">[Your address]</div>
          <div className="mt-2">{formattedDate}</div>
        </div>

        {/* Recipient block */}
        <div className="mb-6">
          <div>Freedom of Information Officer</div>
          <div>{letter.orgName}</div>
          <div>{COUNTRY_NAMES[letter.country] ?? letter.country}</div>
        </div>

        <Separator className="my-6" />

        {/* Subject */}
        <div className="mb-4">
          <strong>Subject: {letter.subjectLine}</strong>
        </div>

        {/* Legal basis */}
        <div className="mb-6 text-muted-foreground text-xs">
          Legal basis: {letter.legalBasis}
        </div>

        {/* Body */}
        <div className="whitespace-pre-wrap">{letter.bodyFinal}</div>
      </div>

      {/* Print styles injected inline */}
      <style>{`
        @media print {
          body > *:not(#letter) { display: none !important; }
          header, nav, footer { display: none !important; }
          #letter { display: block !important; }
        }
      `}</style>
    </div>
  )
}

function buildLetterText(letter: FoiLetterData): string {
  const date = new Date(letter.submittedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return [
    letter.senderName,
    letter.senderOrganisation ?? '',
    '',
    date,
    '',
    'Freedom of Information Officer',
    letter.orgName,
    COUNTRY_NAMES[letter.country] ?? letter.country,
    '',
    '---',
    '',
    `Subject: ${letter.subjectLine}`,
    `Legal basis: ${letter.legalBasis}`,
    '',
    letter.bodyFinal,
  ]
    .join('\n')
    .trim()
}
