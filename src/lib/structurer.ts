/**
 * Stoffice — Client Data Structuring Engine v2
 *
 * A powerful parser that handles:
 *  1. Structured markdown documents (## headers, - **Key** : Value)
 *  2. Semi-structured key:value data
 *  3. Free text (emails, CRM exports, notes)
 *
 * Bilingual: German + French vocabulary with massive field mapping.
 */

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

export interface StructuredClientData {
  /* Identity */
  companyName: string;
  tradeName: string;
  legalForm: string;
  registrationId: string;   // SIRET, Handelsregister, UID, etc.
  vatId: string;             // TVA, USt-IdNr, MwSt, etc.

  /* Contact */
  contactPerson: string;
  contactFunction: string;
  contactEmail: string;
  contactPhone: string;
  contactMobile: string;
  website: string;

  /* Address (composed) */
  address: string;

  /* Financial */
  iban: string;
  bic: string;
  paymentTerms: string;
  creditLimit: string;

  /* Portfolio */
  sites: string;
  buildingTypes: string;
  assetTypes: string;

  /* Pain points & project */
  painPoints: string[];
  projectScope: string;
  budget: string;
  timeline: string;
  notes: string;

  /* Overflow — any KV pair that doesn't fit named fields */
  metadata: Record<string, string>;

  confidence: number; // 0–100
}

/* ═══════════════════════════════════════════════════════════════════════
   VOCABULARY — BUILDING & ASSET TYPES
   ═══════════════════════════════════════════════════════════════════════ */

const BUILDING_TYPES_DE = [
  'Büro', 'Bürogebäude', 'Wohnung', 'Wohngebäude', 'Wohnhaus', 'Mehrfamilienhaus',
  'Lager', 'Lagerhaus', 'Logistik', 'Logistikzentrum', 'Industrie', 'Industriegebäude',
  'Spital', 'Krankenhaus', 'Klinik', 'Schule', 'Schulhaus', 'Universität', 'Hochschule',
  'Hotel', 'Einkaufszentrum', 'Geschäft', 'Retail', 'Gewerbe', 'Mischnutzung',
  'Verwaltung', 'Verwaltungsgebäude', 'Rechenzentrum', 'Datacenter', 'Parkhaus',
];
const BUILDING_TYPES_FR = [
  'Bureau', 'Bureaux', 'Immeuble', 'Résidentiel', 'Logement', 'Habitation',
  'Entrepôt', 'Logistique', 'Industrie', 'Industriel', 'Hôpital', 'Clinique',
  'École', 'Université', 'Hôtel', 'Centre commercial', 'Commerce', 'Retail',
  'Mixte', 'Administration', 'Data center', 'Parking',
];
const ALL_BUILDING_TYPES = [...BUILDING_TYPES_DE, ...BUILDING_TYPES_FR];

const ASSET_TYPES_DE = [
  'HVAC', 'Heizung', 'Lüftung', 'Klima', 'Klimaanlage', 'Kälte',
  'Aufzug', 'Lift', 'Elektro', 'Elektrik', 'Starkstrom', 'Schwachstrom',
  'Sanitär', 'Wasser', 'Abwasser', 'Brandschutz', 'Sprinkler', 'BMA',
  'Sicherheit', 'Zutrittskontrolle', 'Gebäudeautomation', 'GLT', 'MSR',
  'Photovoltaik', 'PV', 'Solar', 'Wärmepumpe', 'Beleuchtung', 'Licht',
  'Notstrom', 'USV', 'Generator', 'Kompressor', 'Druckluft',
  'Fassade', 'Dach', 'Fenster', 'Tor', 'Schranke',
];
const ASSET_TYPES_FR = [
  'CVC', 'CVCS', 'Chauffage', 'Ventilation', 'Climatisation', 'Froid',
  'Ascenseur', 'Électricité', 'Courant fort', 'Courant faible',
  'Sanitaire', 'Eau', 'Eaux usées', 'Protection incendie', 'Sprinkler',
  'Sécurité', 'Contrôle d\'accès', 'Gestion technique', 'GTB', 'GTC',
  'Photovoltaïque', 'Solaire', 'Pompe à chaleur', 'Éclairage',
  'Groupe électrogène', 'Onduleur', 'Compresseur', 'Air comprimé',
  'Façade', 'Toiture', 'Fenêtres', 'Portail',
];
const ALL_ASSET_TYPES = [...ASSET_TYPES_DE, ...ASSET_TYPES_FR];

const PAIN_KEYWORDS_DE = [
  'fehlt', 'fehlen', 'fehlend', 'veraltet', 'unvollständig', 'nicht erfasst',
  'nicht verknüpft', 'Chaos', 'chaotisch', 'reaktiv', 'Mangel', 'mangelhaft',
  'Problem', 'problematisch', 'kein', 'keine', 'nicht', 'verloren', 'Verlust',
  'unauffindbar', 'unbrauchbar', 'inkonsistent', 'manuell', 'aufwändig',
  'Zeitverlust', 'Nacharbeit', 'Rework', 'Reibung', 'Verzögerung',
  'heterogen', 'uneinheitlich', 'verstreut', 'Suchzeit', 'Doppelarbeit',
];
const PAIN_KEYWORDS_FR = [
  'manque', 'manquant', 'obsolète', 'incomplet', 'non référencé',
  'non lié', 'chaos', 'réactif', 'défaut', 'problème', 'aucun', 'aucune',
  'pas de', 'perdu', 'perte', 'introuvable', 'inutilisable', 'inconsistant',
  'manuel', 'coûteux', 'retard', 'rework', 'friction', 'délai',
  'hétérogène', 'dispersé', 'temps de recherche', 'double saisie',
];
const ALL_PAIN_KEYWORDS = [...PAIN_KEYWORDS_DE, ...PAIN_KEYWORDS_FR];

