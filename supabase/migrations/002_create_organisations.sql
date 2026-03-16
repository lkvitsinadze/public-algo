-- Migration 002: Organisations

CREATE TABLE public.organisations (
  org_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  country    CHAR(2) NOT NULL,
  sector     TEXT,
  website    TEXT,
  foi_email  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, country)
);

-- Full-text search index on name
CREATE INDEX idx_organisations_name_fts
  ON public.organisations
  USING GIN (to_tsvector('simple', name));

CREATE INDEX idx_organisations_country
  ON public.organisations(country);
