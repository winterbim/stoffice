'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import { t, type Locale } from '@/lib/i18n';

export default function Home() {
  const [lang, setLang] = useState<Locale>('de');

  return (
    <div className="noise">
      <Header lang={lang} onLangChange={setLang} />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,212,170,0.06)_0%,transparent_70%)] pointer-events-none" />

      <main className="relative max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Hero */}
        <div className="pt-10 sm:pt-16 pb-10 sm:pb-14 max-w-[800px]">
          <div className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--color-accent)] pb-3 mb-5 border-b border-[rgba(0,212,170,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(0,212,170,0.5)]" />
            <span>Stoffice v8.0</span>
          </div>

          <h1 className="font-[var(--font-serif)] text-[clamp(3.6rem,6vw,7.2rem)] font-normal leading-[0.92] tracking-[-0.02em] text-[var(--color-text-0)] mb-5">
            Smart Building{' '}
            <em className="italic not-italic" style={{
              background: 'linear-gradient(135deg, #00d4aa 0%, #34d399 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(0,212,170,0.2))',
            }}>
              {lang === 'fr' ? 'IA' : 'AI'}
            </em>
          </h1>

          <p className="text-[1.05rem] leading-relaxed text-[var(--color-text-2)] max-w-[540px]">
            {t('subtitle', lang)}
          </p>
        </div>

        {/* Calculator */}
        <Calculator lang={lang} />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[var(--color-glass-border)] bg-[var(--color-bg-1)]">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col items-center gap-1.5 text-center text-xs text-[var(--color-text-3)]">
          <strong className="text-[var(--color-text-2)] font-medium">
            &copy; 2025&ndash;2026 Stoffice / Simone J. Stocker &ndash; MAS Real Estate
          </strong>
          <span>
            {lang === 'fr'
              ? "Sans garantie. Les valeurs servent uniquement \u00e0 des fins d'illustration et de test."
              : 'Alle Angaben ohne Gew\u00e4hr. Werte dienen zur Veranschaulichung & Testzwecken.'}
          </span>
          <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-bg-4)] tracking-wider">
            v8.0 &mdash; Powered by Next.js
          </span>
        </div>
      </footer>
    </div>
  );
}
