-- Seed: Algorithm Systems (mock/real-ish data for grant demo)
-- Based on publicly known government AI systems in NL and EE

-- Netherlands systems
INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'SyRI (Systeem Risico Indicatie)',
  org_id,
  'NL',
  'welfare',
  'A government algorithmic system used to detect welfare fraud and social benefit fraud by cross-referencing personal data from multiple government databases. The system was struck down by a Dutch court in 2020 for violating privacy rights.',
  NULL,
  '2014-01-01',
  'dutch_register',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Ministerie van Sociale Zaken en Werkgelegenheid' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Predictive Policing System (CATCH)',
  org_id,
  'NL',
  'policing',
  'A crime pattern analysis and predictive policing tool used by the National Police to identify individuals at risk of committing crimes and to allocate police resources based on predicted crime hotspots.',
  'Palantir Technologies',
  '2018-01-01',
  'dutch_register',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Politie Nederland' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Risk Profiling System (IND)',
  org_id,
  'NL',
  'immigration',
  'An algorithmic risk profiling tool used by the Immigration and Naturalisation Service to assess asylum applications and immigration requests, scoring applicants based on country of origin, demographic data, and travel patterns.',
  NULL,
  '2015-01-01',
  'dutch_register',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Immigratie en Naturalisatiedienst (IND)' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'STAR (Systeem Toewijzing Arbeidsmarkt Reïntegratie)',
  org_id,
  'NL',
  'welfare',
  'A job-matching and labour market reintegration algorithm used by UWV to match unemployed individuals to job vacancies and to assess the probability of re-employment. Used to prioritise case worker attention.',
  NULL,
  '2016-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Uitvoeringsinstituut Werknemersverzekeringen (UWV)' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Automated Tax Assessment System',
  org_id,
  'NL',
  'public_services',
  'An automated system used by the Dutch Tax Authority to process and assess income tax returns, flag anomalies for manual review, and issue automated assessments. Part of the broader digital tax infrastructure.',
  NULL,
  '2010-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Belastingdienst' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Fraude Signalering Voorziening (FSV)',
  org_id,
  'NL',
  'public_services',
  'A fraud signalling system maintained by the Dutch Tax Authority that maintains a list of citizens suspected of tax fraud. The system was implicated in the childcare benefits scandal (toeslagenaffaire), wrongfully flagging thousands of families.',
  NULL,
  '2012-01-01',
  'foi_response',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Belastingdienst' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Student Finance Risk Model (DUO)',
  org_id,
  'NL',
  'public_services',
  'An algorithmic system used by DUO (Education Executive Agency) to detect potential fraud in student finance applications by cross-referencing registration data, housing records, and financial information.',
  NULL,
  '2017-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Dienst Uitvoering Onderwijs (DUO)' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Risicoclassificatiemodel Bijstand (Amsterdam)',
  org_id,
  'NL',
  'welfare',
  'A risk classification model used by the Municipality of Amsterdam to assess the risk of social benefit fraud among welfare recipients. The model uses sociodemographic factors to score claimants for targeted inspection.',
  'Accenture',
  '2019-01-01',
  'community',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Gemeente Amsterdam' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Slimme Camera Systeem (Rotterdam Harbour)',
  org_id,
  'NL',
  'border',
  'An AI-powered camera and sensor system deployed at Rotterdam Harbour for automated detection of suspicious activity, contraband screening, and vehicle recognition. Operated in collaboration with customs authorities.',
  NULL,
  '2020-01-01',
  'dutch_register',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Gemeente Rotterdam' AND country = 'NL';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Sociale Dienst Risk Scoring (Den Haag)',
  org_id,
  'NL',
  'welfare',
  'A risk scoring system used by The Hague municipality social services to prioritise welfare claimants for additional verification checks based on machine learning predictions of non-compliance likelihood.',
  NULL,
  '2020-01-01',
  'community',
  'unverified',
  'high'
FROM public.organisations WHERE name = 'Gemeente Den Haag' AND country = 'NL';

-- Estonia systems
INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'X-Road Data Exchange Platform',
  org_id,
  'EE',
  'public_services',
  'The backbone of Estonia''s digital infrastructure — an interoperability platform that connects government information systems and enables secure data exchange between public and private sector databases.',
  'Cybernetica',
  '2001-01-01',
  'dutch_register',
  'confirmed',
  'minimal'
FROM public.organisations WHERE name = 'Riigi Infosüsteemi Amet (RIA)' AND country = 'EE';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'KAIRI (AI-Assisted Job Matching)',
  org_id,
  'EE',
  'welfare',
  'An AI system used by the Estonian Unemployment Insurance Fund to match jobseekers with suitable vacancies and to predict the risk of long-term unemployment, enabling personalised reintegration support.',
  NULL,
  '2021-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Töötukassa' AND country = 'EE';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'BÜROKRATT (Government Virtual Assistant)',
  org_id,
  'EE',
  'public_services',
  'Estonia''s national AI-powered virtual assistant that allows citizens to interact with government services via a conversational AI interface. The system handles queries across multiple agencies including tax, education, and social services.',
  NULL,
  '2022-01-01',
  'dutch_register',
  'confirmed',
  'minimal'
FROM public.organisations WHERE name = 'Riigi Infosüsteemi Amet (RIA)' AND country = 'EE';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Automated Border Control (e-Gate)',
  org_id,
  'EE',
  'border',
  'Automated passport and biometric verification systems deployed at Estonian border crossings. The e-Gate system uses facial recognition and document verification algorithms to automate entry checks.',
  NULL,
  '2016-01-01',
  'dutch_register',
  'confirmed',
  'high'
FROM public.organisations WHERE name = 'Politsei- ja Piirivalveamet' AND country = 'EE';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Tax Compliance Risk Model (EMTA)',
  org_id,
  'EE',
  'public_services',
  'A machine learning-based risk assessment model used by the Estonian Tax and Customs Board to identify taxpayers at higher risk of non-compliance and to prioritise audit selection.',
  NULL,
  '2019-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Maksu- ja Tolliamet' AND country = 'EE';

INSERT INTO public.algorithm_systems (name, org_id, country, domain, description, vendor, deployment_date, source, status, eu_risk_category)
SELECT
  'Pension Benefits Eligibility System',
  org_id,
  'EE',
  'welfare',
  'An automated system used by the Social Insurance Board to calculate and determine eligibility for pension and social benefits based on contribution records, age, and disability assessments.',
  NULL,
  '2015-01-01',
  'dutch_register',
  'confirmed',
  'limited'
FROM public.organisations WHERE name = 'Sotsiaalkindlustusamet' AND country = 'EE';
