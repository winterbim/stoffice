'use client';

import { formatCHF, formatNumber, type CalculatorResults } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';
import type { ReportContext } from './ReportDrawer';
import SankeyDiagram from './SankeyDiagram';

interface ReportCanvasProps {
  lang: Locale;
  context: ReportContext;
  results: CalculatorResults;
  activeToggles: {
    zwilling: boolean;
    assets: boolean;
    doku: boolean;
    auto: boolean;
  };
}

export default function ReportCanvas({
  lang,
  context,
  results,
  activeToggles,
}: ReportCanvasProps) {
  const accentList = [
    activeToggles.zwilling && t('digitalTwin', lang),
    activeToggles.assets && t('assetsLinked', lang),
    activeToggles.doku && t('docUpToDate', lang),
    activeToggles.auto && t('autoOrders', lang),
  ].filter(Boolean) as string[];

  return (
    <div className="w-[1120px] min-h-[792px] bg-white text-[var(--color-text)]">
      <div className="flex min-h-[792px] flex-col p-10">
        <header className="flex items-start justify-between border-b border-[var(--color-border)] pb-8">
          <div className="max-w-[690px]">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {t('reportDocumentEyebrow', lang)}
            </div>
            <h1 className="mt-5 font-[var(--font-serif)] text-[3rem] leading-[1.02] text-[var(--color-text)]">
              {t('reportDocumentTitle', lang)}
            </h1>
            <p className="mt-4 text-[17px] leading-8 text-[var(--color-text-secondary)]">
              {t('reportExecutiveBody', lang)}
            </p>
          </div>

          <div className="ml-8 flex w-[250px] flex-col items-end gap-4">
            <div className="flex h-[84px] w-full items-center justify-center rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              {context.logoBase64 ? (
                <img
                  src={context.logoBase64}
                  alt={context.companyName}
                  className="max-h-[54px] max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="font-[var(--font-serif)] text-[1.75rem] leading-none text-[var(--color-text)]">
                    {context.companyName}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full rounded-[24px] bg-[var(--color-accent)] px-6 py-5 text-white">
              <div className="font-[var(--font-serif)] text-[1.8rem] leading-none">Stoffice</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/80">Smart Building AI</div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 border-b border-[var(--color-border)] py-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <MetaCard label={t('reportPreparedFor', lang)} value={context.companyName} />
            <MetaCard label={t('reportPreparedBy', lang)} value={context.projectManager} />
            <MetaCard label={t('reportGeneratedOn', lang)} value={context.date} />
            <MetaCard
              label={t('optimizations', lang)}
              value={accentList.length > 0 ? accentList.join(', ') : '—'}
            />
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
              {t('reportRecommendationTitle', lang)}
            </div>
            <p className="mt-4 text-[15px] leading-7 text-[var(--color-text-secondary)]">
              {t('reportRecommendationBody', lang)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-4 py-8">
          <KpiCard label={t('reportKpiCurrent', lang)} value={formatCHF(Math.round(results.costNow))} />
          <KpiCard label={t('reportKpiSavings', lang)} value={formatCHF(Math.round(results.netSavings))} accent />
          <KpiCard label={t('roiLabel', lang)} value={`${Math.round(results.roiPct)} %`} />
          <KpiCard label={t('reportKpiHours', lang)} value={`${formatNumber(results.hoursSaved)} h`} />
        </section>

        <section className="flex-1">
          <SankeyDiagram
            lang={lang}
            variant="export"
            activeToggles={activeToggles}
            costNow={results.costNow}
          />
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-tertiary)]">
          <span>{t('footerDisclaimer', lang)}</span>
          <span>Stoffice · stoffice.vercel.app</span>
        </footer>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--color-border)] bg-white p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div className="mt-3 text-[15px] leading-7 text-[var(--color-text)]">
        {value}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${accent ? 'border-transparent bg-[var(--color-accent)] text-white' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)]'}`}>
      <div className={`text-[11px] font-medium uppercase tracking-[0.16em] ${accent ? 'text-white/80' : 'text-[var(--color-text-tertiary)]'}`}>
        {label}
      </div>
      <div className={`mt-4 font-[var(--font-serif)] text-[2.2rem] leading-none ${accent ? 'text-white' : 'text-[var(--color-text)]'}`}>
        {value}
      </div>
    </div>
  );
}
