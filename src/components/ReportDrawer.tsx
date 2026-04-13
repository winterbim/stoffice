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
  /* extended client data */
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  sites?: string;
  buildingTypes?: string;
  assetTypes?: string;
  painPoints?: string[];
  projectScope?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
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

/* ── Main component ─────────────────────────────────────────────────── */

type Phase = 'input' | 'structured';

export default function ReportDrawer({ open, onClose, onGenerate, lang, generating, errorMessage }: ReportDrawerProps) {
  /* --- state --- */
  const [phase, setPhase] = useState<Phase>('input');
  const [rawText, setRawText] = useState('');
  const [data, setData] = useState<StructuredClientData>(emptyClientData());
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [structuring, setStructuring] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* --- handlers --- */
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
    // Simulate a brief processing delay for UX feel, then parse
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      companyName: data.companyName,
      projectManager: data.contactPerson,
      logoBase64,
      date,
      contactEmail: data.contactEmail || undefined,
      contactPhone: data.contactPhone || undefined,
      address: data.address || undefined,
      sites: data.sites || undefined,
      buildingTypes: data.buildingTypes || undefined,
      assetTypes: data.assetTypes || undefined,
      painPoints: data.painPoints.length > 0 ? data.painPoints : undefined,
      projectScope: data.projectScope || undefined,
      budget: data.budget || undefined,
      timeline: data.timeline || undefined,
      notes: data.notes || undefined,
    });
  };

  if (!open) return null;

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
                  onPaste={() => {/* allow paste, no special handling needed */}}
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
              {/* Confidence badge + back link */}
              <div className="flex items-center justify-between gap-3">
                {data.confidence > 0 && (
                  <ConfidenceBadge value={data.confidence} lang={lang} />
                )}
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

              {/* ── Section: Client ── */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t('intakeSectionClient', lang)}
                </div>
                <FieldInput id="companyName" label={t('companyLabel', lang)} value={data.companyName} onChange={(v) => updateField('companyName', v)} placeholder={t('companyPlaceholder', lang)} required />
                <FieldInput id="contactPerson" label={t('intakeContactPerson', lang)} value={data.contactPerson} onChange={(v) => updateField('contactPerson', v)} placeholder={t('managerPlaceholder', lang)} required />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput id="contactEmail" label={t('intakeEmail', lang)} value={data.contactEmail} onChange={(v) => updateField('contactEmail', v)} type="email" placeholder="email@example.com" />
                  <FieldInput id="contactPhone" label={t('intakePhone', lang)} value={data.contactPhone} onChange={(v) => updateField('contactPhone', v)} type="tel" placeholder="+41 …" />
                </div>
                <FieldInput id="address" label={t('intakeAddress', lang)} value={data.address} onChange={(v) => updateField('address', v)} placeholder="Strasse Nr, PLZ Ort" />
              </div>

              {/* ── Section: Portfolio ── */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t('intakeSectionPortfolio', lang)}
                </div>
                <FieldInput id="sites" label={t('intakeSites', lang)} value={data.sites} onChange={(v) => updateField('sites', v)} placeholder={t('intakeSitesPlaceholder', lang)} />
                <FieldInput id="buildingTypes" label={t('intakeBuildingTypes', lang)} value={data.buildingTypes} onChange={(v) => updateField('buildingTypes', v)} placeholder={t('intakeBuildingTypesPlaceholder', lang)} />
                <FieldInput id="assetTypes" label={t('intakeAssetTypes', lang)} value={data.assetTypes} onChange={(v) => updateField('assetTypes', v)} placeholder={t('intakeAssetTypesPlaceholder', lang)} />
              </div>

              {/* ── Section: Pain points ── */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t('intakeSectionPains', lang)}
                </div>
                <FieldTextarea
                  id="painPoints"
                  label={t('intakePainPoints', lang)}
                  value={data.painPoints.join('\n')}
                  onChange={(v) => updateField('painPoints', v.split('\n').filter((l) => l.trim()))}
                  placeholder={t('intakePainPointsHint', lang)}
                  rows={4}
                />
              </div>

              {/* ── Section: Project ── */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t('intakeSectionProject', lang)}
                </div>
                <FieldInput id="scope" label={t('intakeScope', lang)} value={data.projectScope} onChange={(v) => updateField('projectScope', v)} placeholder={t('intakeScopePlaceholder', lang)} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput id="budget" label={t('intakeBudget', lang)} value={data.budget} onChange={(v) => updateField('budget', v)} placeholder="~200k CHF" />
                  <FieldInput id="timeline" label={t('intakeTimeline', lang)} value={data.timeline} onChange={(v) => updateField('timeline', v)} placeholder="Q1 2026" />
                </div>
                <FieldTextarea id="notes" label={t('intakeNotes', lang)} value={data.notes} onChange={(v) => updateField('notes', v)} placeholder={t('intakeNotesPlaceholder', lang)} rows={2} />
              </div>

              {/* ── Logo upload ── */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {t('logoLabel', lang)}
                </div>
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
              </div>

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
