'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { calculate, formatCHF, DEFAULTS, type CalculatorInputs } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';
import ReportDrawer, { type ReportContext } from './ReportDrawer';
import ReportCanvas from './ReportCanvas';
import SankeyDiagram from './SankeyDiagram';

interface CalculatorProps {
  lang: Locale;
}

function Input({
  id, label, value, onChange,
}: {
  id: string; label: string; value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-[var(--color-text-tertiary)] mb-2 font-medium uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] text-lg outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

function Toggle({
  label, checked, onChange,
}: {
  label: string; checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full py-3.5 px-0 bg-transparent border-0 cursor-pointer transition-colors text-left ${
        checked ? 'text-[var(--color-text)]' : 'text-[var(--color-text-tertiary)]'
      }`}
    >
      <span className="text-sm">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-colors relative ${
        checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all shadow-sm ${
          checked ? 'left-[18px] bg-white' : 'left-0.5 bg-white'
        }`} />
      </div>
    </button>
  );
}

export default function Calculator({ lang }: CalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exportError, setExportError] = useState('');
  const [reportContext, setReportContext] = useState<ReportContext | null>(null);
  const exportCaptureRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    }, []
  );

  const results = useMemo(() => calculate(inputs), [inputs]);
  const hasOptimizations = results && results.activeFactors.length > 0;

  const activeToggles = useMemo(() => ({
    zwilling: inputs.optZwilling,
    assets: inputs.optAssets,
    doku: inputs.optDoku,
    auto: inputs.optAuto,
  }), [inputs.optAssets, inputs.optAuto, inputs.optDoku, inputs.optZwilling]);

  const waitForAssets = useCallback(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    const container = exportCaptureRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return typeof img.decode === 'function' ? img.decode().catch(() => undefined) : Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        });
      })
    );

    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  }, []);

  const handleGeneratePdf = useCallback(async (context: ReportContext) => {
    if (!results || !hasOptimizations) return;

    setExportError('');
    setGenerating(true);

    try {
      flushSync(() => {
        setReportContext(context);
      });

      await waitForAssets();

      let reportDataUrl = '';
      if (exportCaptureRef.current) {
        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(exportCaptureRef.current, {
          backgroundColor: '#ffffff',
          scale: 2.5,
          logging: false,
          useCORS: true,
          imageTimeout: 0,
        });
        reportDataUrl = canvas.toDataURL('image/png');
      }

      const { generateReport } = await import('@/lib/pdf');
      await generateReport({ context, lang, reportDataUrl });
      setDrawerOpen(false);
    } catch {
      setExportError(t('pdfError', lang));
    } finally {
      setGenerating(false);
    }
  }, [results, hasOptimizations, waitForAssets, lang]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:items-start">
        {/* Inputs */}
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-7 md:p-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] mb-2">
                {t('calcEyebrow', lang)}
              </div>
              <div className="font-[var(--font-serif)] text-[2rem] leading-none text-[var(--color-text)]">
                {t('calcTitle', lang)}
              </div>
            </div>
            <button
              onClick={() => setInputs(DEFAULTS)}
              className="shrink-0 text-xs text-[var(--color-text-tertiary)] bg-transparent border-0 cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors"
            >
              {t('reset', lang)}
            </button>
          </div>

          {/* Hypotheses */}
          <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-3">
              {t('calcHypothesesTitle', lang)}
            </div>
            <ul className="space-y-1.5">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="text-[12px] leading-5 text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 rounded-full bg-[var(--color-text-tertiary)] shrink-0" />
                  {t(`calcHypothesis${n}`, lang)}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input id="days" label={t('daysPerYear', lang)} value={inputs.daysPerYear} onChange={(v) => update('daysPerYear', v)} />
            <Input id="incidents" label={t('incidentsPerDay', lang)} value={inputs.incidentsPerDay} onChange={(v) => update('incidentsPerDay', v)} />
            <Input id="minutes" label={t('minutesPerIncident', lang)} value={inputs.minutesPerIncident} onChange={(v) => update('minutesPerIncident', v)} />
            <Input id="rate" label={t('hourlyRate', lang)} value={inputs.hourlyRate} onChange={(v) => update('hourlyRate', v)} />
          </div>

          <div className="mt-4">
            <Input id="costAI" label={t('costAI', lang)} value={inputs.costAI} onChange={(v) => update('costAI', v)} />
          </div>

          <div className="mt-8 mb-3 text-xs text-[var(--color-text-tertiary)] font-medium uppercase tracking-wider">
            {t('optimizations', lang)}
          </div>
          <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5">
            <Toggle label={t('digitalTwin', lang)} checked={inputs.optZwilling} onChange={(v) => update('optZwilling', v)} />
            <Toggle label={t('assetsLinked', lang)} checked={inputs.optAssets} onChange={(v) => update('optAssets', v)} />
            <Toggle label={t('docUpToDate', lang)} checked={inputs.optDoku} onChange={(v) => update('optDoku', v)} />
            <Toggle label={t('autoOrders', lang)} checked={inputs.optAuto} onChange={(v) => update('optAuto', v)} />
          </div>
        </div>

        {/* Result */}
        <div className="xl:sticky xl:top-24 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 md:p-10" role="status" aria-live="polite">
          {hasOptimizations ? (
            <div className="flex min-h-[320px] flex-col justify-between">
              <div>
                <div className="text-xs text-[var(--color-text-tertiary)] font-medium uppercase tracking-[0.15em] mb-4">
                  {t('savingsPerYear', lang)}
                </div>
                <div className="font-[var(--font-serif)] text-[clamp(2.8rem,5vw,4.8rem)] text-[var(--color-accent)] leading-[0.95] tracking-tight mb-8">
                  {formatCHF(Math.round(results.netSavings))}
                </div>
              </div>

              {inputs.costAI > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl bg-white px-5 py-4 text-center">
                    <div className="font-[var(--font-serif)] text-2xl text-[var(--color-text)]">
                      {Math.round(results.roiPct)}&thinsp;%
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      {t('roiLabel', lang)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white px-5 py-4 text-center">
                    <div className="font-[var(--font-serif)] text-2xl text-[var(--color-text)]">
                      {results.paybackMonths <= 12
                        ? `${results.paybackMonths} ${t('months', lang)}`
                        : `${(results.paybackMonths / 12).toFixed(1)} ${t('years', lang)}`}
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                      {t('paybackLabel', lang)}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white cursor-pointer transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {t('reportBtn', lang)}
                </button>
                <a
                  href={`mailto:info@stoffice.ch?subject=ROI%20Estimate&body=${encodeURIComponent('Net savings: ' + formatCHF(Math.round(results.netSavings)) + ' / ROI: ' + Math.round(results.roiPct) + '%')}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-text)] no-underline cursor-pointer transition-colors hover:bg-[var(--color-bg-elevated)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {t('calcGetEstimate', lang)}
                </a>
                <p className="text-center text-[12px] leading-relaxed text-[var(--color-text-tertiary)] mt-2">
                  {t('calcDisclaimer', lang)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[var(--color-text-tertiary)] text-center max-w-[240px]">
              {t('enableOptimizations', lang)}
            </p>
          )}
        </div>
      </div>

      {/* Sankey preview — below calculator, always visible when active */}
      {hasOptimizations && results && (
        <div className="mt-16 border-t border-[var(--color-border)] pt-12">
          <SankeyDiagram
            lang={lang}
            activeToggles={activeToggles}
            costNow={results.costNow}
          />
        </div>
      )}

      {reportContext && hasOptimizations && results && (
        <div
          ref={exportCaptureRef}
          aria-hidden="true"
          className="fixed left-[-300vw] top-0 bg-white"
        >
          <ReportCanvas
            lang={lang}
            context={reportContext}
            results={results}
            activeToggles={activeToggles}
          />
        </div>
      )}

      {/* Report drawer */}
      <ReportDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onGenerate={handleGeneratePdf}
        lang={lang}
        generating={generating}
        errorMessage={exportError}
      />
    </>
  );
}
