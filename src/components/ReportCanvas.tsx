'use client';

/**
 * ReportCanvas — A4 Portrait (794 × 1123 px per page ≈ 210 × 297 mm @ 96 dpi)
 *
 * 3-page layout captured by html2canvas → jsPDF multi-page slicing.
 * ALL colors = explicit hex / rgba (NO Tailwind color classes — oklab breaks html2canvas).
 *
 * Page 1 → Client overview + KPIs
 * Page 2 → Sankey diagram + module explanations
 * Page 3 → Breakdown table + summary cards + disclaimer
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

/* ── Design tokens ────────────────────────────────────────────────── */
const C = {
  bg:         '#f4f1ec',
  white:      '#ffffff',
  text:       '#2c2926',
  textSec:    '#6b6560',
  textTer:    '#9e9892',
  accent:     '#7d6e55',
  accentLight:'#ece7df',
  border:     '#ddd8d0',
  elevated:   '#eae6df',
  red:        '#dc2626',
  green:      '#16a34a',
  blue:       '#0693e3',
  gray:       '#cbd5e1',
} as const;

/* ── Inline style helpers ─────────────────────────────────────────── */
const font = (fam: string, sz: number, wt = 400, lh = 1.4) =>
  ({ fontFamily: fam, fontSize: sz, fontWeight: wt, lineHeight: lh }) as const;

const serif = 'var(--font-serif), "DM Serif Display", Georgia, serif';
const sans  = 'var(--font-sans), Inter, system-ui, sans-serif';

/* ── Page shell (794 × 1123) ──────────────────────────────────────── */
const PAGE: React.CSSProperties = {
  width: 794, height: 1123, padding: '44px 48px 36px',
  display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
  backgroundColor: C.white, overflow: 'hidden',
};

/* ── Sankey types ─────────────────────────────────────────────────── */
interface GNode { id: string; color: string; order: number }
interface GLink { source: string; target: string; value: number; color: string; opacity: number }

/* ── Module descriptions (DE / FR) ────────────────────────────────── */
const DESC: Record<string, Record<Locale, string>> = {
  zwilling: {
    de: 'Das digitale Gebäudemodell (BIM) enthält alle relevanten Bau- und Raumdaten. Im FM-Betrieb ermöglicht es eine zentrale, immer aktuelle Übersicht aller technischen Anlagen und Räume — weniger Suche, weniger Fehler.',
    fr: 'Le modèle numérique du bâtiment (BIM) centralise toutes les données de construction et d\'espace. En exploitation FM, il offre une vue centralisée et à jour — moins de recherche, moins d\'erreurs.',
  },
  assets: {
    de: 'Alle Anlagen, Geräte und Bauteile werden mit ihren technischen Daten, Standorten und Wartungsintervallen verknüpft. Das FM-Team kann gezielt planen statt reaktiv arbeiten.',
    fr: 'Tous les équipements sont reliés à leurs données techniques, emplacements et intervalles de maintenance. L\'équipe FM peut planifier au lieu de réagir.',
  },
  doku: {
    de: 'Aktuelle Pläne, Handbücher, Prüfberichte und Garantiedokumente stehen direkt im System bereit. Kein Suchen in Ordnern, keine veralteten PDFs.',
    fr: 'Plans à jour, manuels, rapports d\'inspection et garanties sont directement accessibles. Pas de recherche dans les dossiers, pas de PDF obsolètes.',
  },
  auto: {
    de: 'Wiederkehrende Aufgaben — Wartungen, Bestellungen, Prüftermine — werden automatisch ausgelöst. Das spart manuelle Koordination und verhindert vergessene Fristen.',
    fr: 'Les tâches récurrentes — maintenances, commandes, échéances — sont déclenchées automatiquement. Moins de coordination manuelle, aucun oubli.',
  },
};

/* ══════════════════════════════════════════════════════════════════════ */

interface Props {
  lang: Locale;
  context: ReportContext;
  results: CalculatorResults;
  activeToggles: { zwilling: boolean; assets: boolean; doku: boolean; auto: boolean };
}

