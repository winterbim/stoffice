'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculate, formatCHF, formatNumber, DEFAULTS, type CalculatorInputs } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';

interface CalculatorProps {
  lang: Locale;
}

/* ── Number input ──────────────────────────────────── */

function NumberInput({
  id, label, value, unit, onChange,
}: {
  id: string; label: string; value: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-[var(--font-mono)] font-medium text-[var(--color-text-3)] uppercase tracking-[0.1em]">
        {label}
      </label>
      <div className="flex items-center bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] rounded-xl focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_var(--color-accent-glow),inset_0_1px_0_rgba(0,212,170,0.05)] transition-all">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none px-4 py-3.5 font-[var(--font-serif)] text-xl text-[var(--color-text-0)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pr-4 font-[var(--font-mono)] text-[10px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ── Toggle row ────────────────────────────────────── */

function ToggleRow({
  label, tip, pct, checked, color, onChange,
}: {
  label: string; tip: string; pct: string; checked: boolean; color: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 cursor-pointer transition-all select-none text-left border-0 w-full ${
        checked
          ? 'bg-[rgba(0,212,170,0.05)]'
          : 'bg-[var(--color-bg-1)] hover:bg-[var(--color-bg-2)]'
      }`}
      title={tip}
      style={checked ? { borderLeft: `2px solid ${color}` } : { borderLeft: '2px solid transparent' }}
    >
      <span className={`text-sm ${checked ? 'text-[var(--color-text-0)] font-medium' : 'text-[var(--color-text-2)]'}`}>
        {label}
      </span>
      <span className={`font-[var(--font-mono)] text-[11px] font-bold tracking-wide ${checked ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-3)]'}`}>
        {pct}
      </span>
      <div className="relative w-10 h-[22px]">
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          checked
            ? 'bg-[var(--color-accent)] shadow-[0_0_10px_rgba(0,212,170,0.4)]'
            : 'bg-[var(--color-bg-4)]'
        }`}>
          <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all duration-300 ${
            checked
              ? 'left-[20px] bg-white shadow-[0_0_6px_rgba(0,212,170,0.3)]'
              : 'left-[2px] bg-[var(--color-text-3)]'
          }`} />
        </div>
      </div>
    </button>
  );
}

/* ── Stat pill ─────────────────────────────────────── */

function StatPill({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-4 bg-[var(--color-bg-0)] rounded-xl border border-[var(--color-glass-border)]">
      <span className={`font-[var(--font-serif)] text-lg ${accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-0)]'}`}>
        {value}
      </span>
      <span className="text-[10px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}

/* ── Main calculator ───────────────────────────────── */

export default function Calculator({ lang }: CalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULTS);

  const update = useCallback(
    <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const results = useMemo(() => calculate(inputs), [inputs]);

  const totalPct = useMemo(() => {
    let p = 0;
    if (inputs.optZwilling) p += 0.75;
    if (inputs.optAssets) p += 0.10;
    if (inputs.optDoku) p += 0.05;
    if (inputs.optAuto) p += 0.10;
    return Math.min(p, 1);
  }, [inputs.optZwilling, inputs.optAssets, inputs.optDoku, inputs.optAuto]);

  const toggleColors: Record<string, string> = {
    optZwilling: '#00d4aa',
    optAssets: '#60a5fa',
    optDoku: '#a87ad4',
    optAuto: '#d4a843',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start pb-8">

      {/* ── INPUT CARD ─────────────────────────────── */}
      <section className="card-glow p-8 relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30" />

        <div className="flex items-baseline gap-3 pb-5 mb-6 border-b border-[var(--color-glass-border)]">
          <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)] tracking-wider opacity-60">01</span>
          <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{t('inputVariables', lang)}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <NumberInput id="daysPerYear" label={t('daysPerYear', lang)} value={inputs.daysPerYear} unit={t('unitDays', lang)} onChange={(v) => update('daysPerYear', v)} />
          <NumberInput id="incidentsPerDay" label={t('incidentsPerDay', lang)} value={inputs.incidentsPerDay} unit="/d" onChange={(v) => update('incidentsPerDay', v)} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <NumberInput id="minutesPerIncident" label={t('minutesPerIncident', lang)} value={inputs.minutesPerIncident} unit="min" onChange={(v) => update('minutesPerIncident', v)} />
          <NumberInput id="hourlyRate" label={t('hourlyRate', lang)} value={inputs.hourlyRate} unit="CHF" onChange={(v) => update('hourlyRate', v)} />
        </div>

        <div className="h-px bg-[var(--color-glass-border)] my-5" />

        <NumberInput id="costAI" label={t('costAI', lang)} value={inputs.costAI} unit="CHF/a" onChange={(v) => update('costAI', v)} />

        <div className="h-px bg-[var(--color-glass-border)] my-5" />

        <h3 className="font-[var(--font-serif)] text-base text-[var(--color-text-0)] mb-4">{t('optimizationFactors', lang)}</h3>

        <div className="flex flex-col gap-px bg-[var(--color-glass-border)] rounded-xl overflow-hidden mb-5">
          <ToggleRow label={t('digitalTwin', lang)} tip={t('digitalTwinTip', lang)} pct="75 %" checked={inputs.optZwilling} color={toggleColors.optZwilling} onChange={(v) => update('optZwilling', v)} />
          <ToggleRow label={t('assetsLinked', lang)} tip={t('assetsLinkedTip', lang)} pct="10 %" checked={inputs.optAssets} color={toggleColors.optAssets} onChange={(v) => update('optAssets', v)} />
          <ToggleRow label={t('docUpToDate', lang)} tip={t('docUpToDateTip', lang)} pct="5 %" checked={inputs.optDoku} color={toggleColors.optDoku} onChange={(v) => update('optDoku', v)} />
          <ToggleRow label={t('autoOrders', lang)} tip={t('autoOrdersTip', lang)} pct="10 %" checked={inputs.optAuto} color={toggleColors.optAuto} onChange={(v) => update('optAuto', v)} />
        </div>

        {/* Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-sm text-[var(--color-text-2)]">
            <span>{t('totalOptimization', lang)}</span>
            <strong className="font-[var(--font-mono)] text-sm font-bold text-[var(--color-accent)]">
              {Math.round(totalPct * 100)} %
            </strong>
          </div>
          <div className="h-1.5 bg-[var(--color-bg-0)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${Math.round(totalPct * 100)}%`,
                background: 'linear-gradient(90deg, #00d4aa, #60a5fa, #a87ad4)',
                boxShadow: totalPct > 0 ? '0 0 12px rgba(0,212,170,0.4)' : 'none',
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setInputs(DEFAULTS)}
            className="px-5 py-2.5 rounded-lg bg-transparent border border-[var(--color-glass-border)] text-[var(--color-text-3)] font-medium text-xs cursor-pointer hover:text-[var(--color-text-1)] hover:border-[var(--color-text-3)] transition-all"
          >
            {t('reset', lang)}
          </button>
        </div>
      </section>

      {/* ── OUTPUT CARD ────────────────────────────── */}
      <section className="card-glow p-8 relative lg:sticky lg:top-24">
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--color-plum)] to-transparent opacity-20" />

        <div className="flex items-baseline gap-3 pb-5 mb-6 border-b border-[var(--color-glass-border)]">
          <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-plum)] tracking-wider opacity-60">02</span>
          <h2 className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{t('results', lang)}</h2>
        </div>

        {!results || results.activeFactors.length === 0 ? (
          /* ── Empty state ──────────────────────────── */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Animated rings */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border border-[var(--color-glass-border)] animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="absolute inset-3 rounded-full border border-[var(--color-glass-border)] animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
              <div className="absolute inset-6 rounded-full border border-[var(--color-glass-border)] animate-[pulse_3s_ease-in-out_infinite_1s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-text-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
            </div>
            <p className="font-[var(--font-serif)] text-lg text-[var(--color-text-2)] mb-1.5">
              {t('placeholderTitle', lang)}
            </p>
            <p className="text-xs text-[var(--color-text-3)] max-w-[240px]">
              {t('placeholderSub', lang)}
            </p>
          </div>
        ) : (
          /* ── Results ──────────────────────────────── */
          <div>
            {/* Hero savings */}
            <div className="text-center py-6 mb-6 rounded-xl bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] relative overflow-hidden">
              {/* Glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.06)_0%,transparent_70%)]" />
              <span className="relative block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-3)] mb-3">
                {t('heroEyebrow', lang)}
              </span>
              <span className="relative block font-[var(--font-serif)] text-[2.8rem] leading-none tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #00d4aa, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0,212,170,0.2))',
                }}
              >
                {formatCHF(Math.round(results.netSavings))}
              </span>
              <div className="relative flex items-center justify-center gap-2 mt-3 text-xs text-[var(--color-text-3)]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(0,212,170,0.08)] border border-[rgba(0,212,170,0.12)] rounded-full text-[var(--color-accent)] font-[var(--font-mono)] text-[10px] font-bold">
                  &darr; {Math.round(results.totalOptimizationPct * 100)} %
                </span>
                <span>{t('perYear', lang)}</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatPill value={formatCHF(Math.round(results.costNow))} label={t('currentCosts', lang)} />
              <StatPill value={formatCHF(Math.round(results.costNew))} label={t('optimizedCosts', lang)} accent />
              <StatPill
                value={`${formatNumber(results.hoursSaved)} ${t('hours', lang)}`}
                label={`${formatNumber(results.hoursSaved / 8)} ${t('workdays', lang)}`}
              />
            </div>

            {/* Breakdown */}
            <h3 className="font-[var(--font-serif)] text-base text-[var(--color-text-0)] mb-3">{t('breakdown', lang)}</h3>
            <div className="rounded-xl overflow-hidden border border-[var(--color-glass-border)] mb-6">
              {results.activeFactors.map((f) => {
                const savingsAmt = results.costNow * f.pct;
                const barWidth = (f.pct / results.totalOptimizationPct) * 100;
                return (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-glass-border)] last:border-0 bg-[var(--color-bg-1)]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                    <span className="flex-1 text-sm text-[var(--color-text-1)]">
                      {t(f.labelKey, lang)}
                    </span>
                    {/* Mini bar */}
                    <div className="w-16 h-1 rounded-full bg-[var(--color-bg-0)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: f.color }} />
                    </div>
                    <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--color-success)] w-24 text-right">
                      +{formatCHF(Math.round(savingsAmt))}
                    </span>
                  </div>
                );
              })}
              {inputs.costAI > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-bg-1)]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[var(--color-danger)]" />
                  <span className="flex-1 text-sm text-[var(--color-text-1)]">{t('aiInvestment', lang)}</span>
                  <div className="w-16" />
                  <span className="font-[var(--font-mono)] text-xs font-semibold text-[var(--color-danger)] w-24 text-right">
                    &minus;{formatCHF(inputs.costAI)}
                  </span>
                </div>
              )}
            </div>

            {/* ROI */}
            {inputs.costAI > 0 && (
              <div className="pt-5 border-t border-[var(--color-glass-border)]">
                <h3 className="font-[var(--font-serif)] text-base text-[var(--color-text-0)] mb-4">{t('roi', lang)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] rounded-xl p-4 text-center">
                    <div className={`font-[var(--font-serif)] text-xl ${results.roiPct >= 100 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                      {Math.round(results.roiPct)} %
                    </div>
                    <div className="text-[10px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider mt-1">{t('roiLabel', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] rounded-xl p-4 text-center">
                    <div className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">
                      {results.paybackMonths <= 12
                        ? `${results.paybackMonths} ${t('months', lang)}`
                        : `${(results.paybackMonths / 12).toFixed(1)} ${t('years', lang)}`}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider mt-1">{t('paybackPeriod', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] rounded-xl p-4 text-center">
                    <div className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{formatCHF(inputs.costAI)}</div>
                    <div className="text-[10px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider mt-1">{t('investment', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-0)] border border-[var(--color-glass-border)] rounded-xl p-4 text-center">
                    <div className={`font-[var(--font-serif)] text-xl ${results.netSavings >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {formatCHF(Math.round(results.netSavings))}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider mt-1">{t('netProfit', lang)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
