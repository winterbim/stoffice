'use client';

/**
 * ReportCanvas — A4 Portrait (794 × 1123 px ≈ 210 × 297 mm @ 96 dpi)
 *
 * Rendered off-screen, captured by html2canvas → jsPDF.
 * ALL colors use explicit hex / rgba — NO Tailwind color classes (oklab breaks html2canvas).
 */

import { useMemo } from 'react';
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyLink,
} from 'd3-sankey';
import { formatCHF, formatNumber, type CalculatorResults } from '@/lib/calculator';
import { t, type Locale } from '@/lib/i18n';
import type { ReportContext } from './ReportDrawer';

/* ── Design tokens (inline-safe hex) ──────────────────────────────── */
const C = {
  bg: '#f4f1ec',
  white: '#ffffff',
  text: '#2c2926',
  textSec: '#6b6560',
  textTer: '#9e9892',
  accent: '#7d6e55',
  accentLight: '#ece7df',
  border: '#ddd8d0',
  elevated: '#eae6df',
  red: '#dc2626',
  green: '#16a34a',
  blue: '#0693e3',
  gray: '#cbd5e1',
} as const;

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

/* ── Shared inline style builders ─────────────────────────────────── */
const font = (family: string, size: number, weight = 400, lh = 1.4) =>
  ({ fontFamily: family, fontSize: size, fontWeight: weight, lineHeight: lh }) as const;

const serif = 'var(--font-serif), "DM Serif Display", Georgia, serif';
const sans = 'var(--font-sans), Inter, system-ui, sans-serif';

/* ── Sankey graph types ───────────────────────────────────────────── */
interface GNode { id: string; color: string; order: number }
interface GLink { source: string; target: string; value: number; color: string; opacity: number }

