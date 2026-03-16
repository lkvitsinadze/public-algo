import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PublicAlgo — Government AI Transparency',
  description:
    'Discover, document, and challenge AI systems used by European governments. Search the registry, file transparency requests, and build collective accountability.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased min-h-screen bg-background`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
