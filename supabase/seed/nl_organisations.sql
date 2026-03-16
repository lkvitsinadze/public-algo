-- Seed: Netherlands Organisations
-- Run after migrations

INSERT INTO public.organisations (name, country, sector, website, foi_email) VALUES
  ('Ministerie van Binnenlandse Zaken en Koninkrijksrelaties', 'NL', 'government', 'https://www.rijksoverheid.nl/ministeries/bzk', 'info@minbzk.nl'),
  ('Ministerie van Justitie en Veiligheid', 'NL', 'government', 'https://www.rijksoverheid.nl/ministeries/jenv', NULL),
  ('Ministerie van Sociale Zaken en Werkgelegenheid', 'NL', 'government', 'https://www.rijksoverheid.nl/ministeries/szw', NULL),
  ('Uitvoeringsinstituut Werknemersverzekeringen (UWV)', 'NL', 'agency', 'https://www.uwv.nl', 'info@uwv.nl'),
  ('Dienst Uitvoering Onderwijs (DUO)', 'NL', 'agency', 'https://duo.nl', NULL),
  ('Belastingdienst', 'NL', 'agency', 'https://www.belastingdienst.nl', NULL),
  ('Sociale Verzekeringsbank (SVB)', 'NL', 'agency', 'https://www.svb.nl', NULL),
  ('Immigratie en Naturalisatiedienst (IND)', 'NL', 'agency', 'https://ind.nl', NULL),
  ('Centraal Bureau voor de Statistiek (CBS)', 'NL', 'agency', 'https://www.cbs.nl', NULL),
  ('Politie Nederland', 'NL', 'police', 'https://www.politie.nl', NULL),
  ('Rijksdienst voor Identiteitsgegevens (RvIG)', 'NL', 'agency', 'https://www.rvig.nl', NULL),
  ('Autoriteit Persoonsgegevens', 'NL', 'regulator', 'https://autoriteitpersoonsgegevens.nl', NULL),
  ('Gemeente Amsterdam', 'NL', 'municipality', 'https://www.amsterdam.nl', NULL),
  ('Gemeente Rotterdam', 'NL', 'municipality', 'https://www.rotterdam.nl', NULL),
  ('Gemeente Den Haag', 'NL', 'municipality', 'https://www.denhaag.nl', NULL),
  ('Gemeente Utrecht', 'NL', 'municipality', 'https://www.utrecht.nl', NULL)
ON CONFLICT (name, country) DO NOTHING;