const COMPANY_SUFFIXES =
  /\b(AG|GmbH|SA|S\.?A\.?|Sàrl|S\.?à\.?r\.?l\.?|Ltd\.?|Inc\.?|Corp\.?|SE|KG|OHG|e\.?V\.?|Stiftung|Genossenschaft|Co(?:mpany)?|& Co\.?|Cie\.?|Holding|SARL|SAS|SNC|EURL|SCI|SCPI)\b/i;

const TITLE_KEYWORDS =
  /\b(Herr|Frau|Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Ing\.?|Dipl\.?|Monsieur|Madame|Mme\.?|M\.)\b/i;

/* ═══════════════════════════════════════════════════════════════════════
   SECTION CLASSIFICATION
   ═══════════════════════════════════════════════════════════════════════ */

type SectionType =
  | 'general'
  | 'contact'
  | 'address'
  | 'delivery'
  | 'billing'
  | 'banking'
  | 'commercial'
  | 'company'
  | 'notes'
  | 'tracking'
  | 'pains'
  | 'portfolio'
  | 'project'
  | 'unknown';

const SECTION_MAP: Record<string, SectionType> = {
  /* French */
  'informations générales': 'general',
  'informations generale': 'general',
  'général': 'general',
  'identité': 'general',
  'fiche entreprise': 'general',
  'fiche client': 'general',
  'fiche société': 'general',
  'fiche fournisseur': 'general',

  'contact': 'contact',
  'contact principal': 'contact',
  'contacts': 'contact',
  'coordonnées': 'contact',
  'interlocuteur': 'contact',
  'interlocuteur principal': 'contact',
  'référent': 'contact',

  'adresse': 'address',
  'adresse principale': 'address',
  'adresse du siège': 'address',
  'siège social': 'address',
  'adresse de facturation': 'billing',
  'adresse facturation': 'billing',
  'facturation': 'billing',
  'adresse de livraison': 'delivery',
  'adresse livraison': 'delivery',
  'livraison': 'delivery',

  'informations bancaires': 'banking',
  'données bancaires': 'banking',
  'banque': 'banking',
  'coordonnées bancaires': 'banking',
  'rib': 'banking',

  'conditions commerciales': 'commercial',
  'conditions': 'commercial',
  'conditions de vente': 'commercial',

  'informations société': 'company',
  'données société': 'company',
  'données entreprise': 'company',

  'notes': 'notes',
  'remarques': 'notes',
  'commentaires': 'notes',
  'observations': 'notes',
  'suivi': 'tracking',
  'historique': 'tracking',

  'points de douleur': 'pains',
  'problèmes': 'pains',
  'problèmes actuels': 'pains',
  'difficultés': 'pains',

  'portfolio': 'portfolio',
  'portfolio & assets': 'portfolio',
  'parc immobilier': 'portfolio',
  'patrimoine': 'portfolio',

  'projet': 'project',
  'informations projet': 'project',
  'contexte projet': 'project',

  /* German */
  'allgemeine informationen': 'general',
  'allgemeines': 'general',
  'stammdaten': 'general',
  'firmenstammdaten': 'general',
  'kundenstammdaten': 'general',

  'kontakt': 'contact',
  'kontaktdaten': 'contact',
  'hauptkontakt': 'contact',
  'ansprechpartner': 'contact',

  'rechnungsadresse': 'billing',
  'lieferadresse': 'delivery',
  'standortadresse': 'address',
  'geschäftsadresse': 'address',

  'bankverbindung': 'banking',
  'bankdaten': 'banking',

  'geschäftsbedingungen': 'commercial',
  'konditionen': 'commercial',
  'zahlungsbedingungen': 'commercial',

  'unternehmensdaten': 'company',
  'firmendaten': 'company',

  'notizen': 'notes',
  'bemerkungen': 'notes',
  'anmerkungen': 'notes',
  'verlauf': 'tracking',

  'schmerzpunkte': 'pains',
  'probleme': 'pains',
  'ausgangslage': 'pains',

  'projektdaten': 'project',
  'projekt': 'project',
  'projektinformationen': 'project',
};