export default function ReportCanvas({ lang, context, results, activeToggles }: Props) {

  /* ── Derived data ── */
  const accentList = [
    activeToggles.zwilling && t('digitalTwin', lang),
    activeToggles.assets && t('assetsLinked', lang),
    activeToggles.doku && t('docUpToDate', lang),
    activeToggles.auto && t('autoOrders', lang),
  ].filter(Boolean) as string[];

  const hasLegal     = !!(context.registrationId || context.vatId || context.legalForm);
  const hasFinancial = !!(context.iban || context.paymentTerms || context.creditLimit);
  const hasMetadata  = !!(context.metadata && Object.keys(context.metadata).length > 0);

  /* ── Flow rows ── */
  const flowRows = useMemo(() => [
    { id: 'zwilling', label: t('digitalTwin', lang), pct: 0.75, active: activeToggles.zwilling },
    { id: 'assets',   label: t('assetsLinked', lang), pct: 0.1,  active: activeToggles.assets },
    { id: 'doku',     label: t('docUpToDate', lang),  pct: 0.05, active: activeToggles.doku },
    { id: 'auto',     label: t('autoOrders', lang),   pct: 0.1,  active: activeToggles.auto },
  ].map((r, i) => ({ ...r, order: i, value: Math.max(1, Math.round(results.costNow * r.pct)) })),
  [activeToggles, results.costNow, lang]);

  const totalSaved = flowRows.reduce((s, r) => s + (r.active ? r.value : 0), 0);
  const totalLost  = flowRows.reduce((s, r) => s + (r.active ? 0 : r.value), 0);

  /* ── Sankey layout ── */
  const SVG_W = 690;
  const SVG_H = 220;
  const PAD_L = 140;  // room for left labels
  const PAD_R = 120;  // room for right labels

  const layout = useMemo(() => {
    const nodes: GNode[] = [
      ...flowRows.map(r => ({ id: r.id, color: r.active ? C.blue : C.gray, order: r.order })),
      { id: 'handover', color: C.text, order: 10 },
      { id: 'saved',    color: C.green, order: 11 },
      { id: 'lost',     color: C.red,   order: 12 },
    ];
    const links: GLink[] = [
      ...flowRows.map(r => ({
        source: r.id, target: 'handover', value: r.value,
        color: r.active ? C.blue : C.gray, opacity: r.active ? 0.42 : 0.18,
      })),
      { source: 'handover', target: 'saved', value: Math.max(totalSaved, 1), color: totalSaved > 0 ? C.green : C.gray, opacity: totalSaved > 0 ? 0.3 : 0.14 },
      { source: 'handover', target: 'lost',  value: Math.max(totalLost, 1),  color: totalLost  > 0 ? C.red   : C.gray, opacity: totalLost  > 0 ? 0.2 : 0.14 },
    ];
    const gen = sankey<GNode, GLink>()
      .nodeId(n => n.id).nodeWidth(14).nodePadding(22)
      .nodeSort((a, b) => a.order - b.order)
      .extent([[PAD_L, 16], [SVG_W - PAD_R, SVG_H - 16]]);
    return gen({ nodes: nodes.map(n => ({ ...n })), links: links.map(l => ({ ...l })) }) as SankeyGraph<GNode, GLink>;
  }, [flowRows, totalSaved, totalLost]);

  const linkPath = sankeyLinkHorizontal<GNode, GLink>();

  const nodeLabels: Record<string, string> = {
    zwilling: flowRows[0].label,
    assets:   flowRows[1].label,
    doku:     flowRows[2].label,
    auto:     flowRows[3].label,
    handover: lang === 'fr' ? 'Filtre FM' : 'FM-Filter',
    saved:    t('reportSavedLabel', lang),
    lost:     t('reportLostLabel', lang),
  };

  /* ── Inline helpers ── */
  const eyebrow = (text: string) => (
    <div style={{ ...font(sans, 8, 600), letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: C.textTer }}>
      {text}
    </div>
  );

  const pageFooter = (
    <div style={{
      marginTop: 'auto', paddingTop: 16,
      display: 'flex', justifyContent: 'space-between',
      borderTop: `1px solid ${C.border}`, ...font(sans, 8), color: C.textTer,
    }}>
      <span>{t('footerCopy', lang)}</span>
      <span>stoffice.vercel.app · {context.date}</span>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════ */

  return (
    <div style={{ width: 794, backgroundColor: C.white, color: C.text, ...font(sans, 11) }}>

      {/* ══════════ PAGE 1 — Overview ══════════ */}
      <div style={PAGE}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 430 }}>
            <div style={{ ...font(sans, 9, 600), letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.accent }}>
              {t('reportDocumentEyebrow', lang)}
            </div>
            <div style={{ marginTop: 12, ...font(serif, 28, 400, 1.1), color: C.text }}>
              {t('reportDocumentTitle', lang)}
            </div>
            <div style={{ marginTop: 10, ...font(sans, 11), color: C.textSec }}>
              {t('reportExecutiveBody', lang)}
            </div>
          </div>
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              width: '100%', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12, border: `1px solid ${C.border}`, backgroundColor: C.elevated,
            }}>
              {context.logoBase64
                ? <img src={context.logoBase64} alt={context.companyName} style={{ maxHeight: 36, maxWidth: 160, objectFit: 'contain' as const }} />
                : <span style={{ ...font(serif, 16), color: C.text }}>{context.companyName}</span>
              }
            </div>
            <div style={{ width: '100%', borderRadius: 12, backgroundColor: C.accent, padding: '10px 16px' }}>
              <div style={{ ...font(serif, 16), color: C.white }}>Stoffice</div>
              <div style={{ marginTop: 2, ...font(sans, 7.5, 500), letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)' }}>
                Smart Building AI
              </div>
            </div>
          </div>
        </div>

        {/* Client info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginTop: 18 }}>
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

        {/* Legal / Financial */}
        {(hasLegal || hasFinancial) && (
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {context.legalForm && <MetaCell label={t('intakeLegalForm', lang)} value={context.legalForm} muted />}
            {context.registrationId && <MetaCell label={t('intakeRegistrationId', lang)} value={context.registrationId} muted />}
            {context.vatId && <MetaCell label={t('intakeVatId', lang)} value={context.vatId} muted />}
            {context.iban && <MetaCell label="IBAN" value={context.iban} muted />}
            {context.paymentTerms && <MetaCell label={t('intakePaymentTerms', lang)} value={context.paymentTerms} muted />}
            {context.creditLimit && <MetaCell label={t('intakeCreditLimit', lang)} value={context.creditLimit} muted />}
          </div>
        )}

        {/* Metadata */}
        {hasMetadata && context.metadata && (
          <div style={{ marginTop: 14 }}>
            {eyebrow(t('intakeSectionMetadata', lang))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginTop: 6 }}>
              {Object.entries(context.metadata).map(([k, v]) => <MetaCell key={k} label={k} value={v} muted />)}
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, marginBottom: 20 }} />

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 9 }}>
          <KpiBox label={t('reportKpiCurrent', lang)} value={formatCHF(Math.round(results.costNow))} />
          <KpiBox label={t('reportKpiSavings', lang)} value={formatCHF(Math.round(results.netSavings))} accent />
          <KpiBox label={t('roiLabel', lang)} value={`${Math.round(results.roiPct)} %`} />
          <KpiBox label={t('reportKpiHours', lang)} value={`${formatNumber(results.hoursSaved)} h`} />
        </div>

        {/* Pain points */}
        {context.painPoints && context.painPoints.length > 0 && (
          <div style={{ marginTop: 18 }}>
            {eyebrow(t('intakeSectionPains', lang))}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginTop: 6 }}>
              {context.painPoints.map((p) => (
                <span key={`pain-${p}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 18, backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                  ...font(sans, 10), color: '#991b1b',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: C.red, flexShrink: 0 }} />
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scope / Notes */}
        {(context.projectScope || context.notes) && (
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, backgroundColor: C.elevated, border: `1px solid ${C.border}` }}>
            {context.projectScope && (
              <div>
                {eyebrow(t('intakeScope', lang))}
                <div style={{ marginTop: 3, ...font(sans, 10.5), color: C.text }}>
                  {context.projectScope}
                  {context.budget && <span style={{ color: C.textSec }}> · {context.budget}</span>}
                  {context.timeline && <span style={{ color: C.textSec }}> · {context.timeline}</span>}
                </div>
              </div>
            )}
            {context.notes && (
              <div style={{ marginTop: context.projectScope ? 10 : 0 }}>
                {eyebrow(t('intakeNotes', lang))}
                <div style={{ marginTop: 3, ...font(sans, 10), color: C.textSec, whiteSpace: 'pre-line' as const }}>
                  {context.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendation */}
        <div style={{
          marginTop: 'auto', paddingTop: 18,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 480 }}>
            {eyebrow(t('reportRecommendationTitle', lang))}
            <div style={{ marginTop: 4, ...font(sans, 10.5), color: C.textSec }}>
              {t('reportRecommendationBody', lang)}
            </div>
          </div>
          <div style={{ ...font(sans, 8), color: C.textTer, textAlign: 'right' as const }}>
            <div>{t('footerCopy', lang)}</div>
            <div style={{ marginTop: 2 }}>stoffice.vercel.app</div>
          </div>
        </div>
      </div>

      {/* ══════════ PAGE 2 — Sankey + Module Explanations ══════════ */}
      <div style={{ ...PAGE, borderTop: `3px solid ${C.accent}` }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ ...font(sans, 9, 600), letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.accent }}>
              {t('reportPreviewLabel', lang)}
            </div>
            <div style={{ marginTop: 6, ...font(serif, 22, 400, 1.15), color: C.text }}>
              {t('reportFlowTitle', lang)}
            </div>
          </div>
          <div style={{ ...font(serif, 14), color: C.accent }}>Stoffice</div>
        </div>

        <div style={{ marginTop: 8, ...font(sans, 10.5), color: C.textSec }}>
          {t('reportFlowSub', lang)}
        </div>

        {/* ── Sankey SVG ── */}
        <div style={{
          marginTop: 18, borderRadius: 12, border: `1px solid ${C.border}`,
          backgroundColor: C.elevated, padding: '16px 12px 12px',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 8, paddingRight: 8,
            ...font(sans, 7.5, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer,
          }}>
            <span>{t('reportBuildLabel', lang)}</span>
            <span>{t('reportGateLabel', lang)}</span>
            <span>{t('reportFmLabel', lang)}</span>
          </div>

          <svg
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
          >
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
            {layout.nodes.map((node, i) => {
              const x = node.x0 ?? 0;
              const y = node.y0 ?? 0;
              const w = Math.max((node.x1 ?? 0) - x, 10);
              const h = Math.max((node.y1 ?? 0) - y, 8);
              const lbl = nodeLabels[node.id] ?? node.id;
              const isLeft   = !['handover','saved','lost'].includes(node.id);
              const isCenter = node.id === 'handover';
              return (
                <g key={`n-${i}`}>
                  <rect x={x} y={y} width={w} height={h} rx={4} fill={node.color} opacity={0.88} />
                  <text
                    x={isLeft ? x - 8 : isCenter ? x + w / 2 : x + w + 8}
                    y={y + h / 2}
                    textAnchor={isLeft ? 'end' : isCenter ? 'middle' : 'start'}
                    dominantBaseline="central"
                    style={{ ...font(sans, isCenter ? 9 : 8.5, isCenter ? 600 : 500), fill: C.text }}
                  >
                    {lbl}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, marginTop: 8, paddingLeft: 4 }}>
            <Dot color={C.blue} label={t('reportActiveLegend', lang)} />
            <Dot color={C.gray} label={t('reportInactiveLegend', lang)} />
            <Dot color={C.green} label={t('reportSavedLabel', lang)} />
            <Dot color={C.red} label={t('reportLostLabel', lang)} />
          </div>
        </div>

        {/* ── Module explanation cards (2 × 2) ── */}
        <div style={{ marginTop: 24 }}>
          {eyebrow(lang === 'fr' ? 'DÉTAIL DES MODULES D\'OPTIMISATION' : 'OPTIMIERUNGSMODULE IM DETAIL')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {flowRows.map(row => {
              const saving = row.active ? formatCHF(Math.round(row.value)) : '—';
              const statusLabel = row.active
                ? (lang === 'fr' ? 'Actif'   : 'Aktiv')
                : (lang === 'fr' ? 'Inactif' : 'Inaktiv');
              return (
                <div key={row.id} style={{
                  padding: '14px 16px', borderRadius: 12,
                  border: `1px solid ${row.active ? '#c6e7ce' : C.border}`,
                  backgroundColor: row.active ? '#f8fcf9' : C.white,
                }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: row.active ? C.green : C.gray, flexShrink: 0 }} />
                      <span style={{ ...font(sans, 11, 600), color: C.text }}>{row.label}</span>
                    </div>
                    <span style={{
                      padding: '2px 9px', borderRadius: 10, ...font(sans, 8, 500),
                      backgroundColor: row.active ? '#dcfce7' : C.elevated,
                      color: row.active ? '#166534' : C.textTer,
                    }}>
                      {statusLabel}
                    </span>
                  </div>
                  {/* Description */}
                  <div style={{ ...font(sans, 9.5), color: C.textSec, lineHeight: 1.55 }}>
                    {DESC[row.id]?.[lang] ?? ''}
                  </div>
                  {/* Footer row */}
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', ...font(sans, 9.5, 500) }}>
                    <span style={{ color: C.textTer }}>{Math.round(row.pct * 100)} % {lang === 'fr' ? 'du flux' : 'des Flusses'}</span>
                    <span style={{ color: row.active ? C.green : C.textTer }}>{saving}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Summary cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
          <SummaryCard
            eyebrow={t('reportSavedLabel', lang)}
            value={formatCHF(Math.round(totalSaved))}
            description={lang === 'fr'
              ? 'Informations utilisables immédiatement dans l\'exploitation et la maintenance.'
              : 'Informationen, die im Betrieb und in der Wartung direkt nutzbar sind.'}
            variant="green"
          />
          <SummaryCard
            eyebrow={t('reportLostLabel', lang)}
            value={formatCHF(Math.round(totalLost))}
            description={lang === 'fr'
              ? 'Éléments absents ou incomplets qui génèrent recherche et tickets évitables.'
              : 'Fehlende oder unvollständige Übergaben, die Suche und vermeidbare Tickets erzeugen.'}
            variant="red"
          />
        </div>

        {pageFooter}
      </div>

      {/* ══════════ PAGE 3 — Breakdown Table + Closing ══════════ */}
      <div style={{ ...PAGE, borderTop: `3px solid ${C.accent}` }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ ...font(sans, 9, 600), letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.accent }}>
              {lang === 'fr' ? 'SYNTHÈSE FINANCIÈRE' : 'FINANZÜBERSICHT'}
            </div>
            <div style={{ marginTop: 6, ...font(serif, 22, 400, 1.15), color: C.text }}>
              {lang === 'fr' ? 'Répartition des optimisations' : 'Aufschlüsselung der Optimierungen'}
            </div>
          </div>
          <div style={{ ...font(serif, 14), color: C.accent }}>Stoffice</div>
        </div>

        <div style={{ marginTop: 8, ...font(sans, 10.5), color: C.textSec }}>
          {lang === 'fr'
            ? 'Vue détaillée de chaque module d\'optimisation avec leur contribution financière respective.'
            : 'Detaillierte Übersicht jedes Optimierungsmoduls mit dem jeweiligen finanziellen Beitrag.'}
        </div>

        {/* Breakdown table */}
        <div style={{ marginTop: 20, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 100px', backgroundColor: C.elevated, padding: '10px 18px',
            ...font(sans, 7.5, 600), letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.textTer,
          }}>
            <span>{lang === 'fr' ? 'Module' : 'Modul'}</span>
            <span style={{ textAlign: 'right' as const }}>{lang === 'fr' ? 'Économie annuelle' : 'Jährl. Einsparung'}</span>
            <span style={{ textAlign: 'right' as const }}>Status</span>
          </div>
          {/* Rows */}
          {flowRows.map(row => {
            const statusLabel = row.active
              ? (lang === 'fr' ? 'Actif'   : 'Aktiv')
              : (lang === 'fr' ? 'Inactif' : 'Inaktiv');
            return (
              <div key={`tbl-${row.id}`} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 100px', padding: '11px 18px',
                borderTop: `1px solid ${C.border}`, ...font(sans, 10.5),
                backgroundColor: row.active ? C.white : '#fafaf8',
              }}>
                <div>
                  <span style={{ fontWeight: 500, color: row.active ? C.text : C.textTer }}>{row.label}</span>
                  <span style={{ marginLeft: 8, ...font(sans, 9), color: C.textTer }}>({Math.round(row.pct * 100)} %)</span>
                </div>
                <span style={{ textAlign: 'right' as const, fontWeight: 500, color: row.active ? C.green : C.textTer }}>
                  {row.active ? formatCHF(Math.round(row.value)) : '—'}
                </span>
                <span style={{ textAlign: 'right' as const }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', borderRadius: 10,
                    ...font(sans, 8, 500),
                    backgroundColor: row.active ? '#dcfce7' : C.elevated,
                    color: row.active ? '#166534' : C.textTer,
                  }}>
                    {statusLabel}
                  </span>
                </span>
              </div>
            );
          })}
          {/* Totals */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 100px', padding: '12px 18px',
            borderTop: `2px solid ${C.accent}`, backgroundColor: C.elevated,
            ...font(sans, 11, 700), color: C.text,
          }}>
            <span>Total</span>
            <span style={{ textAlign: 'right' as const, color: C.accent }}>{formatCHF(Math.round(results.netSavings))}</span>
            <span style={{ textAlign: 'right' as const, color: C.accent }}>ROI {Math.round(results.roiPct)} %</span>
          </div>
        </div>

        {/* Large KPI highlight */}
        <div style={{
          marginTop: 28, padding: '28px 32px', borderRadius: 16,
          backgroundColor: C.accent, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)' }}>
              {lang === 'fr' ? 'Économie nette annuelle' : 'Jährliche Nettoeinsparung'}
            </div>
            <div style={{ marginTop: 8, ...font(serif, 36, 400, 1), color: C.white }}>
              {formatCHF(Math.round(results.netSavings))}
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ ...font(sans, 8, 600), letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)' }}>
              {lang === 'fr' ? 'Retour sur investissement' : 'Return on Investment'}
            </div>
            <div style={{ marginTop: 8, ...font(serif, 36, 400, 1), color: C.white }}>
              {Math.round(results.roiPct)} %
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
          <SummaryCard
            eyebrow={t('reportSavedLabel', lang)}
            value={formatCHF(Math.round(totalSaved))}
            description={lang === 'fr'
              ? 'Données transférables directement dans le système FM.'
              : 'Daten, die direkt ins FM-System übertragen werden können.'}
            variant="green"
          />
          <SummaryCard
            eyebrow={t('reportLostLabel', lang)}
            value={formatCHF(Math.round(totalLost))}
            description={lang === 'fr'
              ? 'Données manquantes à compléter avant le Go-live.'
              : 'Fehlende Daten, die vor dem Go-live nachzuliefern sind.'}
            variant="red"
          />
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, backgroundColor: C.elevated, border: `1px solid ${C.border}` }}>
          <div style={{ ...font(sans, 9.5), color: C.textSec }}>{t('reportNote', lang)}</div>
        </div>

        {pageFooter}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Sub-components — ALL inline styles
   ══════════════════════════════════════════════════════════════════════ */

function MetaCell({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ padding: '7px 11px', borderRadius: 8, backgroundColor: muted ? C.elevated : C.white, border: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: sans, fontSize: 7.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: C.textTer }}>
        {label}
      </div>
      <div style={{ marginTop: 3, fontFamily: sans, fontSize: 10.5, fontWeight: 400, lineHeight: 1.4, color: muted ? C.textSec : C.text }}>
        {value}
      </div>
    </div>
  );
}

function KpiBox({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 12,
      backgroundColor: accent ? C.accent : C.elevated,
      border: accent ? 'none' : `1px solid ${C.border}`,
    }}>
      <div style={{ fontFamily: sans, fontSize: 7.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: accent ? 'rgba(255,255,255,0.75)' : C.textTer }}>
        {label}
      </div>
      <div style={{ marginTop: 6, fontFamily: serif, fontSize: 20, fontWeight: 400, lineHeight: 1, color: accent ? C.white : C.text }}>
        {value}
      </div>
    </div>
  );
}

function SummaryCard({ eyebrow, value, description, variant }: {
  eyebrow: string; value: string; description: string; variant: 'green' | 'red';
}) {
  const isGreen = variant === 'green';
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 12,
      border: `1px solid ${isGreen ? '#c6e7ce' : '#f0cbcb'}`,
      backgroundColor: isGreen ? '#f4fbf6' : '#fff7f7',
    }}>
      <div style={{ fontFamily: sans, fontSize: 7.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: isGreen ? '#15803d' : '#b91c1c' }}>
        {eyebrow}
      </div>
      <div style={{ marginTop: 6, fontFamily: serif, fontSize: 24, fontWeight: 400, lineHeight: 1, color: isGreen ? '#166534' : '#991b1b' }}>
        {value}
      </div>
      <div style={{ marginTop: 8, fontFamily: sans, fontSize: 9.5, fontWeight: 400, lineHeight: 1.5, color: isGreen ? 'rgba(22,101,52,0.8)' : 'rgba(153,27,27,0.8)' }}>
        {description}
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <span style={{ fontFamily: sans, fontSize: 8, color: C.textSec }}>{label}</span>
    </div>
  );
}
