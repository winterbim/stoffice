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

  const hasExtended = !!(context.contactEmail || context.contactPhone || context.sites || context.painPoints?.length);

  return (
    <div className="w-[1120px] min-h-[792px] bg-white text-[var(--color-text)]">
      <div className="flex min-h-[792px] flex-col p-10">
        {/* ── Header ── */}
        <header className="flex items-start justify-between border-b border-[var(--color-border)] pb-7">
          <div className="max-w-[690px]">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-tertiary)]">
              {t('reportDocumentEyebrow', lang)}
            </div>
            <h1 className="mt-4 font-[var(--font-serif)] text-[2.6rem] leading-[1.05] text-[var(--color-text)]">
              {t('reportDocumentTitle', lang)}
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-[var(--color-text-secondary)]">
              {t('reportExecutiveBody', lang)}
            </p>
          </div>

          <div className="ml-8 flex w-[250px] flex-col items-end gap-3">
            <div className="flex h-[80px] w-full items-center justify-center rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              {context.logoBase64 ? (
                <img
                  src={context.logoBase64}
                  alt={context.companyName}
                  className="max-h-[50px] max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="font-[var(--font-serif)] text-[1.5rem] leading-none text-[var(--color-text)]">
                    {context.companyName}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full rounded-[20px] bg-[var(--color-accent)] px-5 py-4 text-white">
              <div className="font-[var(--font-serif)] text-[1.5rem] leading-none">Stoffice</div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80">Smart Building AI</div>
            </div>
          </div>
        </header>

        {/* ── Client profile + meta ── */}
        <section className="grid gap-5 border-b border-[var(--color-border)] py-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3 md:grid-cols-2">
            <MetaCard label={t('reportPreparedFor', lang)} value={context.companyName} />
            <MetaCard label={t('reportPreparedBy', lang)} value={context.projectManager} />
            <MetaCard label={t('reportGeneratedOn', lang)} value={context.date} />
            <MetaCard
              label={t('optimizations', lang)}
              value={accentList.length > 0 ? accentList.join(', ') : '—'}
            />
            {context.contactEmail && (
              <MetaCard label={t('intakeEmail', lang)} value={context.contactEmail} />
            )}
            {context.contactPhone && (
              <MetaCard label={t('intakePhone', lang)} value={context.contactPhone} />
            )}
            {context.address && (
              <MetaCard label={t('intakeAddress', lang)} value={context.address} />
            )}
            {context.sites && (
              <MetaCard label={t('intakeSites', lang)} value={context.sites} />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
                {t('reportRecommendationTitle', lang)}
              </div>
              <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-secondary)]">
                {t('reportRecommendationBody', lang)}
              </p>
            </div>

            {context.projectScope && (
              <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
                  {t('intakeScope', lang)}
                </div>
                <p className="mt-2 text-[13px] leading-6 text-[var(--color-text)]">
                  {context.projectScope}
                  {context.budget && <span className="text-[var(--color-text-secondary)]"> · {context.budget}</span>}
                  {context.timeline && <span className="text-[var(--color-text-secondary)]"> · {context.timeline}</span>}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Pain points (if any) ── */}
        {hasExtended && context.painPoints && context.painPoints.length > 0 && (
          <section className="border-b border-[var(--color-border)] py-6">
            <div className="grid gap-5 lg:grid-cols-[0.4fr_0.6fr]">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] mb-2">
                  {t('intakeSectionPains', lang)}
                </div>
                <ul className="space-y-1.5">
                  {context.painPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-6 text-[var(--color-text-secondary)]">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {context.buildingTypes && (
                  <InfoCard label={t('intakeBuildingTypes', lang)} value={context.buildingTypes} />
                )}
                {context.assetTypes && (
                  <InfoCard label={t('intakeAssetTypes', lang)} value={context.assetTypes} />
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── KPIs ── */}
        <section className="grid grid-cols-4 gap-3 py-6">
          <KpiCard label={t('reportKpiCurrent', lang)} value={formatCHF(Math.round(results.costNow))} />
          <KpiCard label={t('reportKpiSavings', lang)} value={formatCHF(Math.round(results.netSavings))} accent />
          <KpiCard label={t('roiLabel', lang)} value={`${Math.round(results.roiPct)} %`} />
          <KpiCard label={t('reportKpiHours', lang)} value={`${formatNumber(results.hoursSaved)} h`} />
        </section>

        {/* ── Sankey ── */}
        <section className="flex-1">
          <SankeyDiagram
            lang={lang}
            variant="export"
            activeToggles={activeToggles}
            costNow={results.costNow}
          />
        </section>

        {/* ── Footer ── */}
        <footer className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-[10px] text-[var(--color-text-tertiary)]">
          <span>{t('footerDisclaimer', lang)}</span>
          <span>Stoffice · stoffice.vercel.app</span>
        </footer>
      </div>
    </div>
  );
}

/* ── Helper components ──────────────────────────────────────────────── */

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div className="mt-2 text-[13px] leading-6 text-[var(--color-text)]">
        {value}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div className="mt-2 text-[13px] leading-6 text-[var(--color-text-secondary)]">
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
    <div className={`rounded-[20px] border p-4 ${accent ? 'border-transparent bg-[var(--color-accent)] text-white' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)]'}`}>
      <div className={`text-[10px] font-medium uppercase tracking-[0.16em] ${accent ? 'text-white/80' : 'text-[var(--color-text-tertiary)]'}`}>
        {label}
      </div>
      <div className={`mt-3 font-[var(--font-serif)] text-[2rem] leading-none ${accent ? 'text-white' : 'text-[var(--color-text)]'}`}>
        {value}
      </div>
    </div>
  );
}
