-- Seed: Estonia Organisations

INSERT INTO public.organisations (name, country, sector, website, foi_email) VALUES
  ('Siseministeerium', 'EE', 'government', 'https://www.siseministeerium.ee', NULL),
  ('Majandus- ja Kommunikatsiooniministeerium', 'EE', 'government', 'https://mkm.ee', NULL),
  ('Politsei- ja Piirivalveamet', 'EE', 'police', 'https://www.politsei.ee', NULL),
  ('Töötukassa', 'EE', 'agency', 'https://www.tootukassa.ee', NULL),
  ('Haridus- ja Noorteamet', 'EE', 'agency', 'https://harno.ee', NULL),
  ('Tallinna Linnavalitsus', 'EE', 'municipality', 'https://www.tallinn.ee', NULL),
  ('Andmekaitse Inspektsioon', 'EE', 'regulator', 'https://www.aki.ee', NULL),
  ('Riigi Infosüsteemi Amet (RIA)', 'EE', 'agency', 'https://ria.ee', NULL),
  ('Sotsiaalkindlustusamet', 'EE', 'agency', 'https://sotsiaalkindlustusamet.ee', NULL),
  ('Maksu- ja Tolliamet', 'EE', 'agency', 'https://www.emta.ee', NULL)
ON CONFLICT (name, country) DO NOTHING;
