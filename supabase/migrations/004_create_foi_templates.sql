-- Migration 004: FOI Templates
-- Templates stored in DB so legal advisor can update without a code deploy

CREATE TABLE public.foi_templates (
  template_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country                  CHAR(2) NOT NULL,
  language                 CHAR(2) NOT NULL,
  subject_line             TEXT NOT NULL,   -- Locked: not editable by requester
  legal_basis              TEXT NOT NULL,   -- Locked: legal citation
  body                     TEXT NOT NULL,   -- Editable default text
  system_name_placeholder  BOOLEAN NOT NULL DEFAULT TRUE,
  active                   BOOLEAN NOT NULL DEFAULT TRUE,
  version                  INTEGER NOT NULL DEFAULT 1,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one active template per country + language combination
CREATE UNIQUE INDEX idx_templates_active_country_lang
  ON public.foi_templates(country, language)
  WHERE active = TRUE;

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON public.foi_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
