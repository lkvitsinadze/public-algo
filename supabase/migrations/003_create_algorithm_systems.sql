-- Migration 003: Algorithm Systems

CREATE TYPE system_domain AS ENUM (
  'welfare',
  'policing',
  'immigration',
  'border',
  'public_services',
  'other'
);

CREATE TYPE system_source AS ENUM (
  'dutch_register',
  'community',
  'foi_response'
);

CREATE TYPE system_status AS ENUM (
  'confirmed',
  'unverified'
);

CREATE TYPE eu_risk_category AS ENUM (
  'high',
  'limited',
  'minimal',
  'unclassified'
);

CREATE TABLE public.algorithm_systems (
  system_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  org_id           UUID NOT NULL REFERENCES public.organisations(org_id),
  country          CHAR(2) NOT NULL,
  domain           system_domain NOT NULL DEFAULT 'other',
  description      TEXT,
  vendor           TEXT,
  deployment_date  DATE,
  source           system_source NOT NULL DEFAULT 'dutch_register',
  status           system_status NOT NULL DEFAULT 'confirmed',
  eu_risk_category eu_risk_category NOT NULL DEFAULT 'unclassified',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index across name + description
CREATE INDEX idx_systems_fts
  ON public.algorithm_systems
  USING GIN (
    to_tsvector('simple', name || ' ' || COALESCE(description, ''))
  );

CREATE INDEX idx_systems_country       ON public.algorithm_systems(country);
CREATE INDEX idx_systems_domain        ON public.algorithm_systems(domain);
CREATE INDEX idx_systems_risk_category ON public.algorithm_systems(eu_risk_category);
CREATE INDEX idx_systems_source        ON public.algorithm_systems(source);
CREATE INDEX idx_systems_org_id        ON public.algorithm_systems(org_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER systems_updated_at
  BEFORE UPDATE ON public.algorithm_systems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
