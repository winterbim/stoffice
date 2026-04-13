/**
 * Stoffice — Client Data Structuring Engine
 *
 * A client-side NLP-like parser that extracts structured fields from free text.
 * Handles messy copy-paste from emails, CRM exports, documents, and notes.
 * Bilingual: German + French vocabulary.
 */

/* ── Exported types ─────────────────────────────────────────────────── */

export interface StructuredClientData {
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  sites: string;
  buildingTypes: string;
  assetTypes: string;
  painPoints: string[];
  projectScope: string;
  budget: string;
  timeline: string;
  notes: string;
  confidence: number; // 0–100
}

/* ── Vocabulary ─────────────────────────────────────────────────────── */

const COMPANY_SUFFIXES =
  /\b(AG|GmbH|SA|S\.?A\.?|Sàrl|S\.?à\.?r\.?l\.?|Ltd\.?|Inc\.?|Corp\.?|SE|KG|OHG|e\.?V\.?|Stiftung|Genossenschaft|Co(?:mpany)?|& Co\.?|Cie\.?|Holding)\b/i;

const TITLE_KEYWORDS =
  /\b(Herr|Frau|Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Ing\.?|Dipl\.?|Projektleiter(?:in)?|Project\s?Manager|Chef(?:fe)?\s+de\s+projet|Responsable|Directeur|Directrice|Leiter(?:in)?|Manager(?:in)?|CEO|CTO|CFO|COO|Head\s+of)\b/i;

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

/* ── Helpers ────────────────────────────────────────────────────────── */

function normalize(text: string): string {
  // Strip common email headers
  let clean = text
    .replace(/^(Von|From|De|An|To|À|CC|Cc|Betreff|Subject|Objet|Datum|Date)\s*:\s*.+$/gim, '')
    .replace(/^[-–—]{2,}.*$/gm, '') // signature separators
    .replace(/^(Grüße|Freundliche Grüsse|Cordialement|Best regards|Mit freundlichen Grüssen|Beste Grüsse|MfG|Bien à vous|Salutations)[\s\S]*$/im, '') // strip signature block
    .trim();

  // Collapse multiple blank lines
  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean;
}

function lines(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

/* ── Extractors ─────────────────────────────────────────────────────── */

function extractEmail(text: string): string {
  const match = text.match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  );
  return match ? match[0] : '';
}

