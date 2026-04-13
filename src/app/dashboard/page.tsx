'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { type Locale, t } from '@/lib/i18n';

interface DaluxStats {
  fm: { status: 'ok' | 'error' | 'loading'; count: number; label: string };
  build: { status: 'ok' | 'error' | 'loading'; count: number; label: string };
}

interface KPI {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Locale>('de');
  const [dalux, setDalux] = useState<DaluxStats>({
    fm: { status: 'loading', count: 0, label: 'Workorders' },
    build: { status: 'loading', count: 0, label: 'Issues' },
  });

  const fetchDalux = useCallback(async () => {
    setDalux(prev => ({
      fm: { ...prev.fm, status: 'loading' },
      build: { ...prev.build, status: 'loading' },
    }));

    try {
      const [fmRes, buildRes] = await Promise.allSettled([
        fetch('/api/dalux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'fm', endpoint: 'workorders' }),
        }),
        fetch('/api/dalux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'build', endpoint: 'issues' }),
        }),
      ]);

      setDalux({
        fm: fmRes.status === 'fulfilled' && fmRes.value.ok
          ? { status: 'ok', count: (await fmRes.value.json()).count ?? 0, label: 'Workorders' }
          : { status: 'error', count: 0, label: 'Workorders' },
        build: buildRes.status === 'fulfilled' && buildRes.value.ok
          ? { status: 'ok', count: (await buildRes.value.json()).count ?? 0, label: 'Issues' }
          : { status: 'error', count: 0, label: 'Issues' },
      });
    } catch {
      setDalux({
        fm: { status: 'error', count: 0, label: 'Workorders' },
        build: { status: 'error', count: 0, label: 'Issues' },
      });
    }
  }, []);

  useEffect(() => {
    fetchDalux();
  }, [fetchDalux]);

  const kpis: KPI[] = [
    {
      label: lang === 'fr' ? 'Workorders actifs' : 'Aktive Workorders',
      value: dalux.fm.status === 'ok' ? dalux.fm.count.toLocaleString('de-CH') : '—',
      sub: 'Dalux FM',
      color: 'var(--color-accent)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.194-.14 1.743" /></svg>,
    },
    {
      label: lang === 'fr' ? 'Issues Build' : 'Build Issues',
      value: dalux.build.status === 'ok' ? dalux.build.count.toLocaleString('de-CH') : '—',
      sub: 'Dalux Build',
      color: 'var(--color-info)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    },
    {
      label: lang === 'fr' ? 'Économie potentielle' : 'Einsparpotenzial',
      value: 'CHF 127k',
      sub: lang === 'fr' ? '/ an (estimé)' : '/ Jahr (geschätzt)',
      color: 'var(--color-success)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    },
    {
      label: 'ROI',
      value: '340 %',
      sub: lang === 'fr' ? 'Retour estimé' : 'Geschätzte Rendite',
      color: 'var(--color-gold)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-0)]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-glass)] border-b border-[var(--color-glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-0.5 no-underline font-[var(--font-serif)] text-2xl text-[var(--color-text-0)] hover:opacity-80 transition-opacity">
              <span className="italic text-[var(--color-accent)]">St</span>
              <span className="font-normal">office</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-coral)] ml-0.5 mb-1 self-start" />
            </Link>
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-accent)]">
              {t('dashboard', lang)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Lang toggle */}
            <div className="flex items-center gap-1 font-[var(--font-mono)] text-xs">
              <button onClick={() => setLang('de')} className={`px-2 py-1 rounded border-0 bg-transparent cursor-pointer transition-colors ${lang === 'de' ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'}`}>DE</button>
              <span className="text-[var(--color-text-3)]">|</span>
              <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded border-0 bg-transparent cursor-pointer transition-colors ${lang === 'fr' ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'}`}>FR</button>
            </div>

            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-3)]">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-glass-border)] bg-transparent text-xs text-[var(--color-text-2)] hover:text-[var(--color-danger)] hover:border-[var(--color-danger)] transition-colors cursor-pointer"
                >
                  {t('logout', lang)}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-[var(--font-serif)] text-3xl text-[var(--color-text-0)] mb-2">
            {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
          </h1>
          <p className="text-sm text-[var(--color-text-3)]">
            {lang === 'fr'
              ? 'Vue d\'ensemble des données Dalux et des KPIs d\'optimisation'
              : 'Übersicht der Dalux-Daten und Optimierungs-KPIs'}
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map(kpi => (
            <div key={kpi.label} className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] p-5 hover:border-[var(--color-bg-4)] transition-colors">
              <div className="flex items-center gap-2 mb-3" style={{ color: kpi.color }}>
                {kpi.icon}
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-wider">{kpi.sub}</span>
              </div>
              <div className="text-2xl font-semibold text-[var(--color-text-0)] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {kpi.value}
              </div>
              <div className="text-xs text-[var(--color-text-3)]">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Dalux Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* FM */}
          <div className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-0)]">Dalux FM</h2>
                <p className="text-xs text-[var(--color-text-3)]">{t('daluxFmSub', lang)}</p>
              </div>
              <StatusBadge status={dalux.fm.status} lang={lang} />
            </div>
            <div className="space-y-3">
              <DataRow label="Workorders" value={dalux.fm.status === 'ok' ? String(dalux.fm.count) : '—'} />
              <DataRow label="API" value="fm-api.dalux.com/api/v1.11" />
            </div>
          </div>

          {/* Build */}
          <div className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-0)]">Dalux Build</h2>
                <p className="text-xs text-[var(--color-text-3)]">{t('daluxBuildSub', lang)}</p>
              </div>
              <StatusBadge status={dalux.build.status} lang={lang} />
            </div>
            <div className="space-y-3">
              <DataRow label="Issues" value={dalux.build.status === 'ok' ? String(dalux.build.count) : '—'} />
              <DataRow label="API" value="node2.field.dalux.com/api/v4.10" />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-0)] mb-4">
            {lang === 'fr' ? 'Actions rapides' : 'Schnellaktionen'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] text-[var(--color-text-1)] no-underline hover:border-[var(--color-accent)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>
              <span className="text-sm">{lang === 'fr' ? 'Calculateur ROI' : 'ROI-Rechner'}</span>
            </Link>

            <button
              onClick={fetchDalux}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] text-[var(--color-text-1)] cursor-pointer hover:border-[var(--color-info)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
              <span className="text-sm">{lang === 'fr' ? 'Actualiser Dalux' : 'Dalux aktualisieren'}</span>
            </button>

            <Link
              href="/api/health"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] text-[var(--color-text-1)] no-underline hover:border-[var(--color-success)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              <span className="text-sm">Health Check</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function StatusBadge({ status, lang }: { status: 'ok' | 'error' | 'loading'; lang: Locale }) {
  const map = {
    ok: { text: t('connected', lang), color: 'var(--color-success)', bg: 'rgba(52,211,153,0.1)' },
    error: { text: t('disconnected', lang), color: 'var(--color-danger)', bg: 'rgba(248,113,113,0.1)' },
    loading: { text: t('connecting', lang), color: 'var(--color-warning)', bg: 'rgba(251,191,36,0.1)' },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.text}
    </span>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[var(--color-glass-border)] last:border-0">
      <span className="text-xs text-[var(--color-text-3)]">{label}</span>
      <span className="font-[var(--font-mono)] text-sm text-[var(--color-text-1)]">{value}</span>
    </div>
  );
}
