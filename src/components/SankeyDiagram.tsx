'use client';

import { useMemo } from 'react';
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyLink,
} from 'd3-sankey';
import { formatCHF } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';

interface SankeyProps {
  lang: Locale;
  activeToggles: { zwilling: boolean; assets: boolean; doku: boolean; auto: boolean };
  costNow: number;
  variant?: 'screen' | 'export';
}

interface GraphNode {
  id: string;
  color: string;
  order: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
  color: string;
  opacity: number;
}

const ACCENT = '#0693e3';
const GREEN = '#16a34a';
const RED = '#dc2626';
const GRAY = '#cbd5e1';
const TEXT = '#1a2b3c';

export default function SankeyDiagram({
  lang,
  activeToggles,
  costNow,
  variant = 'screen',
}: SankeyProps) {
  const flowRows = useMemo(
    () => [
      { id: 'zwilling', label: t('digitalTwin', lang), pct: 0.75, active: activeToggles.zwilling },
      { id: 'assets', label: t('assetsLinked', lang), pct: 0.1, active: activeToggles.assets },
      { id: 'doku', label: t('docUpToDate', lang), pct: 0.05, active: activeToggles.doku },
      { id: 'auto', label: t('autoOrders', lang), pct: 0.1, active: activeToggles.auto },
    ].map((row, index) => ({
      ...row,
      order: index,
      value: Math.max(1, Math.round(costNow * row.pct)),
      statusLabel: row.active ? t('statusAccepted', lang) : t('statusMissing', lang),
    })),
    [activeToggles.assets, activeToggles.auto, activeToggles.doku, activeToggles.zwilling, costNow, lang]
  );

  const totalSaved = flowRows.reduce((sum, row) => sum + (row.active ? row.value : 0), 0);
  const totalLost = flowRows.reduce((sum, row) => sum + (row.active ? 0 : row.value), 0);

  const svgWidth = variant === 'export' ? 760 : 720;
  const svgHeight = variant === 'export' ? 240 : 220;

  const layout = useMemo(() => {
    const nodes: GraphNode[] = [
      ...flowRows.map((row) => ({
        id: row.id,
        color: row.active ? ACCENT : GRAY,
        order: row.order,
      })),
      { id: 'handover', color: TEXT, order: 10 },
      { id: 'saved', color: GREEN, order: 11 },
      { id: 'lost', color: RED, order: 12 },
    ];

    const links: GraphLink[] = [
      ...flowRows.map((row) => ({
        source: row.id,
        target: 'handover',
        value: row.value,
        color: row.active ? ACCENT : GRAY,
        opacity: row.active ? 0.42 : 0.18,
      })),
      {
        source: 'handover',
        target: 'saved',
        value: Math.max(totalSaved, 1),
        color: totalSaved > 0 ? GREEN : GRAY,
        opacity: totalSaved > 0 ? 0.3 : 0.14,
      },
      {
        source: 'handover',
        target: 'lost',
        value: Math.max(totalLost, 1),
        color: totalLost > 0 ? RED : GRAY,
        opacity: totalLost > 0 ? 0.2 : 0.14,
      },
    ];

    const generator = sankey<GraphNode, GraphLink>()
      .nodeId((node) => node.id)
      .nodeWidth(16)
      .nodePadding(24)
      .nodeSort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .extent([
        [24, 18],
        [svgWidth - 24, svgHeight - 18],
      ]);

    return generator({
      nodes: nodes.map((node) => ({ ...node })),
      links: links.map((link) => ({ ...link })),
    }) as SankeyGraph<GraphNode, GraphLink>;
  }, [flowRows, svgHeight, svgWidth, totalLost, totalSaved]);

  const linkPath = sankeyLinkHorizontal<GraphNode, GraphLink>();

  return (
    <section className="rounded-[32px] border border-[var(--color-border)] p-6 sm:p-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="border-b border-[var(--color-border)] pb-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
          {t('reportPreviewLabel', lang)}
        </div>
        <h3 className="mt-4 font-[var(--font-serif)] text-[clamp(1.9rem,3vw,2.6rem)] leading-tight text-[var(--color-text)]">
          {t('reportFlowTitle', lang)}
        </h3>
        <p className="mt-4 max-w-[780px] text-[15px] leading-7 text-[var(--color-text-secondary)]">
          {t('reportFlowSub', lang)}
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
            {t('reportBuildLabel', lang)}
          </div>

          {flowRows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[15px] font-medium leading-6 text-[var(--color-text)]">
                    {row.label}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        row.active
                          ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                          : 'text-[var(--color-text-tertiary)]'
                      }`}
                      style={!row.active ? { backgroundColor: '#ffffff' } : undefined}
                    >
                      {row.statusLabel}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">
                      {Math.round(row.pct * 100)}%
                    </span>
                  </div>
                </div>
                <div className={`shrink-0 text-right font-[var(--font-serif)] text-[1.25rem] leading-none ${row.active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {formatCHF(row.value)}
                </div>
              </div>
            </div>
          ))}
        </aside>

        <div className="min-w-0 space-y-5">
          <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
            <div className="mb-5 grid grid-cols-3 gap-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">
              <span>{t('reportBuildLabel', lang)}</span>
              <span className="text-center">{t('reportGateLabel', lang)}</span>
              <span className="text-right">{t('reportFmLabel', lang)}</span>
            </div>

            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="h-auto w-full"
              role="img"
              aria-label={t('reportFlowTitle', lang)}
            >
              {layout.links.map((link, index) => (
                <path
                  key={`link-${index}`}
                  d={linkPath(link as SankeyLink<GraphNode, GraphLink>) ?? ''}
                  fill="none"
                  stroke={link.color}
                  strokeOpacity={link.opacity}
                  strokeWidth={Math.max(link.width ?? 0, 2)}
                  strokeLinecap="round"
                />
              ))}

              {layout.nodes.map((node, index) => (
                <rect
                  key={`node-${index}`}
                  x={node.x0}
                  y={node.y0}
                  width={Math.max((node.x1 ?? 0) - (node.x0 ?? 0), 10)}
                  height={Math.max((node.y1 ?? 0) - (node.y0 ?? 0), 8)}
                  rx={4}
                  fill={node.color}
                  opacity={node.id === 'handover' ? 0.95 : 0.84}
                />
              ))}
            </svg>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#d9f0df] bg-[#f4fbf6] p-5">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#15803d]">
                {t('reportSavedLabel', lang)}
              </div>
              <div className="mt-3 font-[var(--font-serif)] text-[2.4rem] leading-none text-[#166534]">
                {formatCHF(totalSaved)}
              </div>
              <p className="mt-3 text-sm leading-6" style={{ color: 'rgba(22,101,52,0.8)' }}>
                {lang === 'fr'
                  ? 'Informations utilisables immédiatement dans l’exploitation et la maintenance.'
                  : 'Informationen, die im Betrieb und in der Wartung direkt nutzbar sind.'}
              </p>
            </div>

            <div className="rounded-[24px] border border-[#f3d8d8] bg-[#fff7f7] p-5">
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#b91c1c]">
                {t('reportLostLabel', lang)}
              </div>
              <div className="mt-3 font-[var(--font-serif)] text-[2.4rem] leading-none text-[#991b1b]">
                {formatCHF(totalLost)}
              </div>
              <p className="mt-3 text-sm leading-6" style={{ color: 'rgba(153,27,27,0.8)' }}>
                {lang === 'fr'
                  ? 'Éléments absents ou incomplets qui génèrent recherche, ressaisie et tickets évitables.'
                  : 'Fehlende oder unvollständige Übergaben, die Suche, Nacharbeit und vermeidbare Tickets erzeugen.'}
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] px-5 py-4" style={{ backgroundColor: '#ffffff' }}>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {t('reportNote', lang)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
            <LegendSwatch color={ACCENT} label={t('reportActiveLegend', lang)} active />
            <LegendSwatch color={GRAY} label={t('reportInactiveLegend', lang)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LegendSwatch({
  color,
  label,
  active = false,
}: {
  color: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${active ? 'bg-[var(--color-accent-light)] text-[var(--color-text)]' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'}`}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
