-- Migration 005: FOI Requests
-- Snapshot approach: subject_line, legal_basis, body_final are copied from the
-- template at submission time to create an immutable legal record.

CREATE TYPE foi_request_status AS ENUM (
  'sent',
  'responded',
  'no_response',
  'withdrawn'
);

CREATE TABLE public.foi_requests (
  request_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               UUID NOT NULL REFERENCES public.organisations(org_id),
  template_id          UUID NOT NULL REFERENCES public.foi_templates(template_id),
  country              CHAR(2) NOT NULL,
  submitted_by         UUID NOT NULL REFERENCES auth.users(id),

  -- Immutable snapshot of the letter as submitted
  subject_line         TEXT NOT NULL,
  legal_basis          TEXT NOT NULL,
  body_final           TEXT NOT NULL,
  system_name          TEXT,                   -- Optional: specific system name queried
  sender_name          TEXT NOT NULL,
  sender_email         TEXT NOT NULL,
  sender_organisation  TEXT,

  -- Tracking
  status               foi_request_status NOT NULL DEFAULT 'sent',
  submitted_date       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  response_date        TIMESTAMPTZ,

  -- Always public for MVP
  public               BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_requests_org_id       ON public.foi_requests(org_id);
CREATE INDEX idx_requests_submitted_by ON public.foi_requests(submitted_by);
CREATE INDEX idx_requests_country      ON public.foi_requests(country);
CREATE INDEX idx_requests_status       ON public.foi_requests(status);
CREATE INDEX idx_requests_public       ON public.foi_requests(public) WHERE public = TRUE;
