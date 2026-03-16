'use server'

import { createClient } from '@/lib/supabase/server'

export async function registerUser(
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const country = formData.get('country') as string
  const organisation = (formData.get('organisation') as string) || null

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        country,
        organisation,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function loginUser(
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
