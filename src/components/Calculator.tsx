'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculate, formatCHF, formatNumber, DEFAULTS, type CalculatorInputs } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';

interface CalculatorProps {
  lang: Locale;
}

function NumberInput({
  id,
  label,
  value,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium text-[var(--color-text-2)] uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] rounded-lg focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] transition-all">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none p-4 font-[var(--font-serif)] text-2xl text-[var(--color-text-0)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pr-4 font-[var(--font-mono)] text-xs font-medium text-[var(--color-text-3)] uppercase tracking-wider">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  tip,
  pct,
  checked,
  onChange,
}: {
  label: string;
  tip: string;
  pct: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 bg-[var(--color-bg-2)] cursor-pointer transition-all select-none text-left border-0 w-full hover:bg-[var(--color-bg-3)] ${
        checked ? 'bg-[rgba(0,212,170,0.08)] border-l-2 border-l-[var(--color-accent)]' : ''
      }`}
      title={tip}
    >
      <span className="text-sm font-medium text-[var(--color-text-1)]">{label}</span>
      <span className={`font-[var(--font-mono)] text-xs font-semibold tracking-wide ${checked ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-3)]'}`}>
        {pct}
      </span>
      <div className="relative w-11 h-6">
        <div className={`absolute inset-0 rounded-full transition-colors ${checked ? 'bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent-glow)]' : 'bg-[var(--color-bg-4)]'}`}>
          <div className={`absolute left-[3px] top-[3px] w-[18px] h-[18px] rounded-full transition-transform ${checked ? 'translate-x-5 bg-white shadow-[0_0_8px_rgba(0,212,170,0.3)]' : 'bg-[var(--color-text-2)]'}`} />
        </div>
      </div>
    </button>
  );
}

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
      {/* INPUT CARD */}
      <section className="bg-[var(--color-glass)] backdrop-blur-2xl border border-[var(--color-glass-border)] rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-25" />

        <div className="flex items-baseline gap-4 pb-6 mb-8 border-b border-[var(--color-glass-border)]">
          <span className="font-[var(--font-mono)] text-xs font-bold text-[var(--color-accent)] tracking-wider">01</span>
          <h2 className="font-[var(--font-serif)] text-2xl text-[var(--color-text-0)]">{t('inputVariables', lang)}</h2>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <NumberInput id="daysPerYear" label={t('daysPerYear', lang)} value={inputs.daysPerYear} unit={t('unitDays', lang)} onChange={(v) => update('daysPerYear', v)} />
          <NumberInput id="incidentsPerDay" label={t('incidentsPerDay', lang)} value={inputs.incidentsPerDay} unit="/d" onChange={(v) => update('incidentsPerDay', v)} />
        </div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <NumberInput id="minutesPerIncident" label={t('minutesPerIncident', lang)} value={inputs.minutesPerIncident} unit="min" onChange={(v) => update('minutesPerIncident', v)} />
          <NumberInput id="hourlyRate" label={t('hourlyRate', lang)} value={inputs.hourlyRate} unit="CHF" onChange={(v) => update('hourlyRate', v)} />
        </div>

        <div className="h-px bg-[var(--color-glass-border)] my-6" />

        <NumberInput id="costAI" label={t('costAI', lang)} value={inputs.costAI} unit="CHF/a" onChange={(v) => update('costAI', v)} />

        <div className="h-px bg-[var(--color-glass-border)] my-6" />

        <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text-0)] mb-5">{t('optimizationFactors', lang)}</h3>

        <div className="flex flex-col gap-px bg-[var(--color-glass-border)] border border-[var(--color-glass-border)] rounded-xl overflow-hidden mb-6">
          <ToggleRow label={t('digitalTwin', lang)} tip={t('digitalTwinTip', lang)} pct="75 %" checked={inputs.optZwilling} onChange={(v) => update('optZwilling', v)} />
          <ToggleRow label={t('assetsLinked', lang)} tip={t('assetsLinkedTip', lang)} pct="10 %" checked={inputs.optAssets} onChange={(v) => update('optAssets', v)} />
          <ToggleRow label={t('docUpToDate', lang)} tip={t('docUpToDateTip', lang)} pct="5 %" checked={inputs.optDoku} onChange={(v) => update('optDoku', v)} />
          <ToggleRow label={t('autoOrders', lang)} tip={t('autoOrdersTip', lang)} pct="10 %" checked={inputs.optAuto} onChange={(v) => update('optAuto', v)} />
        </div>

        {/* Meter */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 text-sm text-[var(--color-text-2)]">
            <span>{t('totalOptimization', lang)}</span>
            <strong className="font-[var(--font-mono)] font-bold text-[var(--color-accent)]">
              {Math.round(totalPct * 100)} %
            </strong>
          </div>
          <div className="h-2 bg-[var(--color-bg-3)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-success)] to-[var(--color-accent)] transition-[width] duration-500"
              style={{ width: `${Math.round(totalPct * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setInputs(DEFAULTS)}
            className="px-6 py-3 rounded-lg bg-transparent border border-[var(--color-glass-border)] text-[var(--color-text-2)] font-semibold text-sm cursor-pointer hover:text-[var(--color-text-1)] hover:border-[var(--color-text-3)] transition-all"
          >
            {t('reset', lang)}
          </button>
        </div>
      </section>

      {/* OUTPUT CARD */}
      <section className="bg-[var(--color-glass)] backdrop-blur-2xl border border-[var(--color-glass-border)] rounded-2xl p-10 relative overflow-hidden lg:sticky lg:top-20">
        <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-25" />

        <div className="flex items-baseline gap-4 pb-6 mb-8 border-b border-[var(--color-glass-border)]">
          <span className="font-[var(--font-mono)] text-xs font-bold text-[var(--color-accent)] tracking-wider">02</span>
          <h2 className="font-[var(--font-serif)] text-2xl text-[var(--color-text-0)]">{t('results', lang)}</h2>
        </div>

        {!results || results.activeFactors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-[var(--color-text-3)]">
            <p className="font-[var(--font-serif)] text-xl text-[var(--color-text-2)] mb-2">
              {t('placeholderTitle', lang)}
            </p>
            <p className="text-sm">{t('placeholderSub', lang)}</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* Hero savings */}
            <div className="text-center py-8">
              <span className="block font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-text-3)] mb-3">
                {t('heroEyebrow', lang)}
              </span>
              <span className="block font-[var(--font-serif)] text-5xl text-[var(--color-accent)] tracking-tight">
                {formatCHF(Math.round(results.netSavings))}
              </span>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--color-text-3)]">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[rgba(0,212,170,0.08)] border border-[rgba(0,212,170,0.15)] rounded-full text-[var(--color-accent)] font-[var(--font-mono)] text-xs font-semibold">
                  ↓ {Math.round(results.totalOptimizationPct * 100)} % {t('optimization', lang)}
                </span>
                {t('perYear', lang)}
              </div>
            </div>

            {/* Data strip */}
            <div className="grid grid-cols-3 gap-px bg-[var(--color-glass-border)] rounded-xl overflow-hidden mb-8">
              <div className="flex flex-col items-center gap-1 p-5 bg-[var(--color-bg-2)] text-center">
                <span className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{formatCHF(Math.round(results.costNow))}</span>
                <span className="text-xs text-[var(--color-text-3)]">{t('currentCosts', lang)}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-5 bg-[var(--color-bg-2)] text-center">
                <span className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{formatCHF(Math.round(results.costNew))}</span>
                <span className="text-xs text-[var(--color-text-3)]">{t('optimizedCosts', lang)}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-5 bg-[var(--color-bg-2)] text-center">
                <span className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">
                  {formatNumber(results.hoursSaved)} {t('hours', lang)}
                </span>
                <span className="text-xs text-[var(--color-text-3)]">
                  {t('timeSaved', lang)} ({formatNumber(results.hoursSaved / 8)} {t('workdays', lang)})
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text-0)] mb-4">{t('breakdown', lang)}</h3>
            {results.activeFactors.map((f) => (
              <div key={f.id} className="flex justify-between items-center py-3 border-b border-[var(--color-glass-border)] text-sm">
                <span className="text-[var(--color-text-1)]">
                  {t(f.labelKey, lang)} ({Math.round(f.pct * 100)} %)
                </span>
                <span className="font-[var(--font-mono)] font-semibold text-[var(--color-success)]">
                  + {formatCHF(Math.round(results.costNow * f.pct))}
                </span>
              </div>
            ))}
            {inputs.costAI > 0 && (
              <div className="flex justify-between items-center py-3 text-sm">
                <span className="text-[var(--color-text-1)]">{t('aiInvestment', lang)}</span>
                <span className="font-[var(--font-mono)] font-semibold text-[var(--color-danger)]">
                  − {formatCHF(inputs.costAI)}
                </span>
              </div>
            )}

            {/* ROI */}
            {inputs.costAI > 0 && (
              <div className="mt-8 pt-8 border-t border-[var(--color-glass-border)]">
                <h3 className="font-[var(--font-serif)] text-lg text-[var(--color-text-0)] mb-5">{t('roi', lang)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] rounded-xl p-5 text-center">
                    <div className={`font-[var(--font-serif)] text-xl ${results.roiPct >= 100 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                      {Math.round(results.roiPct)} %
                    </div>
                    <div className="text-xs text-[var(--color-text-3)] uppercase tracking-wider mt-1">{t('roiLabel', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] rounded-xl p-5 text-center">
                    <div className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">
                      {results.paybackMonths <= 12
                        ? `${results.paybackMonths} ${t('months', lang)}`
                        : `${(results.paybackMonths / 12).toFixed(1)} ${t('years', lang)}`}
                    </div>
                    <div className="text-xs text-[var(--color-text-3)] uppercase tracking-wider mt-1">{t('paybackPeriod', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] rounded-xl p-5 text-center">
                    <div className="font-[var(--font-serif)] text-xl text-[var(--color-text-0)]">{formatCHF(inputs.costAI)}</div>
                    <div className="text-xs text-[var(--color-text-3)] uppercase tracking-wider mt-1">{t('investment', lang)}</div>
                  </div>
                  <div className="bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] rounded-xl p-5 text-center">
                    <div className={`font-[var(--font-serif)] text-xl ${results.netSavings >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {formatCHF(Math.round(results.netSavings))}
                    </div>
                    <div className="text-xs text-[var(--color-text-3)] uppercase tracking-wider mt-1">{t('netProfit', lang)}</div>
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
