'use client';

import { useState, useRef, useCallback } from 'react';
import { t, type Locale } from '@/lib/i18n';
import { structureClientData, emptyClientData, type StructuredClientData } from '@/lib/structurer';

/* ── Props & exported context ───────────────────────────────────────── */

interface ReportDrawerProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (context: ReportContext) => void;
  lang: Locale;
  generating: boolean;
  errorMessage?: string;
}

export interface ReportContext {
  companyName: string;
  projectManager: string;
  logoBase64: string | null;
  date: string;
  /* Identity */
  tradeName?: string;
  legalForm?: string;
  registrationId?: string;
  vatId?: string;
  /* Contact */
  contactFunction?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactMobile?: string;
  website?: string;
  /* Address */
  address?: string;
  /* Financial */
  iban?: string;
  bic?: string;
  paymentTerms?: string;
  creditLimit?: string;
  /* Portfolio */
  sites?: string;
  buildingTypes?: string;
  assetTypes?: string;
  /* Pain & project */
  painPoints?: string[];
  projectScope?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
  /* Overflow */
  metadata?: Record<string, string>;
}

/* ── Image helpers ──────────────────────────────────────────────────── */

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function normalizeLogoToPng(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const maxWidth = 1400;
  const maxHeight = 600;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function FieldInput({
  id, label, value, onChange, placeholder, type = 'text', required = false,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-tertiary)] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
      />
    </div>
  );
}

function FieldTextarea({
  id, label, value, onChange, placeholder, rows = 3,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-tertiary)] mb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all resize-y leading-relaxed"
      />
    </div>
  );
}

