-- Migration 006: Row Level Security Policies

-- Enable RLS
ALTER TABLE public.user_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.algorithm_systems  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foi_templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foi_requests       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- user_profiles
-- ============================================================
CREATE POLICY "users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- organisations: public read, authenticated insert
-- ============================================================
CREATE POLICY "public can view organisations"
  ON public.organisations FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "authenticated users can insert organisations"
  ON public.organisations FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- ============================================================
-- algorithm_systems: public read only (seed-managed for MVP)
-- ============================================================
CREATE POLICY "public can view algorithm systems"
  ON public.algorithm_systems FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- ============================================================
-- foi_templates: public read of active templates only
-- ============================================================
CREATE POLICY "public can view active templates"
  ON public.foi_templates FOR SELECT
  TO anon, authenticated
  USING (active = TRUE);

-- ============================================================
-- foi_requests
-- ============================================================
CREATE POLICY "public can view public requests"
  ON public.foi_requests FOR SELECT
  TO anon, authenticated
  USING (public = TRUE);

CREATE POLICY "authenticated users can insert own requests"
  ON public.foi_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "owners can update their requests"
  ON public.foi_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by);
