# PublicAlgo

A civic transparency platform for discovering, documenting, and challenging AI systems used by European governments.

## MVP Scope

- Algorithm registry (searchable list + system dossier pages)
- FOI request wizard (generate, submit, track transparency requests)
- Public requests index
- User auth (register, login, email verification)

## Tech Stack

- **Frontend + API**: Next.js 15 (App Router, Server Actions)
- **Database + Auth + Storage**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui

## Project Structure

```
algo-watch/
├── apps/web/          # Next.js app
└── supabase/
    ├── migrations/    # Run these in your Supabase project
    └── seed/          # Seed data for organisations, systems, templates
```

## Setup

### 1. Supabase Project

1. Create a Supabase project at [supabase.com](https://supabase.com) (choose Frankfurt region for EU compliance)
2. In the Supabase SQL editor, run each migration file **in order**:
   - `supabase/migrations/001_create_user_profiles.sql`
   - `supabase/migrations/002_create_organisations.sql`
   - `supabase/migrations/003_create_algorithm_systems.sql`
   - `supabase/migrations/004_create_foi_templates.sql`
   - `supabase/migrations/005_create_foi_requests.sql`
   - `supabase/migrations/006_create_rls_policies.sql`
3. Run seed files **in order**:
   - `supabase/seed/nl_organisations.sql`
   - `supabase/seed/ee_organisations.sql`
   - `supabase/seed/algorithm_systems.sql`
   - `supabase/seed/foi_templates.sql`
4. In Supabase Auth settings:
   - Enable **Email** provider
   - Set **Site URL** to `http://localhost:3000`
   - Add redirect URL: `http://localhost:3000/api/auth/callback`

### 2. Environment Variables

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your Supabase project credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the App

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Regenerating TypeScript Types

After schema changes, regenerate types from your Supabase project:

```bash
npx supabase gen types typescript --project-id <your-project-id> > apps/web/src/types/database.ts
```

## FOI Templates

The `foi_templates` table contains the letter templates for NL and EE. The content is a placeholder and **must be reviewed and approved by a legal advisor** before the grant demo. Templates can be updated directly in the Supabase dashboard without a code deploy.
