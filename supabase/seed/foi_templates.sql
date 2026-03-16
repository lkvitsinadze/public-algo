-- Seed: FOI Templates (NL Dutch, NL English, EE Estonian)
-- NOTE: These are placeholder templates with legally-framed content.
-- Final text must be reviewed and approved by a legal advisor before the grant demo.

-- Netherlands — Dutch (nl/nl)
INSERT INTO public.foi_templates (country, language, subject_line, legal_basis, body, system_name_placeholder, active, version)
VALUES (
  'NL',
  'nl',
  'Verzoek om openbaarmaking op grond van de Woo — algoritmisch systeem',
  'Wet open overheid (Woo), artikel 5.1 en Artikel 22 AVG inzake geautomatiseerde besluitvorming',
  'Geachte heer/mevrouw,

Op grond van de Wet open overheid (Woo) verzoek ik u hierbij om openbaarmaking van informatie betreffende het algoritmisch systeem [SYSTEEM_NAAM] dat door uw organisatie wordt ingezet.

Specifiek verzoek ik om de volgende informatie:

1. Een beschrijving van het doel en de werking van het systeem, inclusief de gebruikte methoden en technieken;
2. De gegevens en databronnen die als input worden gebruikt;
3. De criteria, gewichten en drempelwaarden die in het algoritme worden gehanteerd;
4. De EU AI Act risicoklassificatie en eventuele uitgevoerde DPIA (Data Protection Impact Assessment) of IAMA (Impact Assessment Mensenrechten en Algoritmen);
5. Informatie over menselijk toezicht op geautomatiseerde beslissingen en de mogelijkheden voor bezwaar;
6. Eventuele audits, evaluaties of klachtenrapportages met betrekking tot dit systeem;
7. De naam van de leverancier en eventuele contractuele documenten (met uitzondering van vertrouwelijke bedrijfsinformatie).

Ik verzoek u dit verzoek te behandelen binnen de wettelijke termijn van vier weken als bedoeld in artikel 4.4 van de Woo. Indien een verlenging noodzakelijk is, verzoek ik u mij hiervan tijdig op de hoogte te stellen. Indien u niet of gedeeltelijk aan dit verzoek kunt voldoen, verzoek ik u een deugdelijke motivering te verstrekken met verwijzing naar de toepasselijke weigeringsgronden.

Met vriendelijke groet,

[AFZENDER_NAAM]
[ORGANISATIE]',
  TRUE,
  TRUE,
  1
);

-- Netherlands — English (nl/en)
INSERT INTO public.foi_templates (country, language, subject_line, legal_basis, body, system_name_placeholder, active, version)
VALUES (
  'NL',
  'en',
  'Freedom of Information Request — Algorithmic Decision-Making System',
  'Wet open overheid (Woo — Dutch Open Government Act), Article 5.1 and Article 22 GDPR on automated decision-making',
  'Dear Sir/Madam,

Pursuant to the Wet open overheid (Woo — Open Government Act), I hereby request the disclosure of information concerning the algorithmic system [SYSTEM_NAME] used by your organisation.

Specifically, I request the following information:

1. A description of the purpose and functioning of the system, including the methods and techniques employed;
2. The data and data sources used as input to the system;
3. The criteria, weights, and thresholds applied in the algorithm;
4. The EU AI Act risk classification and any conducted DPIA (Data Protection Impact Assessment) or IAMA (Impact Assessment Human Rights and Algorithms);
5. Information about human oversight of automated decisions and available avenues for appeal;
6. Any audits, evaluations, or complaint reports relating to this system;
7. The name of the vendor and any contractual documents (excluding confidential commercial information).

I request that you respond within the statutory four-week period as provided under Article 4.4 of the Woo. If an extension is necessary, please notify me in advance. If you are unable to comply fully with this request, please provide adequate justification with reference to the applicable exemptions under the Woo.

Yours faithfully,

[SENDER_NAME]
[ORGANISATION]',
  TRUE,
  TRUE,
  1
);

-- Estonia — Estonian (ee/et)
INSERT INTO public.foi_templates (country, language, subject_line, legal_basis, body, system_name_placeholder, active, version)
VALUES (
  'EE',
  'et',
  'Teabenõue avaliku teabe seaduse alusel — algoritmisüsteem',
  'Avaliku teabe seadus (AvTS) § 6 lg 1 ja GDPR artikkel 22 automatiseeritud otsuste tegemise kohta',
  'Austatud ametnik,

Esitan käesolevaga avaliku teabe seaduse (AvTS) § 6 lg 1 alusel teabenõude teie organisatsiooni poolt kasutatava algoritmilise süsteemi [SÜSTEEMI_NIMI] kohta.

Palun esitada järgmine teave:

1. Süsteemi eesmärk ja toimimispõhimõtted, sealhulgas kasutatud meetodid ja tehnikad;
2. Sisendandmete loetelu ja andmeallikad;
3. Algoritmi kriteeriumid, kaalud ja läviväärtused;
4. EL Tehisintellekti seaduse alusel määratud riskiklass ning läbiviidud andmekaitsealane mõjuhinnang (DPIA);
5. Teave inimkontrolli kohta automatiseeritud otsuste üle ning vaidlustamisvõimalused;
6. Süsteemiga seotud auditid, hindamised ja kaebuste lahendamine;
7. Tarnija nimi ja asjakohased lepingulised dokumendid (välja arvatud konfidentsiaalne äriteave).

Palun vastata käesolevale teabenõudele AvTS § 18 lg 1 kohaselt viie tööpäeva jooksul või keerukate päringute puhul 15 tööpäeva jooksul. Keeldumise korral palun esitada põhjendus koos viitega AvTS vastavatele sätetele.

Lugupidamisega,

[SAATJA_NIMI]
[ORGANISATSIOON]',
  TRUE,
  TRUE,
  1
);