function ConfidenceBadge({ value, lang }: { value: number; lang: Locale }) {
  const level = value >= 60 ? 'high' : value >= 30 ? 'medium' : 'low';
  const colors = {
    high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-red-50 text-red-600 border-red-200',
  };
  const labels = { high: t('intakeConfHigh', lang), medium: t('intakeConfMedium', lang), low: t('intakeConfLow', lang) };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colors[level]}`}>
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-50 ${level === 'high' ? 'bg-emerald-400 animate-ping' : level === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${level === 'high' ? 'bg-emerald-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
      </span>
      {t('intakeConfidence', lang)}: {labels[level]} ({value}%)
    </div>
  );
}

/** Section wrapper with accent heading */
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {title}
      </div>
      {children}
    </div>
  );
}

/** Metadata pills — show overflow fields in compact format */
function MetadataPills({ metadata, onRemove }: { metadata: Record<string, string>; onRemove: (key: string) => void }) {
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {/* Extra metadata */}
        Données complémentaires
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, val]) => (
          <div key={key} className="group flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-[11px]">
            <span className="font-medium text-[var(--color-text-tertiary)]">{key}:</span>
            <span className="text-[var(--color-text)]">{val}</span>
            <button
              type="button"
              onClick={() => onRemove(key)}
              className="ml-1 text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

type Phase = 'input' | 'structured';

export default function ReportDrawer({ open, onClose, onGenerate, lang, generating, errorMessage }: ReportDrawerProps) {
  const [phase, setPhase] = useState<Phase>('input');
  const [rawText, setRawText] = useState('');
  const [data, setData] = useState<StructuredClientData>(emptyClientData());
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [structuring, setStructuring] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const png = await normalizeLogoToPng(file);
      setLogoBase64(png);
      setLogoName(file.name);
    } catch {
      setLogoBase64(null);
      setLogoName('');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleStructure = useCallback(() => {
    if (!rawText.trim()) return;
    setStructuring(true);
    setTimeout(() => {
      const result = structureClientData(rawText);
      setData(result);
      setPhase('structured');
      setStructuring(false);
    }, 400);
  }, [rawText]);

  const handleSkipToForm = useCallback(() => {
    setData(emptyClientData());
    setPhase('structured');
  }, []);

  const handleBackToInput = useCallback(() => {
    setPhase('input');
  }, []);

  const updateField = useCallback(<K extends keyof StructuredClientData>(key: K, value: StructuredClientData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeMetadata = useCallback((key: string) => {
    setData((prev) => {
      const next = { ...prev.metadata };
      delete next[key];
      return { ...prev, metadata: next };
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = Object.keys(data.metadata).length > 0 ? data.metadata : undefined;
    onGenerate({
      companyName: data.companyName,
      projectManager: data.contactPerson,
      logoBase64,
      date,
      tradeName: data.tradeName || undefined,
      legalForm: data.legalForm || undefined,
      registrationId: data.registrationId || undefined,
      vatId: data.vatId || undefined,
      contactFunction: data.contactFunction || undefined,
      contactEmail: data.contactEmail || undefined,
      contactPhone: data.contactPhone || undefined,
      contactMobile: data.contactMobile || undefined,
      website: data.website || undefined,
      address: data.address || undefined,
      iban: data.iban || undefined,
      bic: data.bic || undefined,
      paymentTerms: data.paymentTerms || undefined,
      creditLimit: data.creditLimit || undefined,
      sites: data.sites || undefined,
      buildingTypes: data.buildingTypes || undefined,
      assetTypes: data.assetTypes || undefined,
      painPoints: data.painPoints.length > 0 ? data.painPoints : undefined,
      projectScope: data.projectScope || undefined,
      budget: data.budget || undefined,
      timeline: data.timeline || undefined,
      notes: data.notes || undefined,
      metadata: meta,
    });
  };

  if (!open) return null;

  /* Count filled fields for stats badge */
  const filledCount = [
    data.companyName, data.tradeName, data.legalForm, data.registrationId, data.vatId,
    data.contactPerson, data.contactFunction, data.contactEmail, data.contactPhone, data.contactMobile, data.website,
    data.address, data.iban, data.bic, data.paymentTerms, data.creditLimit,
    data.sites, data.buildingTypes, data.assetTypes, data.projectScope, data.budget, data.timeline, data.notes,
  ].filter(v => v && v.trim()).length + data.painPoints.length + Object.keys(data.metadata).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[var(--color-bg)] border-l border-[var(--color-border)] z-50 overflow-y-auto shadow-xl">
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)]">
                {t('drawerTitle', lang)}
              </h2>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {phase === 'input' ? t('intakeSubInput', lang) : t('intakeSubStructured', lang)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent border-0 cursor-pointer text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ═══════ PHASE 1: Free text input ═══════ */}
          {phase === 'input' && (
            <div className="space-y-5">
              {/* AI badge */}
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3">
                <svg className="w-5 h-5 text-[var(--color-accent)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span className="text-xs text-[var(--color-accent)] font-medium leading-relaxed">
                  {t('intakeAiBadge', lang)}
                </span>
              </div>

              {/* Textarea */}
              <div>
                <label htmlFor="rawText" className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-tertiary)] mb-2">
                  {t('intakeLabel', lang)}
                </label>
                <textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={t('intakePlaceholder', lang)}
                  rows={14}
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all resize-y leading-relaxed font-mono"
                />
                <p className="mt-1.5 text-[11px] text-[var(--color-text-tertiary)] leading-relaxed">
                  {t('intakeHint', lang)}
                </p>
              </div>

              {/* Analyze button */}
              <button
                type="button"
                onClick={handleStructure}
                disabled={!rawText.trim() || structuring}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {structuring ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('intakeStructuring', lang)}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    {t('intakeStructureBtn', lang)}
                  </>
                )}
              </button>

              {/* Skip link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSkipToForm}
                  className="text-xs text-[var(--color-text-tertiary)] bg-transparent border-0 cursor-pointer hover:text-[var(--color-accent)] transition-colors underline underline-offset-2"
                >
                  {t('intakeSkipToForm', lang)}
                </button>
              </div>
            </div>
          )}

          {/* ═══════ PHASE 2: Structured form ═══════ */}
          {phase === 'structured' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Confidence badge + stats + back */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {data.confidence > 0 && (
                    <ConfidenceBadge value={data.confidence} lang={lang} />
                  )}
                  {filledCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)]">
                      {filledCount} {t('intakeFieldsDetected', lang)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleBackToInput}
                  className="text-[11px] text-[var(--color-text-tertiary)] bg-transparent border-0 cursor-pointer hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  {t('intakeBackToText', lang)}
                </button>
              </div>

              {data.confidence > 0 && (
                <p className="text-[11px] text-[var(--color-text-tertiary)] leading-relaxed italic">
                  {t('intakeEditHint', lang)}
                </p>
              )}

              {/* ── Section: Client & Contact ── */}
              <FormSection title={t('intakeSectionClient', lang)}>
                <FieldInput id="companyName" label={t('companyLabel', lang)} value={data.companyName} onChange={(v) => updateField('companyName', v)} placeholder={t('companyPlaceholder', lang)} required />
                {(data.tradeName || data.legalForm) && (
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput id="tradeName" label={t('intakeTradeName', lang)} value={data.tradeName} onChange={(v) => updateField('tradeName', v)} placeholder="Nom commercial" />
                    <FieldInput id="legalForm" label={t('intakeLegalForm', lang)} value={data.legalForm} onChange={(v) => updateField('legalForm', v)} placeholder="SARL, SA, GmbH…" />
                  </div>
                )}
                <FieldInput id="contactPerson" label={t('intakeContactPerson', lang)} value={data.contactPerson} onChange={(v) => updateField('contactPerson', v)} placeholder={t('managerPlaceholder', lang)} required />
                {data.contactFunction && (
                  <FieldInput id="contactFunction" label={t('intakeFunction', lang)} value={data.contactFunction} onChange={(v) => updateField('contactFunction', v)} placeholder="Directeur technique, Gérant…" />
                )}
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput id="contactEmail" label={t('intakeEmail', lang)} value={data.contactEmail} onChange={(v) => updateField('contactEmail', v)} type="email" placeholder="email@example.com" />
                  <FieldInput id="contactPhone" label={t('intakePhone', lang)} value={data.contactPhone} onChange={(v) => updateField('contactPhone', v)} type="tel" placeholder="+41 …" />
                </div>
                {data.contactMobile && (
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput id="contactMobile" label={t('intakeMobile', lang)} value={data.contactMobile} onChange={(v) => updateField('contactMobile', v)} type="tel" placeholder="+41 79 …" />
                    <FieldInput id="website" label={t('intakeWebsite', lang)} value={data.website} onChange={(v) => updateField('website', v)} placeholder="www.example.com" />
                  </div>
                )}
                {!data.contactMobile && data.website && (
                  <FieldInput id="website" label={t('intakeWebsite', lang)} value={data.website} onChange={(v) => updateField('website', v)} placeholder="www.example.com" />
                )}
                <FieldInput id="address" label={t('intakeAddress', lang)} value={data.address} onChange={(v) => updateField('address', v)} placeholder="Strasse Nr, PLZ Ort" />
              </FormSection>

              {/* ── Section: Legal IDs (show only if any data) ── */}
              {(data.registrationId || data.vatId) && (
                <FormSection title={t('intakeSectionLegal', lang)}>
                  <FieldInput id="registrationId" label={t('intakeRegistrationId', lang)} value={data.registrationId} onChange={(v) => updateField('registrationId', v)} placeholder="SIRET / IDE / HR-Nr" />
                  <FieldInput id="vatId" label={t('intakeVatId', lang)} value={data.vatId} onChange={(v) => updateField('vatId', v)} placeholder="TVA / USt-IdNr / MwSt" />
                </FormSection>
              )}

              {/* ── Section: Financial (show only if any data) ── */}
              {(data.iban || data.bic || data.paymentTerms || data.creditLimit) && (
                <FormSection title={t('intakeSectionFinancial', lang)}>
                  {data.iban && (
                    <FieldInput id="iban" label="IBAN" value={data.iban} onChange={(v) => updateField('iban', v)} />
                  )}
                  {data.bic && (
                    <FieldInput id="bic" label="BIC / SWIFT" value={data.bic} onChange={(v) => updateField('bic', v)} />
                  )}
                  {(data.paymentTerms || data.creditLimit) && (
                    <div className="grid grid-cols-2 gap-3">
                      <FieldInput id="paymentTerms" label={t('intakePaymentTerms', lang)} value={data.paymentTerms} onChange={(v) => updateField('paymentTerms', v)} placeholder="30 jours fin de mois" />
                      <FieldInput id="creditLimit" label={t('intakeCreditLimit', lang)} value={data.creditLimit} onChange={(v) => updateField('creditLimit', v)} placeholder="15 000 €" />
                    </div>
                  )}
                </FormSection>
              )}

              {/* ── Section: Portfolio ── */}
              <FormSection title={t('intakeSectionPortfolio', lang)}>
                <FieldInput id="sites" label={t('intakeSites', lang)} value={data.sites} onChange={(v) => updateField('sites', v)} placeholder={t('intakeSitesPlaceholder', lang)} />
                <FieldInput id="buildingTypes" label={t('intakeBuildingTypes', lang)} value={data.buildingTypes} onChange={(v) => updateField('buildingTypes', v)} placeholder={t('intakeBuildingTypesPlaceholder', lang)} />
                <FieldInput id="assetTypes" label={t('intakeAssetTypes', lang)} value={data.assetTypes} onChange={(v) => updateField('assetTypes', v)} placeholder={t('intakeAssetTypesPlaceholder', lang)} />
              </FormSection>

              {/* ── Section: Pain points ── */}
              <FormSection title={t('intakeSectionPains', lang)}>
                <FieldTextarea
                  id="painPoints"
                  label={t('intakePainPoints', lang)}
                  value={data.painPoints.join('\n')}
                  onChange={(v) => updateField('painPoints', v.split('\n').filter((l) => l.trim()))}
                  placeholder={t('intakePainPointsHint', lang)}
                  rows={4}
                />
              </FormSection>

              {/* ── Section: Project ── */}
              <FormSection title={t('intakeSectionProject', lang)}>
                <FieldInput id="scope" label={t('intakeScope', lang)} value={data.projectScope} onChange={(v) => updateField('projectScope', v)} placeholder={t('intakeScopePlaceholder', lang)} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput id="budget" label={t('intakeBudget', lang)} value={data.budget} onChange={(v) => updateField('budget', v)} placeholder="~200k CHF" />
                  <FieldInput id="timeline" label={t('intakeTimeline', lang)} value={data.timeline} onChange={(v) => updateField('timeline', v)} placeholder="Q1 2026" />
                </div>
                <FieldTextarea id="notes" label={t('intakeNotes', lang)} value={data.notes} onChange={(v) => updateField('notes', v)} placeholder={t('intakeNotesPlaceholder', lang)} rows={2} />
              </FormSection>

              {/* ── Metadata overflow ── */}
              <MetadataPills metadata={data.metadata} onRemove={removeMetadata} />

              {/* ── Logo upload ── */}
              <FormSection title={t('logoLabel', lang)}>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative flex min-h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors ${
                    logoBase64
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] bg-[var(--color-bg-elevated)]'
                  }`}
                >
                  {logoBase64 ? (
                    <div className="flex w-full flex-col items-center gap-2">
                      <div className="flex min-h-14 w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-sm">
                        <img src={logoBase64} alt="Logo" className="max-h-10 max-w-[180px] object-contain" />
                      </div>
                      <span className="break-all text-center text-[10px] text-[var(--color-text-tertiary)]">{logoName}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto mb-1.5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-xs text-[var(--color-text-tertiary)]">{t('logoDropHint', lang)}</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
                {logoBase64 && (
                  <button type="button" onClick={() => { setLogoBase64(null); setLogoName(''); }} className="text-[10px] text-[var(--color-text-tertiary)] bg-transparent border-0 cursor-pointer hover:text-[var(--color-text-secondary)]">
                    {t('logoRemove', lang)}
                  </button>
                )}
              </FormSection>

              {/* ── Date ── */}
              <FieldInput id="date" label={t('dateLabel', lang)} value={date} onChange={setDate} type="date" />

              {/* ── Errors ── */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              {/* ── Generate button ── */}
              <button
                type="submit"
                disabled={generating || !data.companyName || !data.contactPerson}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('generating', lang)}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {t('generatePdf', lang)}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