function extractPhone(text: string): string {
  // Swiss formats: +41 XX XXX XX XX, 0XX XXX XX XX
  // Also international: +49, +33, etc.
  const patterns = [
    /(?:\+\d{1,3})\s*(?:\(?\d{1,4}\)?[\s.\-]?){2,5}\d{2,4}/,
    /0\d{1,2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/,
    /\(\d{2,4}\)\s*\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return '';
}

function extractCompanyName(textLines: string[]): string {
  // 1. Look for lines with known company suffixes
  for (const line of textLines) {
    if (COMPANY_SUFFIXES.test(line)) {
      // Clean the line: remove leading "Firma:", "Unternehmen:", etc.
      return line
        .replace(/^(Firma|Unternehmen|Entreprise|Company|Société|Organisation)\s*[:\-–]\s*/i, '')
        .trim();
    }
  }

  // 2. Look for labeled lines
  for (const line of textLines) {
    const labelMatch = line.match(
      /^(?:Firma|Unternehmen|Entreprise|Company|Société|Kunde|Client|Organisation)\s*[:\-–]\s*(.+)/i
    );
    if (labelMatch) return labelMatch[1].trim();
  }

  // 3. First line if it looks like a name (capitalized, no verb indicators)
  if (textLines.length > 0) {
    const first = textLines[0];
    if (
      first.length < 60 &&
      !first.includes('@') &&
      !first.match(/^\d/) &&
      !first.match(/^(Hallo|Guten|Bonjour|Salut|Hello|Hi|Dear|Sehr|Liebe)/i)
    ) {
      return first;
    }
  }

  return '';
}

function extractContactPerson(text: string, textLines: string[]): string {
  // 1. Labeled lines
  for (const line of textLines) {
    const match = line.match(
      /^(?:Ansprechpartner|Kontakt|Contact|Responsable|Projektleiter(?:in)?|Project\s*Manager|Chef(?:fe)?\s+de\s+projet|Verantwortlich(?:er)?)\s*[:\-–]\s*(.+)/i
    );
    if (match) return match[1].replace(TITLE_KEYWORDS, '').trim();
  }

  // 2. Lines with title keywords followed by a name
  for (const line of textLines) {
    const titleMatch = line.match(TITLE_KEYWORDS);
    if (titleMatch) {
      const cleaned = line
        .replace(TITLE_KEYWORDS, '')
        .replace(/[,;]/g, '')
        .trim();
      if (cleaned.length > 2 && cleaned.length < 60 && !cleaned.includes('@')) {
        return cleaned;
      }
    }
  }

  // 3. Line right before or after an email
  const emailLineIdx = textLines.findIndex((l) =>
    /[a-zA-Z0-9._%+-]+@/.test(l)
  );
  if (emailLineIdx > 0) {
    const prev = textLines[emailLineIdx - 1];
    if (
      prev.length < 50 &&
      !prev.includes('@') &&
      !prev.match(/^\d/) &&
      !COMPANY_SUFFIXES.test(prev)
    ) {
      return prev;
    }
  }

  // 4. Extract name from email-style "First Last <email>"
  const emailHeaderMatch = text.match(
    /([A-ZÀ-ÜÖÄa-zà-üöä]+\s+[A-ZÀ-ÜÖÄa-zà-üöä]+)\s*<[^>]+@/
  );
  if (emailHeaderMatch) return emailHeaderMatch[1].trim();

  return '';
}

function extractAddress(text: string): string {
  // Swiss: Street Number, PLZPLZPLZ City
  const swissMatch = text.match(
    /[A-ZÀ-Üa-zà-ü\-.\s]+(?:strasse|str\.|weg|gasse|platz|allee|ring|damm|ufer|rain|matte|graben|rue|avenue|av\.|chemin|ch\.|route|rte\.|boulevard|blvd\.?|place|pl\.)\s*\d{0,5}[a-z]?\s*[,\n]\s*\d{4,5}\s+[A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)*/i
  );
  if (swissMatch) return swissMatch[0].replace(/\n/g, ', ').trim();

  // Fallback: just PLZ + City
  const plzMatch = text.match(/\d{4,5}\s+[A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)*/);
  if (plzMatch) return plzMatch[0].trim();

  // Labeled
  const lines_ = lines(text);
  for (const line of lines_) {
    const labelMatch = line.match(
      /^(?:Adresse|Standort|Ort|Sitz|Siège|Localisation|Location)\s*[:\-–]\s*(.+)/i
    );
    if (labelMatch) return labelMatch[1].trim();
  }

  return '';
}

function extractSites(text: string): string {
  const sitePatterns = [
    /(\d+)\s*(?:Standort(?:e)?|Site[s]?|Objekt(?:e)?|Gebäude|Bâtiment[s]?|Immeuble[s]?|Liegenschaft(?:en)?)/i,
    /(?:Portfolio|Bestand|Parc)\s*(?:von|de|:)?\s*(\d+)/i,
    /(\d+)\s*(?:buildings?|sites?|properties|locations?)/i,
  ];
  for (const pattern of sitePatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }

  // Labeled
  const textLines = lines(text);
  for (const line of textLines) {
    const labelMatch = line.match(
      /^(?:Standorte?|Sites?|Portfolio|Objekte?|Liegenschaften)\s*[:\-–]\s*(.+)/i
    );
    if (labelMatch) return labelMatch[1].trim();
  }

  return '';
}

function extractBuildingTypes(text: string): string {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const bt of ALL_BUILDING_TYPES) {
    if (lower.includes(bt.toLowerCase()) && !found.some((f) => f.toLowerCase() === bt.toLowerCase())) {
      found.push(bt);
    }
  }
  return found.join(', ');
}

function extractAssetTypes(text: string): string {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const at of ALL_ASSET_TYPES) {
    // Only match whole words (avoid substring false positives)
    const escaped = at.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower) && !found.some((f) => f.toLowerCase() === at.toLowerCase())) {
      found.push(at);
    }
  }
  return found.join(', ');
}

