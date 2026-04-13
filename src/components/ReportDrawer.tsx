'use client';

import { useState, useRef, useCallback } from 'react';
import { t, type Locale } from '@/lib/i18n';

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
}

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

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context unavailable');
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}

export default function ReportDrawer({ open, onClose, onGenerate, lang, generating, errorMessage }: ReportDrawerProps) {
  const [companyName, setCompanyName] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    try {
      const normalizedLogo = await normalizeLogoToPng(file);
      setLogoBase64(normalizedLogo);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ companyName, projectManager, logoBase64, date });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[var(--color-bg)] border-l border-[var(--color-border)] z-50 overflow-y-auto shadow-xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text)]">
              {t('drawerTitle', lang)}
            </h2>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo upload */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                {t('logoLabel', lang)}
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative flex min-h-40 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 cursor-pointer transition-colors ${
                  logoBase64
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] bg-[var(--color-bg-elevated)]'
                }`}
              >
                {logoBase64 ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <div className="flex min-h-20 w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
                      <img src={logoBase64} alt="Logo" className="max-h-12 max-w-[200px] object-contain" />
                    </div>
                    <span className="break-all text-center text-xs text-[var(--color-text-tertiary)]">{logoName}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm text-[var(--color-text-tertiary)]">{t('logoDropHint', lang)}</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                {t('logoFormats', lang)}
              </p>
              {logoBase64 && (
                <button
                  type="button"
                  onClick={() => { setLogoBase64(null); setLogoName(''); }}
                  className="mt-2 text-xs text-[var(--color-text-tertiary)] bg-transparent border-0 cursor-pointer hover:text-[var(--color-text-secondary)]"
                >
                  {t('logoRemove', lang)}
                </button>
              )}
            </div>

            {/* Company name */}
            <div>
              <label htmlFor="company" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                {t('companyLabel', lang)}
              </label>
              <input
                id="company"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
                placeholder={t('companyPlaceholder', lang)}
              />
            </div>

            {/* Project manager */}
            <div>
              <label htmlFor="manager" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                {t('managerLabel', lang)}
              </label>
              <input
                id="manager"
                type="text"
                required
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
                placeholder={t('managerPlaceholder', lang)}
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                {t('dateLabel', lang)}
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
              />
            </div>

            {/* Generate */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={generating || !companyName || !projectManager}
              className="w-full py-3.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {generating ? (t('generating', lang)) : t('generatePdf', lang)}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