function classifySection(header: string): SectionType {
  const h = header.toLowerCase().replace(/^#+\s*/, '').replace(/[#*_]/g, '').trim();
  // Exact match
  if (SECTION_MAP[h]) return SECTION_MAP[h];
  // Partial match
  for (const [pattern, type] of Object.entries(SECTION_MAP)) {
    if (h.includes(pattern) || pattern.includes(h)) return type;
  }
  return 'unknown';
}

/* ═══════════════════════════════════════════════════════════════════════
   FIELD VOCABULARY — key label → field mapping
   ═══════════════════════════════════════════════════════════════════════ */

// Fields prefixed with _ are temporary and resolved in post-processing
type FieldTarget = keyof StructuredClientData | `_${string}`;

const FIELD_VOCAB: Record<string, FieldTarget> = {
  /* ── French — Identity ── */
  'raison sociale': 'companyName',
  'nom commercial': 'tradeName',
  'société': 'companyName',
  'entreprise': 'companyName',
  'nom de l\'entreprise': 'companyName',
  'nom de la société': 'companyName',
  'dénomination': 'companyName',
  'dénomination sociale': 'companyName',

  'forme juridique': 'legalForm',
  'statut juridique': 'legalForm',
  'type de société': 'legalForm',

  'siret': 'registrationId',
  'siren': 'registrationId',
  'numéro siret': 'registrationId',
  'n° siret': 'registrationId',
  'numéro rcs': 'registrationId',
  'rcs': 'registrationId',
  'ide': 'registrationId',
  'numéro ide': 'registrationId',
  'n° ide': 'registrationId',
  'registre du commerce': 'registrationId',

  'tva': 'vatId',
  'tva intracommunautaire': 'vatId',
  'n° tva': 'vatId',
  'numéro de tva': 'vatId',
  'numéro tva': 'vatId',

  'code ape': '_industryCode',
  'code naf': '_industryCode',
  'code ape / naf': '_industryCode',
  'code ape/naf': '_industryCode',
  'activité': '_industryCode',

  'capital social': '_capital',
  'capital': '_capital',

  'date de création': '_creationDate',
  'date de création de la fiche': '_creationDate',
  'créé le': '_creationDate',
  'date de création fiche': '_creationDate',

  'numéro client': '_clientNumber',
  'n° client': '_clientNumber',
  'référence client': '_clientNumber',
  'ref client': '_clientNumber',
  'code client': '_clientNumber',

  'type de client': '_clientType',
  'catégorie client': '_clientType',
  'statut': '_status',
  'source prospect': '_source',
  'source': '_source',
  'origine': '_source',

  /* ── French — Contact ── */
  'nom': '_lastName',
  'prénom': '_firstName',
  'civilité': '_civility',
  'personne de contact': 'contactPerson',
  'interlocuteur': 'contactPerson',
  'responsable': 'contactPerson',
  'gérant': 'contactPerson',
  'dirigeant': 'contactPerson',
  'nom du contact': 'contactPerson',
  'nom et prénom': 'contactPerson',

  'fonction': 'contactFunction',
  'poste': 'contactFunction',
  'titre': 'contactFunction',
  'rôle': 'contactFunction',
  'qualité': 'contactFunction',

  'email': 'contactEmail',
  'e-mail': 'contactEmail',
  'mail': 'contactEmail',
  'courriel': 'contactEmail',
  'adresse email': 'contactEmail',
  'adresse e-mail': 'contactEmail',
  'adresse mail': 'contactEmail',

  'téléphone': 'contactPhone',
  'tél': 'contactPhone',
  'tél.': 'contactPhone',
  'tel': 'contactPhone',
  'phone': 'contactPhone',
  'numéro de téléphone': 'contactPhone',
  'téléphone fixe': 'contactPhone',
  'fixe': 'contactPhone',

  'mobile': 'contactMobile',
  'portable': 'contactMobile',
  'gsm': 'contactMobile',
  'natel': 'contactMobile',
  'téléphone mobile': 'contactMobile',
  'téléphone portable': 'contactMobile',
  'cellulaire': 'contactMobile',

  'site web': 'website',
  'site internet': 'website',
  'web': 'website',
  'url': 'website',
  'www': 'website',
  'page web': 'website',

  /* ── French — Address ── */
  'adresse': '_street',
  'rue': '_street',
  'voie': '_street',
  'complément': '_complement',
  'complément d\'adresse': '_complement',
  'bâtiment': '_complement',
  'étage': '_complement',
  'code postal': '_postalCode',
  'cp': '_postalCode',
  'npa': '_postalCode',
  'ville': '_city',
  'localité': '_city',
  'commune': '_city',
  'pays': '_country',

  /* ── French — Financial ── */
  'iban': 'iban',
  'bic': 'bic',
  'swift': 'bic',
  'bic/swift': 'bic',
  'bic / swift': 'bic',
  'conditions de paiement': 'paymentTerms',
  'délai de paiement': 'paymentTerms',
  'échéance': 'paymentTerms',
  'mode de paiement': '_paymentMode',
  'moyen de paiement': '_paymentMode',
  'plafond de crédit': 'creditLimit',
  'plafond d\'encours': 'creditLimit',
  'encours maximum': 'creditLimit',
  'encours max': 'creditLimit',
  'limite de crédit': 'creditLimit',

  /* ── French — Portfolio ── */
  'sites': 'sites',
  'nombre de sites': 'sites',
  'nombre de bâtiments': 'sites',
  'bâtiments': 'buildingTypes',
  'types de bâtiments': 'buildingTypes',
  'type de bâtiment': 'buildingTypes',
  'types d\'installations': 'assetTypes',
  'type d\'installation': 'assetTypes',
  'installations': 'assetTypes',
  'équipements': 'assetTypes',

  /* ── French — Project ── */
  'budget': 'budget',
  'enveloppe': 'budget',
  'périmètre': 'projectScope',
  'périmètre du projet': 'projectScope',
  'scope': 'projectScope',
  'calendrier': 'timeline',
  'planning': 'timeline',
  'délai': 'timeline',
  'date de début': 'timeline',
  'début': 'timeline',

  /* ── German — Identity ── */
  'firmenname': 'companyName',
  'firma': 'companyName',
  'unternehmen': 'companyName',
  'unternehmensname': 'companyName',
  'name der firma': 'companyName',
  'handelsname': 'tradeName',
  'markenname': 'tradeName',

  'rechtsform': 'legalForm',
  'gesellschaftsform': 'legalForm',

  'handelsregister': 'registrationId',
  'hr-nummer': 'registrationId',
  'handelsregisternummer': 'registrationId',
  'uid': 'registrationId',
  'uid-nummer': 'registrationId',
  'firmenbuchnummer': 'registrationId',

  'ust-idnr': 'vatId',
  'ust-id': 'vatId',
  'ust-idnr.': 'vatId',
  'mwst-nr': 'vatId',
  'mwst': 'vatId',
  'mwst-nummer': 'vatId',
  'umsatzsteuer-id': 'vatId',

  'stammkapital': '_capital',
  'grundkapital': '_capital',
  'gründungsdatum': '_creationDate',
  'kundennummer': '_clientNumber',
  'kundentyp': '_clientType',
  'status': '_status',
  'quelle': '_source',

  /* ── German — Contact ── */
  'nachname': '_lastName',
  'familienname': '_lastName',
  'vorname': '_firstName',
  'anrede': '_civility',
  'ansprechpartner': 'contactPerson',
  'kontaktperson': 'contactPerson',
  'kontakt': 'contactPerson',
  'name des kontakts': 'contactPerson',

  'funktion': 'contactFunction',
  'position': 'contactFunction',
  'abteilung': '_department',
  'bereich': '_department',

  'telefon': 'contactPhone',
  'telefonnummer': 'contactPhone',
  'festnetz': 'contactPhone',
  'mobiltelefon': 'contactMobile',
  'handy': 'contactMobile',
  'mobilnummer': 'contactMobile',

  'webseite': 'website',
  'internetseite': 'website',
  'homepage': 'website',

  /* ── German — Address ── */
  'strasse': '_street',
  'straße': '_street',
  'hausnummer': '_street',
  'zusatz': '_complement',
  'adresszusatz': '_complement',
  'plz': '_postalCode',
  'postleitzahl': '_postalCode',
  'ort': '_city',
  'stadt': '_city',
  'land': '_country',

  /* ── German — Financial ── */
  'zahlungsbedingungen': 'paymentTerms',
  'zahlungsfrist': 'paymentTerms',
  'zahlungsart': '_paymentMode',
  'zahlungsmethode': '_paymentMode',
  'kreditlimit': 'creditLimit',
  'kreditrahmen': 'creditLimit',

  /* ── German — Portfolio ── */
  'standorte': 'sites',
  'anzahl standorte': 'sites',
  'gebäudetypen': 'buildingTypes',
  'anlagentypen': 'assetTypes',

  /* ── German — Project ── */
  'projektumfang': 'projectScope',
  'umfang': 'projectScope',
  'zeitplan': 'timeline',
  'startdatum': 'timeline',
  'beginn': 'timeline',
};

/* ═══════════════════════════════════════════════════════════════════════
   INPUT CLASSIFICATION
   ═══════════════════════════════════════════════════════════════════════ */

function isMarkdownInput(text: string): boolean {
  const lines = text.split('\n');
  let mdSignals = 0;
  for (const line of lines) {
    if (/^\s*#{1,3}\s+/.test(line)) mdSignals += 3;
    if (/^\s*[-–•*]\s+\*\*[^*]+\*\*\s*[:–—]/.test(line)) mdSignals += 2;
    if (/^\s*\*\*[^*]+\*\*\s*[:–—]/.test(line)) mdSignals += 2;
  }
  return mdSignals >= 4;
}

/* ═══════════════════════════════════════════════════════════════════════
   MARKDOWN PARSER
   ═══════════════════════════════════════════════════════════════════════ */

interface Section {
  header: string;
  type: SectionType;
  lines: string[];
}

function splitSections(text: string): Section[] {
  const raw = text.split('\n');
  const sections: Section[] = [];
  let current: Section = { header: '', type: 'general', lines: [] };

  for (const line of raw) {
    const headerMatch = line.match(/^\s*(#{1,3})\s+(.+)/);
    if (headerMatch) {
      if (current.lines.length > 0 || current.header) {
        sections.push(current);
      }
      const headerText = headerMatch[2].trim();
      current = {
        header: headerText,
        type: classifySection(headerText),
        lines: [],
      };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0 || current.header) {
    sections.push(current);
  }
  return sections;
}

function extractKV(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 4) return null;

  // Pattern 1: `- **Key** : Value` or `- **Key**: Value`
  let m = trimmed.match(/^[-–•*►▸▹]\s+\*\*(.+?)\*\*\s*[:–—]\s*(.+)/);
  if (m) return { key: m[1].trim(), value: m[2].trim() };

  // Pattern 2: `**Key** : Value`
  m = trimmed.match(/^\*\*(.+?)\*\*\s*[:–—]\s*(.+)/);
  if (m) return { key: m[1].trim(), value: m[2].trim() };

  // Pattern 3: `- Key : Value` (label-like key)
  m = trimmed.match(/^[-–•*►▸▹]\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s/'°.()]{1,55}?)\s*[:–—]\s*(.+)/);
  if (m && m[1].trim().length > 1) return { key: m[1].trim(), value: m[2].trim() };

  // Pattern 4: `Key : Value` or `Key: Value`
  m = trimmed.match(/^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s/'°.()#]{1,55}?)\s*[:–—]\s*(.+)/);
  if (m && m[1].trim().length > 1 && !m[1].match(/^\d/)) {
    if (/^\d{1,2}:\d{2}/.test(trimmed)) return null;
    return { key: m[1].trim(), value: m[2].trim() };
  }

  return null;
}

interface TempFields {
  firstName: string;
  lastName: string;
  civility: string;
  street: string;
  complement: string;
  postalCode: string;
  city: string;
  country: string;
  deliveryStreet: string;
  deliveryComplement: string;
  deliveryPostalCode: string;
  deliveryCity: string;
  deliveryCountry: string;
  billingStreet: string;
  billingComplement: string;
  billingPostalCode: string;
  billingCity: string;
  billingCountry: string;
}

function emptyTemp(): TempFields {
  return {
    firstName: '', lastName: '', civility: '',
    street: '', complement: '', postalCode: '', city: '', country: '',
    deliveryStreet: '', deliveryComplement: '', deliveryPostalCode: '', deliveryCity: '', deliveryCountry: '',
    billingStreet: '', billingComplement: '', billingPostalCode: '', billingCity: '', billingCountry: '',
  };
}

function lookupField(key: string): FieldTarget | null {
  const normalized = key.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[''`]/g, '\'')
    .replace(/\./g, '')
    .trim();

  if (FIELD_VOCAB[normalized]) return FIELD_VOCAB[normalized];
  const singular = normalized.replace(/s$/, '');
  if (FIELD_VOCAB[singular]) return FIELD_VOCAB[singular];
  for (const [vocabKey, target] of Object.entries(FIELD_VOCAB)) {
    if (normalized.includes(vocabKey) || vocabKey.includes(normalized)) {
      return target;
    }
  }
  return null;
}

function mapField(
  key: string,
  value: string,
  sectionType: SectionType,
  data: StructuredClientData,
  temp: TempFields,
) {
  const target = lookupField(key);

  if (!target) {
    const label = key.replace(/\*\*/g, '').trim();
    if (label && value) data.metadata[label] = value;
    return;
  }

  // Address fields with section-awareness
  if (target === '_street') {
    if (sectionType === 'delivery') temp.deliveryStreet = value;
    else if (sectionType === 'billing') temp.billingStreet = value;
    else temp.street = value;
    return;
  }
  if (target === '_complement') {
    if (sectionType === 'delivery') temp.deliveryComplement = value;
    else if (sectionType === 'billing') temp.billingComplement = value;
    else temp.complement = value;
    return;
  }
  if (target === '_postalCode') {
    if (sectionType === 'delivery') temp.deliveryPostalCode = value;
    else if (sectionType === 'billing') temp.billingPostalCode = value;
    else temp.postalCode = value;
    return;
  }
  if (target === '_city') {
    if (sectionType === 'delivery') temp.deliveryCity = value;
    else if (sectionType === 'billing') temp.billingCity = value;
    else temp.city = value;
    return;
  }
  if (target === '_country') {
    if (sectionType === 'delivery') temp.deliveryCountry = value;
    else if (sectionType === 'billing') temp.billingCountry = value;
    else temp.country = value;
    return;
  }

  if (target === '_firstName') { temp.firstName = value; return; }
  if (target === '_lastName') { temp.lastName = value; return; }
  if (target === '_civility') { temp.civility = value; return; }

  if (target.startsWith('_')) {
    const label = target.slice(1);
    const prettyLabels: Record<string, string> = {
      industryCode: 'Code APE/NAF',
      capital: 'Capital social',
      creationDate: 'Date de création',
      clientNumber: 'N° client',
      clientType: 'Type de client',
      status: 'Statut',
      source: 'Source',
      paymentMode: 'Mode de paiement',
      department: 'Service / Département',
    };
    data.metadata[prettyLabels[label] || key] = value;
    return;
  }

  if (target === 'painPoints' || target === 'metadata' || target === 'confidence') return;

  const field = target as keyof StructuredClientData;
  const current = data[field];
  if (typeof current === 'string') {
    if (!current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)[field] = value;
    } else {
      data.metadata[key] = value;
    }
  }
}

function composeAddress(street: string, complement: string, postalCode: string, city: string, country: string): string {
  const parts: string[] = [];
  if (street) parts.push(street);
  if (complement) parts.push(complement);
  const plzCity = [postalCode, city].filter(Boolean).join(' ');
  if (plzCity) parts.push(plzCity);
  if (country) parts.push(country);
  return parts.join(', ');
}

function postProcess(data: StructuredClientData, temp: TempFields) {
  if (!data.contactPerson && (temp.firstName || temp.lastName)) {
    const parts: string[] = [];
    if (temp.civility) parts.push(temp.civility);
    if (temp.firstName) parts.push(temp.firstName);
    if (temp.lastName) parts.push(temp.lastName);
    data.contactPerson = parts.join(' ');
  }

  if (!data.address) {
    const composed = composeAddress(temp.street, temp.complement, temp.postalCode, temp.city, temp.country);
    if (composed) data.address = composed;
  }

  const billing = composeAddress(temp.billingStreet, temp.billingComplement, temp.billingPostalCode, temp.billingCity, temp.billingCountry);
  if (billing) {
    if (!data.address) data.address = billing;
    else data.metadata['Adresse de facturation'] = billing;
  }

  const delivery = composeAddress(temp.deliveryStreet, temp.deliveryComplement, temp.deliveryPostalCode, temp.deliveryCity, temp.deliveryCountry);
  if (delivery) {
    data.metadata['Adresse de livraison'] = delivery;
  }
}

function parseMarkdownDocument(text: string): StructuredClientData {
  const data = emptyClientData();
  const temp = emptyTemp();
  const sections = splitSections(text);
  const noteLines: string[] = [];

  for (const section of sections) {
    for (const line of section.lines) {
      const kv = extractKV(line);
      if (kv) {
        mapField(kv.key, kv.value, section.type, data, temp);
      } else {
        const cleaned = line
          .replace(/^\s*[-–•*►▸▹]\s*/, '')
          .replace(/^\*\*(.+)\*\*$/, '$1')
          .trim();
        if (!cleaned || cleaned.length < 3) continue;

        if (section.type === 'pains' && cleaned.length > 5) {
          data.painPoints.push(cleaned);
        } else if (section.type === 'notes' || section.type === 'tracking') {
          noteLines.push(cleaned);
        } else if (ALL_PAIN_KEYWORDS.some(kw => cleaned.toLowerCase().includes(kw.toLowerCase())) && cleaned.length > 8) {
          data.painPoints.push(cleaned);
        }
      }
    }
  }

  postProcess(data, temp);

  if (noteLines.length > 0) {
    data.notes = [data.notes, ...noteLines].filter(Boolean).join('\n');
  }

  if (!data.buildingTypes) data.buildingTypes = extractBuildingTypesFromText(text);
  if (!data.assetTypes) data.assetTypes = extractAssetTypesFromText(text);

  data.confidence = scoreConfidence(data);
  return data;
}

/* ═══════════════════════════════════════════════════════════════════════
   FREE-TEXT PARSER (fallback)
   ═══════════════════════════════════════════════════════════════════════ */

function normalizeText(text: string): string {
  let clean = text
    .replace(/^(Von|From|De|An|To|À|CC|Cc|Betreff|Subject|Objet|Datum|Date)\s*:\s*.+$/gim, '')
    .replace(/^[-–—]{2,}.*$/gm, '')
    .replace(/^(Grüße|Freundliche Grüsse|Cordialement|Best regards|Mit freundlichen Grüssen|Beste Grüsse|MfG|Bien à vous|Salutations)[\s\S]*$/im, '')
    .trim();
  clean = clean.replace(/\n{3,}/g, '\n\n');
  return clean;
}

function toLines(text: string): string[] {
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

function extractEmail(text: string): string {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : '';
}

function extractPhone(text: string): string {
  const patterns = [
    /(?:\+\d{1,3})\s*(?:\(?\d{1,4}\)?[\s.\-]?){2,5}\d{2,4}/,
    /0\d{1,2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/,
    /\(\d{2,4}\)\s*\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return '';
}

function extractAllPhones(text: string): string[] {
  const results: string[] = [];
  const patterns = [
    /(?:\+\d{1,3})\s*(?:\(?\d{1,4}\)?[\s.\-]?){2,5}\d{2,4}/g,
    /0\d{1,2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/g,
  ];
  for (const p of patterns) {
    const ms = text.matchAll(p);
    for (const m of ms) results.push(m[0].trim());
  }
  return results;
}

function extractCompanyName(lines: string[]): string {
  for (const line of lines) {
    if (COMPANY_SUFFIXES.test(line)) {
      return line.replace(/^(Firma|Unternehmen|Entreprise|Company|Société|Organisation)\s*[:\-–]\s*/i, '').trim();
    }
  }
  for (const line of lines) {
    const m = line.match(/^(?:Firma|Unternehmen|Entreprise|Company|Société|Kunde|Client|Organisation)\s*[:\-–]\s*(.+)/i);
    if (m) return m[1].trim();
  }
  if (lines.length > 0) {
    const first = lines[0];
    if (first.length < 60 && !first.includes('@') && !first.match(/^\d/) &&
        !first.match(/^(Hallo|Guten|Bonjour|Salut|Hello|Hi|Dear|Sehr|Liebe)/i)) {
      return first;
    }
  }
  return '';
}

function extractContactPerson(text: string, lines: string[]): string {
  for (const line of lines) {
    const m = line.match(/^(?:Ansprechpartner|Kontakt|Contact|Responsable|Projektleiter(?:in)?|Project\s*Manager|Chef(?:fe)?\s+de\s+projet|Verantwortlich(?:er)?)\s*[:\-–]\s*(.+)/i);
    if (m) return m[1].replace(TITLE_KEYWORDS, '').trim();
  }
  for (const line of lines) {
    if (TITLE_KEYWORDS.test(line)) {
      const cleaned = line.replace(TITLE_KEYWORDS, '').replace(/[,;]/g, '').trim();
      if (cleaned.length > 2 && cleaned.length < 60 && !cleaned.includes('@')) return cleaned;
    }
  }
  const emailIdx = lines.findIndex(l => /[a-zA-Z0-9._%+-]+@/.test(l));
  if (emailIdx > 0) {
    const prev = lines[emailIdx - 1];
    if (prev.length < 50 && !prev.includes('@') && !prev.match(/^\d/) && !COMPANY_SUFFIXES.test(prev)) return prev;
  }
  const hdr = text.match(/([A-ZÀ-ÜÖÄa-zà-üöä]+\s+[A-ZÀ-ÜÖÄa-zà-üöä]+)\s*<[^>]+@/);
  if (hdr) return hdr[1].trim();
  return '';
}

function extractAddressFreeText(text: string): string {
  const m = text.match(
    /[A-ZÀ-Üa-zà-ü\-.\s]+(?:strasse|str\.|weg|gasse|platz|allee|ring|damm|ufer|rain|matte|graben|rue|avenue|av\.|chemin|ch\.|route|rte\.|boulevard|blvd\.?|place|pl\.)\s*\d{0,5}[a-z]?\s*[,\n]\s*\d{4,5}\s+[A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)*/i
  );
  if (m) return m[0].replace(/\n/g, ', ').trim();
  const plz = text.match(/\d{4,5}\s+[A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)*/);
  if (plz) return plz[0].trim();
  return '';
}

function extractSites(text: string): string {
  const patterns = [
    /(\d+)\s*(?:Standort(?:e)?|Site[s]?|Objekt(?:e)?|Gebäude|Bâtiment[s]?|Immeuble[s]?|Liegenschaft(?:en)?)/i,
    /(?:Portfolio|Bestand|Parc)\s*(?:von|de|:)?\s*(\d+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  const ls = toLines(text);
  for (const l of ls) {
    const lm = l.match(/^(?:Standorte?|Sites?|Portfolio|Objekte?|Liegenschaften)\s*[:\-–]\s*(.+)/i);
    if (lm) return lm[1].trim();
  }
  return '';
}

function extractBuildingTypesFromText(text: string): string {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const bt of ALL_BUILDING_TYPES) {
    if (lower.includes(bt.toLowerCase()) && !found.some(f => f.toLowerCase() === bt.toLowerCase())) found.push(bt);
  }
  return found.join(', ');
}

function extractAssetTypesFromText(text: string): string {
  const found: string[] = [];
  for (const at of ALL_ASSET_TYPES) {
    const escaped = at.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(text) && !found.some(f => f.toLowerCase() === at.toLowerCase())) found.push(at);
  }
  return found.join(', ');
}

function extractPainPoints(text: string): string[] {
  const results: string[] = [];
  const ls = toLines(text);

  for (const line of ls) {
    if (/^\s*[-–•·*►▸▹]\s+/.test(line)) {
      const cleaned = line.replace(/^\s*[-–•·*►▸▹]\s+/, '').trim();
      if (cleaned.length > 5 && ALL_PAIN_KEYWORDS.some(kw => cleaned.toLowerCase().includes(kw.toLowerCase()))) {
        results.push(cleaned);
      }
    }
  }

  if (results.length === 0) {
    for (const line of ls) {
      if (ALL_PAIN_KEYWORDS.some(kw => line.toLowerCase().includes(kw.toLowerCase())) && line.length > 10 && line.length < 200) {
        if (!/^(Probleme?|Points?\s+de\s+douleur|Schmerzpunkte?|Ausgangslage|Contexte)\s*[:\-–]?\s*$/i.test(line)) {
          const cleaned = line.replace(/^(Probleme?|Schmerzpunkte?|Ausgangslage|Contexte)\s*[:\-–]\s*/i, '').trim();
          if (cleaned.length > 5) results.push(cleaned);
        }
      }
    }
  }
  return results;
}

function extractBudget(text: string): string {
  const patterns = [
    /(?:~|ca\.?|environ|rund|circa)?\s*(?:CHF|EUR|€|Fr\.?)\s*[\d'.,]+\s*(?:k|K|M|Mio\.?|Mrd\.?)?/,
    /(?:~|ca\.?|environ|rund|circa)?\s*[\d'.,]+\s*(?:k|K|M|Mio\.?)\s*(?:CHF|EUR|€|Fr\.?)?/,
    /Budget\s*[:\-–]\s*(.+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].replace(/^Budget\s*[:\-–]\s*/i, '').trim();
  }
  return '';
}

function extractTimeline(text: string): string {
  const patterns = [
    /(?:Start|Beginn|Début|Deadline|Frist|Échéance)\s*[:\-–]?\s*(?:Q[1-4]\s*\d{4}|[A-ZÀ-Ü][a-zà-ü]+\s+\d{4}|\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4})/i,
    /Q[1-4]\s*[/\-]?\s*\d{4}/,
    /(?:Timeline|Zeitplan|Calendrier|Planung)\s*[:\-–]\s*(.+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].replace(/^(?:Timeline|Zeitplan|Calendrier|Planung)\s*[:\-–]\s*/i, '').trim();
  }
  return '';
}

function extractScope(text: string): string {
  const ls = toLines(text);
  for (const l of ls) {
    const m = l.match(/^(?:Scope|Umfang|Projektumfang|Périmètre|Projet|Phase)\s*[:\-–]\s*(.+)/i);
    if (m) return m[1].trim();
  }
  const scopePatterns = [
    /Pilot(?:projekt|phase|ierung)?\s+(?:\d+\s+)?(?:Standort(?:e)?|Site[s]?|Gebäude|Bâtiment[s]?)(?:\s*[→>]\s*.+)?/i,
    /Rollout\s+(?:Portfolio|gesamt|complet|total)/i,
    /Phase\s+\d\s*[:\-–]\s*.+/i,
  ];
  for (const p of scopePatterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return '';
}

function parseFreeText(rawText: string): StructuredClientData {
  const cleaned = normalizeText(rawText);
  const ls = toLines(cleaned);
  const data = emptyClientData();

  data.companyName = extractCompanyName(ls);
  data.contactPerson = extractContactPerson(cleaned, ls);
  data.contactEmail = extractEmail(cleaned);
  data.contactPhone = extractPhone(cleaned);
  data.address = extractAddressFreeText(cleaned);
  data.sites = extractSites(cleaned);
  data.buildingTypes = extractBuildingTypesFromText(cleaned);
  data.assetTypes = extractAssetTypesFromText(cleaned);
  data.painPoints = extractPainPoints(cleaned);
  data.projectScope = extractScope(cleaned);
  data.budget = extractBudget(cleaned);
  data.timeline = extractTimeline(cleaned);

  const temp = emptyTemp();
  for (const line of ls) {
    const kv = extractKV(line);
    if (kv) mapField(kv.key, kv.value, 'unknown', data, temp);
  }
  postProcess(data, temp);

  // Find second phone for mobile
  if (data.contactPhone && !data.contactMobile) {
    const allPhones = extractAllPhones(cleaned);
    const mobile = allPhones.find(p => p !== data.contactPhone);
    if (mobile) data.contactMobile = mobile;
  }

  const extractedVals = new Set(
    [data.companyName, data.contactPerson, data.contactEmail, data.contactPhone,
     data.address, data.sites, data.budget, data.timeline, data.projectScope,
     ...data.painPoints].filter(Boolean).map(v => v.toLowerCase().trim())
  );
  data.notes = ls
    .filter(l => {
      const low = l.toLowerCase().trim();
      return low && low.length > 3 && !extractedVals.has(low);
    })
    .slice(0, 8)
    .join('\n');

  data.confidence = scoreConfidence(data);
  return data;
}

/* ═══════════════════════════════════════════════════════════════════════
   SEMI-STRUCTURED KV PARSER
   ═══════════════════════════════════════════════════════════════════════ */

function parseKeyValue(text: string): StructuredClientData {
  const data = emptyClientData();
  const temp = emptyTemp();
  const ls = text.split('\n');
  const noteLines: string[] = [];

  for (const line of ls) {
    const kv = extractKV(line);
    if (kv) {
      mapField(kv.key, kv.value, 'unknown', data, temp);
    } else {
      const cleaned = line.trim();
      if (cleaned && cleaned.length > 3) {
        if (ALL_PAIN_KEYWORDS.some(kw => cleaned.toLowerCase().includes(kw.toLowerCase())) && cleaned.length > 8) {
          data.painPoints.push(cleaned.replace(/^\s*[-–•*]\s*/, ''));
        } else {
          noteLines.push(cleaned);
        }
      }
    }
  }

  postProcess(data, temp);

  if (!data.contactEmail) data.contactEmail = extractEmail(text);
  if (!data.contactPhone && !data.contactMobile) data.contactPhone = extractPhone(text);
  if (!data.buildingTypes) data.buildingTypes = extractBuildingTypesFromText(text);
  if (!data.assetTypes) data.assetTypes = extractAssetTypesFromText(text);
  if (!data.budget) data.budget = extractBudget(text);
  if (!data.timeline) data.timeline = extractTimeline(text);

  if (noteLines.length > 0) {
    data.notes = noteLines.slice(0, 8).join('\n');
  }

  data.confidence = scoreConfidence(data);
  return data;
}

/* ═══════════════════════════════════════════════════════════════════════
   CONFIDENCE SCORING
   ═══════════════════════════════════════════════════════════════════════ */

interface Weight { key: keyof StructuredClientData; weight: number }

const FIELD_WEIGHTS: Weight[] = [
  { key: 'companyName', weight: 14 },
  { key: 'contactPerson', weight: 12 },
  { key: 'contactEmail', weight: 8 },
  { key: 'contactPhone', weight: 5 },
  { key: 'contactFunction', weight: 3 },
  { key: 'address', weight: 5 },
  { key: 'legalForm', weight: 2 },
  { key: 'registrationId', weight: 4 },
  { key: 'vatId', weight: 3 },
  { key: 'sites', weight: 8 },
  { key: 'painPoints', weight: 12 },
  { key: 'projectScope', weight: 8 },
  { key: 'budget', weight: 5 },
  { key: 'timeline', weight: 3 },
  { key: 'iban', weight: 2 },
  { key: 'paymentTerms', weight: 2 },
  { key: 'website', weight: 1 },
  { key: 'tradeName', weight: 1 },
  { key: 'creditLimit', weight: 1 },
];

function scoreConfidence(data: StructuredClientData): number {
  let score = 0;
  for (const { key, weight } of FIELD_WEIGHTS) {
    const value = data[key];
    if (Array.isArray(value)) {
      if (value.length > 0) score += weight;
    } else if (typeof value === 'string' && value.trim().length > 0) {
      score += weight;
    }
  }
  const metaCount = Object.keys(data.metadata).length;
  if (metaCount > 0) score += Math.min(metaCount, 5);

  return Math.min(100, score);
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN ENTRY POINT
   ═══════════════════════════════════════════════════════════════════════ */

export function structureClientData(rawText: string): StructuredClientData {
  const text = rawText.trim();
  if (!text) return emptyClientData();

  if (isMarkdownInput(text)) {
    return parseMarkdownDocument(text);
  }

  const ls = text.split('\n').filter(l => l.trim());
  const kvCount = ls.filter(l => extractKV(l) !== null).length;
  if (kvCount >= 3 && kvCount / ls.length > 0.3) {
    return parseKeyValue(text);
  }

  return parseFreeText(text);
}

/* ═══════════════════════════════════════════════════════════════════════
   EMPTY TEMPLATE
   ═══════════════════════════════════════════════════════════════════════ */

export function emptyClientData(): StructuredClientData {
  return {
    companyName: '',
    tradeName: '',
    legalForm: '',
    registrationId: '',
    vatId: '',
    contactPerson: '',
    contactFunction: '',
    contactEmail: '',
    contactPhone: '',
    contactMobile: '',
    website: '',
    address: '',
    iban: '',
    bic: '',
    paymentTerms: '',
    creditLimit: '',
    sites: '',
    buildingTypes: '',
    assetTypes: '',
    painPoints: [],
    projectScope: '',
    budget: '',
    timeline: '',
    notes: '',
    metadata: {},
    confidence: 0,
  };
}