/* ── Per-module explanation texts ──────────────────────────────────── */
const moduleDescriptions: Record<string, Record<Locale, string>> = {
  zwilling: {
    de: 'Das digitale Gebäudemodell (BIM) enthält alle relevanten Bau- und Raumdaten. Im FM-Betrieb ermöglicht es eine zentrale, immer aktuelle Übersicht aller technischen Anlagen und Räume — weniger Suche, weniger Fehler.',
    fr: 'Le modèle numérique du bâtiment (BIM) centralise toutes les données de construction et d\'espace. En exploitation FM, il offre une vue centralisée et à jour de toutes les installations techniques — moins de recherche, moins d\'erreurs.',
  },
  assets: {
    de: 'Alle Anlagen, Geräte und Bauteile werden mit ihren technischen Daten, Standorten und Wartungsintervallen verknüpft. Das FM-Team kann gezielt planen statt reaktiv arbeiten.',
    fr: 'Tous les équipements, appareils et composants sont reliés à leurs données techniques, emplacements et intervalles de maintenance. L\'équipe FM peut planifier au lieu de réagir.',
  },
  doku: {
    de: 'Aktuelle Pläne, Handbücher, Prüfberichte und Garantiedokumente stehen direkt im System bereit. Kein Suchen in Ordnern, keine veralteten PDFs.',
    fr: 'Plans à jour, manuels, rapports d\'inspection et documents de garantie sont directement accessibles dans le système. Pas de recherche dans les dossiers, pas de PDF obsolètes.',
  },
  auto: {
    de: 'Wiederkehrende Aufgaben — Wartungen, Bestellungen, Prüftermine — werden automatisch ausgelöst. Das spart manuelle Koordination und verhindert vergessene Fristen.',
    fr: 'Les tâches récurrentes — maintenances, commandes, échéances — sont déclenchées automatiquement. Cela réduit la coordination manuelle et prévient les oublis.',
  },
};

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

  const hasLegal = !!(context.registrationId || context.vatId || context.legalForm);
  const hasFinancial = !!(context.iban || context.paymentTerms || context.creditLimit);
  const hasMetadata = !!(context.metadata && Object.keys(context.metadata).length > 0);

  /* ── Sankey flow data ── */
  const flowRows = useMemo(() => [
    { id: 'zwilling', label: t('digitalTwin', lang), pct: 0.75, active: activeToggles.zwilling },
    { id: 'assets', label: t('assetsLinked', lang), pct: 0.10, active: activeToggles.assets },
    { id: 'doku', label: t('docUpToDate', lang), pct: 0.05, active: activeToggles.doku },
    { id: 'auto', label: t('autoOrders', lang), pct: 0.10, active: activeToggles.auto },
  ].map((r, i) => ({
    ...r,
    order: i,
    value: Math.max(1, Math.round(results.costNow * r.pct)),
  })), [activeToggles, results.costNow, lang]);

  const totalSaved = flowRows.reduce((s, r) => s + (r.active ? r.value : 0), 0);
  const totalLost = flowRows.reduce((s, r) => s + (r.active ? 0 : r.value), 0);

  const SVG_W = 680;
  const SVG_H = 210;

  const layout = useMemo(() => {
    const nodes: GNode[] = [
      ...flowRows.map(r => ({ id: r.id, color: r.active ? C.blue : C.gray, order: r.order })),
      { id: 'handover', color: C.text, order: 10 },
      { id: 'saved', color: C.green, order: 11 },
      { id: 'lost', color: C.red, order: 12 },
    ];
    const links: GLink[] = [
      ...flowRows.map(r => ({
        source: r.id, target: 'handover', value: r.value,
        color: r.active ? C.blue : C.gray, opacity: r.active ? 0.42 : 0.18,
      })),
      { source: 'handover', target: 'saved', value: Math.max(totalSaved, 1), color: totalSaved > 0 ? C.green : C.gray, opacity: totalSaved > 0 ? 0.3 : 0.14 },
      { source: 'handover', target: 'lost', value: Math.max(totalLost, 1), color: totalLost > 0 ? C.red : C.gray, opacity: totalLost > 0 ? 0.2 : 0.14 },
    ];

    const gen = sankey<GNode, GLink>()
      .nodeId(n => n.id)
      .nodeWidth(14)
      .nodePadding(22)
      .nodeSort((a, b) => a.order - b.order)
      .extent([[20, 14], [SVG_W - 20, SVG_H - 14]]);

    return gen({ nodes: nodes.map(n => ({ ...n })), links: links.map(l => ({ ...l })) }) as SankeyGraph<GNode, GLink>;
  }, [flowRows, totalSaved, totalLost]);

  const linkPath = sankeyLinkHorizontal<GNode, GLink>();

  /* ── Node label map ── */
  const nodeLabels: Record<string, string> = {
    zwilling: flowRows[0].label,
    assets: flowRows[1].label,
    doku: flowRows[2].label,
    auto: flowRows[3].label,
    handover: lang === 'fr' ? 'Filtre FM' : 'FM-Filter',
    saved: t('reportSavedLabel', lang),
    lost: t('reportLostLabel', lang),
  };

  return (
    <div style={{ width: 794, minHeight: 1123, backgroundColor: C.white, color: C.text, ...font(sans, 12) }}>
      {/* ════════════ PAGE 1 ════════════ */}
      <div style={{ width: 794, minHeight: 1123, padding: '48px 52px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

        {/* ── Header bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 440 }}>
            <div style={{ ...font(sans, 9, 600), letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.accent }}>
              {t('reportDocumentEyebrow', lang)}
            </div>
            <div style={{ marginTop: 14, ...font(serif, 30, 400, 1.1), color: C.text }}>
              {t('reportDocumentTitle', lang)}
            </div>
            <div style={{ marginTop: 10, ...font(sans, 11.5), color: C.textSec }}>
              {t('reportExecutiveBody', lang)}
            </div>
          </div>

          <div style={{ width: 210, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            {context.logoBase64 ? (
              <div style={{
                width: '100%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: C.elevated,
              }}>
                <img src={context.logoBase64} alt={context.companyName} style={{ maxHeight: 40, maxWidth: 170, objectFit: 'contain' as const }} />
              </div>
            ) : (
              <div style={{
                width: '100%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: C.elevated,
              }}>
                <span style={{ ...font(serif, 18), color: C.text }}>{context.companyName}</span>
              </div>
            )}
            <div style={{ width: '100%', borderRadius: 14, backgroundColor: C.accent, padding: '12px 18px' }}>
              <div style={{ ...font(serif, 18), color: C.white }}>Stoffice</div>
              <div style={{ marginTop: 3, ...font(sans, 8, 500), letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.75)' }}>
                Smart Building AI
              </div>
            </div>
          </div>
        </div>

        {/* ── Client info grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 22 }}>
          <MetaCell label={t('reportPreparedFor', lang)} value={context.companyName} />
          <MetaCell label={t('reportPreparedBy', lang)} value={context.projectManager} />
          <MetaCell label={t('reportGeneratedOn', lang)} value={context.date} />
          {context.contactEmail && <MetaCell label={t('intakeEmail', lang)} value={context.contactEmail} />}
          {context.contactPhone && <MetaCell label={t('intakePhone', lang)} value={context.contactPhone} />}
          {context.contactFunction && <MetaCell label={t('intakeFunction', lang)} value={context.contactFunction} />}
          {context.address && <MetaCell label={t('intakeAddress', lang)} value={context.address} />}
          {context.tradeName && <MetaCell label={t('intakeTradeName', lang)} value={context.tradeName} />}
          {context.website && <MetaCell label={t('intakeWebsite', lang)} value={context.website} />}
          {context.contactMobile && <MetaCell label={t('intakeMobile', lang)} value={context.contactMobile} />}
          {context.sites && <MetaCell label={t('intakeSites', lang)} value={context.sites} />}
          <MetaCell label={t('optimizations', lang)} value={accentList.length > 0 ? accentList.join(', ') : '—'} />
        </div>

        {/* ── Legal / Financial ── */}
        {(hasLegal || hasFinancial) && (
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {context.legalForm && <MetaCell label={t('intakeLegalForm', lang)} value={context.legalForm} muted />}
            {context.registrationId && <MetaCell label={t('intakeRegistrationId', lang)} value={context.registrationId} muted />}
            {context.vatId && <MetaCell label={t('intakeVatId', lang)} value={context.vatId} muted />}
            {context.iban && <MetaCell label="IBAN" value={context.iban} muted />}
            {context.paymentTerms && <MetaCell label={t('intakePaymentTerms', lang)} value={context.paymentTerms} muted />}
            {context.creditLimit && <MetaCell label={t('intakeCreditLimit', lang)} value={context.creditLimit} muted />}
          </div>
        )}

        {/* ── Metadata overflow ── */}
        {hasMetadata && context.metadata && (
          <div style={{ marginTop: 18 }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.textTer, marginBottom: 8 }}>
              {t('intakeSectionMetadata', lang)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {Object.entries(context.metadata).map(([key, val]) => (
                <MetaCell key={key} label={key} value={val} muted />
              ))}
            </div>
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, marginBottom: 24 }} />

        {/* ── KPIs — 4 cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          <KpiBox label={t('reportKpiCurrent', lang)} value={formatCHF(Math.round(results.costNow))} />
          <KpiBox label={t('reportKpiSavings', lang)} value={formatCHF(Math.round(results.netSavings))} accent />
          <KpiBox label={t('roiLabel', lang)} value={`${Math.round(results.roiPct)} %`} />
          <KpiBox label={t('reportKpiHours', lang)} value={`${formatNumber(results.hoursSaved)} h`} />
        </div>

        {/* ── Pain points (if any) ── */}
        {context.painPoints && context.painPoints.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.textTer, marginBottom: 8 }}>
              {t('intakeSectionPains', lang)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {context.painPoints.map((p, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 20, backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                  ...font(sans, 10.5), color: '#991b1b',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.red, flexShrink: 0 }} />
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Project scope / notes ── */}
        {(context.projectScope || context.notes) && (
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, backgroundColor: C.elevated, border: `1px solid ${C.border}` }}>
            {context.projectScope && (
              <div>
                <span style={{ ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer }}>
                  {t('intakeScope', lang)}
                </span>
                <div style={{ marginTop: 4, ...font(sans, 11), color: C.text }}>
                  {context.projectScope}
                  {context.budget && <span style={{ color: C.textSec }}> · {context.budget}</span>}
                  {context.timeline && <span style={{ color: C.textSec }}> · {context.timeline}</span>}
                </div>
              </div>
            )}
            {context.notes && (
              <div style={{ marginTop: context.projectScope ? 12 : 0 }}>
                <span style={{ ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer }}>
                  {t('intakeNotes', lang)}
                </span>
                <div style={{ marginTop: 4, ...font(sans, 10.5), color: C.textSec, whiteSpace: 'pre-line' as const }}>
                  {context.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Recommendation + footer ── */}
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.textTer }}>
              {t('reportRecommendationTitle', lang)}
            </div>
            <div style={{ marginTop: 6, ...font(sans, 11), color: C.textSec }}>
              {t('reportRecommendationBody', lang)}
            </div>
          </div>
          <div style={{ ...font(sans, 8.5), color: C.textTer, textAlign: 'right' as const }}>
            <div>{t('footerCopy', lang)}</div>
            <div style={{ marginTop: 2 }}>stoffice.vercel.app</div>
          </div>
        </div>
      </div>

      {/* ════════════ PAGE 2 — Sankey & Flow Analysis ════════════ */}
      <div style={{ width: 794, minHeight: 1123, padding: '48px 52px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', borderTop: `3px solid ${C.accent}` }}>

        {/* Page 2 header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ ...font(sans, 9, 600), letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.accent }}>
              {t('reportPreviewLabel', lang)}
            </div>
            <div style={{ marginTop: 8, ...font(serif, 24, 400, 1.15), color: C.text }}>
              {t('reportFlowTitle', lang)}
            </div>
          </div>
          <div style={{ ...font(serif, 15), color: C.accent }}>Stoffice</div>
        </div>

        <div style={{ marginTop: 10, ...font(sans, 11), color: C.textSec }}>
          {t('reportFlowSub', lang)}
        </div>

        {/* ── Sankey SVG diagram ── */}
        <div style={{ marginTop: 22, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: C.elevated, padding: '18px 20px 14px' }}>
          {/* Column headers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer }}>
            <span>{t('reportBuildLabel', lang)}</span>
            <span>{t('reportGateLabel', lang)}</span>
            <span>{t('reportFmLabel', lang)}</span>
          </div>

          <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
            {/* Links */}
            {layout.links.map((link, i) => (
              <path
                key={`l-${i}`}
                d={linkPath(link as SankeyLink<GNode, GLink>) ?? ''}
                fill="none"
                stroke={link.color}
                strokeOpacity={link.opacity}
                strokeWidth={Math.max(link.width ?? 0, 2)}
                strokeLinecap="round"
              />
            ))}
            {/* Nodes */}
            {layout.nodes.map((node, i) => {
              const x = node.x0 ?? 0;
              const y = node.y0 ?? 0;
              const w = Math.max((node.x1 ?? 0) - x, 10);
              const h = Math.max((node.y1 ?? 0) - y, 8);
              const labelText = nodeLabels[node.id] ?? node.id;
              const isRight = node.id === 'saved' || node.id === 'lost';
              const isCenter = node.id === 'handover';
              return (
                <g key={`n-${i}`}>
                  <rect x={x} y={y} width={w} height={h} rx={4} fill={node.color} opacity={0.88} />
                  <text
                    x={isRight ? x + w + 6 : isCenter ? x + w / 2 : x - 6}
                    y={y + h / 2}
                    textAnchor={isRight ? 'start' : isCenter ? 'middle' : 'end'}
                    dominantBaseline="central"
                    style={{ ...font(sans, 9, isCenter ? 600 : 400), fill: C.text }}
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <LegendDot color={C.blue} label={t('reportActiveLegend', lang)} />
            <LegendDot color={C.gray} label={t('reportInactiveLegend', lang)} />
            <LegendDot color={C.green} label={t('reportSavedLabel', lang)} />
            <LegendDot color={C.red} label={t('reportLostLabel', lang)} />
          </div>
        </div>

        {/* ── Module explanations ── */}
        <div style={{ marginTop: 22 }}>
          <div style={{ ...font(sans, 8, 600), letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: C.textTer, marginBottom: 12 }}>
            {lang === 'fr' ? 'Détail des modules d\'optimisation' : 'Optimierungsmodule im Detail'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {flowRows.map(row => {
              const saving = row.active ? formatCHF(Math.round(row.value)) : '—';
              return (
                <div key={row.id} style={{
                  padding: '14px 16px', borderRadius: 12,
                  border: `1px solid ${row.active ? '#d9f0df' : C.border}`,
                  backgroundColor: row.active ? '#f8fcf9' : C.white,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: row.active ? C.green : C.gray,
                        flexShrink: 0,
                      }} />
                      <span style={{ ...font(sans, 11.5, 600), color: C.text }}>{row.label}</span>
                    </div>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
                      ...font(sans, 9, 500),
                      backgroundColor: row.active ? '#dcfce7' : C.elevated,
                      color: row.active ? '#166534' : C.textTer,
                    }}>
                      {row.active ? (lang === 'fr' ? 'Actif' : 'Aktiv') : (lang === 'fr' ? 'Inactif' : 'Inaktiv')}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, ...font(sans, 10), color: C.textSec, lineHeight: 1.55 }}>
                    {moduleDescriptions[row.id]?.[lang] ?? ''}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', ...font(sans, 10, 500) }}>
                    <span style={{ color: C.textTer }}>{Math.round(row.pct * 100)}% {lang === 'fr' ? 'du flux' : 'des Flusses'}</span>
                    <span style={{ color: row.active ? C.green : C.textTer }}>{saving}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Flow breakdown table ── */}
        <div style={{ marginTop: 22, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', backgroundColor: C.elevated, padding: '10px 18px', ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer }}>
            <span>{lang === 'fr' ? 'Optimisation' : 'Optimierung'}</span>
            <span style={{ textAlign: 'right' as const }}>{lang === 'fr' ? 'Économie' : 'Einsparung'}</span>
            <span style={{ textAlign: 'right' as const }}>{lang === 'fr' ? 'Statut' : 'Status'}</span>
          </div>
          {flowRows.map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 120px', padding: '10px 18px',
              borderTop: `1px solid ${C.border}`, ...font(sans, 10.5), color: C.text,
              backgroundColor: row.active ? C.white : '#fafaf8',
            }}>
              <span style={{ fontWeight: row.active ? 500 : 400, color: row.active ? C.text : C.textTer }}>
                {row.label}
              </span>
              <span style={{ textAlign: 'right' as const, fontWeight: 500, color: row.active ? C.green : C.textTer }}>
                {row.active ? formatCHF(Math.round(row.value)) : '—'}
              </span>
              <span style={{ textAlign: 'right' as const }}>
                <span style={{
                  display: 'inline-block', padding: '2px 10px', borderRadius: 12,
                  ...font(sans, 8.5, 500),
                  backgroundColor: row.active ? '#dcfce7' : C.elevated,
                  color: row.active ? '#166534' : C.textTer,
                }}>
                  {row.active ? (lang === 'fr' ? 'Actif' : 'Aktiv') : (lang === 'fr' ? 'Inactif' : 'Inaktiv')}
                </span>
              </span>
            </div>
          ))}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 120px', padding: '11px 18px',
            borderTop: `2px solid ${C.accent}`, backgroundColor: C.elevated,
            ...font(sans, 11, 600), color: C.text,
          }}>
            <span>Total</span>
            <span style={{ textAlign: 'right' as const, color: C.accent }}>{formatCHF(Math.round(results.netSavings))}</span>
            <span style={{ textAlign: 'right' as const, color: C.accent }}>ROI {Math.round(results.roiPct)} %</span>
          </div>
        </div>

        {/* ── Summary cards: saved / lost ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
          <div style={{ borderRadius: 14, border: '1px solid #d9f0df', backgroundColor: '#f4fbf6', padding: '16px 18px' }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#15803d' }}>
              {t('reportSavedLabel', lang)}
            </div>
            <div style={{ marginTop: 8, ...font(serif, 26, 400, 1), color: '#166534' }}>
              {formatCHF(Math.round(results.netSavings))}
            </div>
            <div style={{ marginTop: 6, ...font(sans, 10), color: 'rgba(22,101,52,0.8)' }}>
              {lang === 'fr'
                ? 'Informations utilisables immédiatement dans l\'exploitation et la maintenance.'
                : 'Informationen, die im Betrieb und in der Wartung direkt nutzbar sind.'}
            </div>
          </div>
          <div style={{ borderRadius: 14, border: '1px solid #f3d8d8', backgroundColor: '#fff7f7', padding: '16px 18px' }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#b91c1c' }}>
              {t('reportLostLabel', lang)}
            </div>
            <div style={{ marginTop: 8, ...font(serif, 26, 400, 1), color: '#991b1b' }}>
              {formatCHF(Math.round(results.costNow - results.netSavings))}
            </div>
            <div style={{ marginTop: 6, ...font(sans, 10), color: 'rgba(153,27,27,0.8)' }}>
              {lang === 'fr'
                ? 'Éléments absents ou incomplets qui génèrent recherche, ressaisie et tickets évitables.'
                : 'Fehlende oder unvollständige Übergaben, die Suche, Nacharbeit und vermeidbare Tickets erzeugen.'}
            </div>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div style={{ marginTop: 18, padding: '12px 16px', borderRadius: 12, backgroundColor: C.elevated, border: `1px solid ${C.border}` }}>
          <div style={{ ...font(sans, 10), color: C.textSec }}>{t('reportNote', lang)}</div>
        </div>

        {/* ── Page 2 footer ── */}
        <div style={{
          marginTop: 'auto', paddingTop: 20, display: 'flex', justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`, ...font(sans, 8.5), color: C.textTer,
        }}>
          <span>{t('footerCopy', lang)}</span>
          <span>stoffice.vercel.app · {context.date}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Helper components — ALL inline styles, zero Tailwind color classes
   ══════════════════════════════════════════════════════════════════════ */

function MetaCell({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 10,
      backgroundColor: muted ? C.elevated : C.white,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontFamily: sans, fontSize: 8, fontWeight: 600, lineHeight: 1.3,
        letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer,
      }}>
        {label}
      </div>
      <div style={{
        marginTop: 4, fontFamily: sans, fontSize: 11, fontWeight: 400, lineHeight: 1.4,
        color: muted ? C.textSec : C.text,
      }}>
        {value}
      </div>
    </div>
  );
}

function KpiBox({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      backgroundColor: accent ? C.accent : C.elevated,
      border: accent ? 'none' : `1px solid ${C.border}`,
    }}>
      <div style={{
        fontFamily: sans, fontSize: 8, fontWeight: 600, lineHeight: 1.3,
        letterSpacing: '0.14em', textTransform: 'uppercase' as const,
        color: accent ? 'rgba(255,255,255,0.8)' : C.textTer,
      }}>
        {label}
      </div>
      <div style={{
        marginTop: 8, fontFamily: serif, fontSize: 22, fontWeight: 400, lineHeight: 1,
        color: accent ? C.white : C.text,
      }}>
        {value}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{ ...font(sans, 8.5), color: C.textSec }}>{label}</span>
    </div>
  );
}
