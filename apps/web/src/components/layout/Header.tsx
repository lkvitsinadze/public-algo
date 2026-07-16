'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { SupabaseClient, User } from '@supabase/supabase-js'

const hasSupabaseEnv =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!hasSupabaseEnv) {
      return
    }

    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    if (!hasSupabaseEnv) {
      return
    }

    const supabase: SupabaseClient = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            PublicAlgo
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Registry
            </Link>
            <Link href="/requests" className="hover:text-foreground transition-colors">
              FOI Requests
            </Link>
            <Link href="/request" className="hover:text-foreground transition-colors">
              File a Request
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[160px]">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
