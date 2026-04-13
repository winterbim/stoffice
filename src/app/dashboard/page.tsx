'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { type Locale, t } from '@/lib/i18n';

interface DaluxStats {
  fm: { status: 'ok' | 'error' | 'loading'; count: number };
  build: { status: 'ok' | 'error' | 'loading'; count: number };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Locale>('de');
  const [dalux, setDalux] = useState<DaluxStats>({
    fm: { status: 'loading', count: 0 },
    build: { status: 'loading', count: 0 },
  });

  const fetchDalux = useCallback(async () => {
    setDalux({ fm: { status: 'loading', count: 0 }, build: { status: 'loading', count: 0 } });
    try {
      const [fmRes, buildRes] = await Promise.allSettled([
        fetch('/api/dalux', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'fm', endpoint: 'workorders' }) }),
        fetch('/api/dalux', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'build', endpoint: 'issues' }) }),
      ]);
      const parseFm = fmRes.status === 'fulfilled' && fmRes.value.ok ? await fmRes.value.json() : null;
      const parseBuild = buildRes.status === 'fulfilled' && buildRes.value.ok ? await buildRes.value.json() : null;
      setDalux({
        fm: parseFm && !parseFm.error ? { status: 'ok', count: parseFm.metadata?.totalItems ?? parseFm.items?.length ?? 0 } : { status: 'error', count: 0 },
        build: parseBuild && !parseBuild.error ? { status: 'ok', count: parseBuild.metadata?.totalItems ?? parseBuild.items?.length ?? 0 } : { status: 'error', count: 0 },
      });
    } catch {
      setDalux({ fm: { status: 'error', count: 0 }, build: { status: 'error', count: 0 } });
    }
  }, []);

  useEffect(() => { fetchDalux(); }, [fetchDalux]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="no-underline font-[var(--font-serif)] text-xl text-[var(--color-text)]">
              Stoffice
            </Link>
            <span className="text-xs text-[var(--color-accent)] font-medium uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 text-[11px]">
              {(['de', 'fr'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded bg-transparent border-0 cursor-pointer transition-colors ${lang === l ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-tertiary)]'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-tertiary)]">{session.user.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-transparent text-xs text-[var(--color-text-secondary)] hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer"
                >
                  {t('admin', lang) === 'Admin' ? 'Abmelden' : 'Déconnexion'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="font-[var(--font-serif)] text-2xl text-[var(--color-text)] mb-8">
          {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
        </h1>

        {/* Dalux Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {[
            { title: 'Dalux FM', sub: 'Facility Management API', stat: dalux.fm, label: 'Workorders', api: 'fm-api.dalux.com' },
            { title: 'Dalux Build', sub: 'Field / Handover API', stat: dalux.build, label: 'Issues', api: 'node2.field.dalux.com' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-[var(--color-text)]">{card.title}</h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{card.sub}</p>
                </div>
                <StatusBadge status={card.stat.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-tertiary)]">{card.label}</span>
                  <span className="text-[var(--color-text)] font-medium">{card.stat.status === 'ok' ? card.stat.count : '—'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[var(--color-text-tertiary)]">API</span>
                  <span className="text-[var(--color-text-secondary)] font-mono text-xs">{card.api}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/#calculator" className="px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
            {lang === 'fr' ? 'Calculateur ROI' : 'ROI-Rechner'}
          </Link>
          <button onClick={fetchDalux} className="px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] cursor-pointer hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors bg-transparent">
            {lang === 'fr' ? 'Actualiser' : 'Aktualisieren'}
          </button>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'error' | 'loading' }) {
  const styles = {
    ok: 'bg-green-50 text-green-600 border-green-200',
    error: 'bg-red-50 text-red-500 border-red-200',
    loading: 'bg-amber-50 text-amber-600 border-amber-200',
  };
  const labels = { ok: 'Verbunden', error: 'Getrennt', loading: 'Verbinde…' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'ok' ? 'bg-green-500' : status === 'error' ? 'bg-red-400' : 'bg-amber-500'}`} />
      {labels[status]}
    </span>
  );
}