function extractPainPoints(text: string): string[] {
  const results: string[] = [];
  const textLines = lines(text);

  // 1. Bullet points
  for (const line of textLines) {
    if (/^\s*[-–•·*►▸▹]\s+/.test(line)) {
      const cleaned = line.replace(/^\s*[-–•·*►▸▹]\s+/, '').trim();
      if (cleaned.length > 5) {
        // Check if it sounds like a pain point
        const hasPainKeyword = ALL_PAIN_KEYWORDS.some((kw) =>
          cleaned.toLowerCase().includes(kw.toLowerCase())
        );
        if (hasPainKeyword || results.length > 0) {
          results.push(cleaned);
        }
      }
    }
  }

  // 2. If no bullets found, look for lines with pain keywords
  if (results.length === 0) {
    for (const line of textLines) {
      const hasPainKeyword = ALL_PAIN_KEYWORDS.some((kw) =>
        line.toLowerCase().includes(kw.toLowerCase())
      );
      if (hasPainKeyword && line.length > 10 && line.length < 200) {
        // Don't add if it's clearly a header or label
        if (!/^(Probleme?|Points?\s+de\s+douleur|Schmerzpunkte?|Ausgangslage|Contexte)\s*[:\-–]?\s*$/i.test(line)) {
          const cleaned = line
            .replace(/^(Probleme?|Schmerzpunkte?|Ausgangslage|Contexte)\s*[:\-–]\s*/i, '')
            .trim();
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
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/^Budget\s*[:\-–]\s*/i, '').trim();
  }
  return '';
}

function extractTimeline(text: string): string {
  const patterns = [
    /(?:Start|Beginn|Début|Deadline|Frist|Échéance)\s*[:\-–]?\s*(?:Q[1-4]\s*\d{4}|[A-ZÀ-Ü][a-zà-ü]+\s+\d{4}|\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{4})/i,
    /Q[1-4]\s*[/\-]?\s*\d{4}/,
    /(?:Timeline|Zeitplan|Calendrier|Planung)\s*[:\-–]\s*(.+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/^(?:Timeline|Zeitplan|Calendrier|Planung)\s*[:\-–]\s*/i, '').trim();
  }
  return '';
}

function extractScope(text: string): string {
  const textLines = lines(text);
  for (const line of textLines) {
    const match = line.match(
      /^(?:Scope|Umfang|Projektumfang|Périmètre|Projekt|Phase)\s*[:\-–]\s*(.+)/i
    );
    if (match) return match[1].trim();
  }

  // Look for pilot/rollout keywords
  const scopePatterns = [
    /Pilot(?:projekt|phase|ierung)?\s+(?:\d+\s+)?(?:Standort(?:e)?|Site[s]?|Gebäude|Bâtiment[s]?)(?:\s*[→→>]\s*.+)?/i,
    /Rollout\s+(?:Portfolio|gesamt|complet|total)/i,
    /Phase\s+\d\s*[:\-–]\s*.+/i,
  ];
  for (const pattern of scopePatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }

  return '';
}

/* ── Confidence scoring ─────────────────────────────────────────────── */

interface FieldWeight {
  key: keyof StructuredClientData;
  weight: number;
}

const FIELD_WEIGHTS: FieldWeight[] = [
  { key: 'companyName', weight: 20 },
  { key: 'contactPerson', weight: 15 },
  { key: 'contactEmail', weight: 10 },
  { key: 'contactPhone', weight: 5 },
  { key: 'address', weight: 5 },
  { key: 'sites', weight: 10 },
  { key: 'painPoints', weight: 15 },
  { key: 'projectScope', weight: 10 },
  { key: 'budget', weight: 5 },
  { key: 'timeline', weight: 5 },
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
  return Math.min(100, score);
}

/* ── Main entry point ───────────────────────────────────────────────── */

export function structureClientData(rawText: string): StructuredClientData {
  const cleaned = normalize(rawText);
  const textLines = lines(cleaned);

  const companyName = extractCompanyName(textLines);
  const contactPerson = extractContactPerson(cleaned, textLines);
  const contactEmail = extractEmail(cleaned);
  const contactPhone = extractPhone(cleaned);
  const address = extractAddress(cleaned);
  const sites = extractSites(cleaned);
  const buildingTypes = extractBuildingTypes(cleaned);
  const assetTypes = extractAssetTypes(cleaned);
  const painPoints = extractPainPoints(cleaned);
  const projectScope = extractScope(cleaned);
  const budget = extractBudget(cleaned);
  const timeline = extractTimeline(cleaned);

  // Everything that wasn't classified goes to notes
  const extractedValues = new Set([
    companyName, contactPerson, contactEmail, contactPhone,
    address, sites, budget, timeline, projectScope,
    ...painPoints,
  ].filter(Boolean).map((v) => v.toLowerCase().trim()));

  const notes = textLines
    .filter((line) => {
      const lower = line.toLowerCase().trim();
      if (!lower) return false;
      // Keep lines that weren't extracted
      return !extractedValues.has(lower) && lower.length > 3;
    })
    .slice(0, 5) // Keep at most 5 note lines
    .join('\n');

  const data: StructuredClientData = {
    companyName,
    contactPerson,
    contactEmail,
    contactPhone,
    address,
    sites,
    buildingTypes,
    assetTypes,
    painPoints,
    projectScope,
    budget,
    timeline,
    notes,
    confidence: 0,
  };

  data.confidence = scoreConfidence(data);

  return data;
}

/* ── Empty template for manual entry ────────────────────────────────── */

export function emptyClientData(): StructuredClientData {
  return {
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    sites: '',
    buildingTypes: '',
    assetTypes: '',
    painPoints: [],
    projectScope: '',
    budget: '',
    timeline: '',
    notes: '',
    confidence: 0,
  };
}
