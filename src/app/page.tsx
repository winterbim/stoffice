'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Calculator from '@/components/Calculator';
import { t, type Locale } from '@/lib/i18n';

export default function Home() {
  const [lang, setLang] = useState<Locale>('de');

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />

      <main className="max-w-[1400px] mx-auto px-8">
        {/* Hero */}
        <div className="py-20 max-w-[800px]">
          <div className="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-accent)] pb-3 mb-5 border-b border-[rgba(0,212,170,0.3)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v6l7 5 7-5V7l-7-5z" />
            </svg>
            <span>Stoffice v8.0</span>
          </div>

          <h1 className="font-[var(--font-serif)] text-[clamp(4.4rem,7vw,8.8rem)] font-normal leading-[0.95] tracking-tight text-[var(--color-text-0)] mb-6">
            {lang === 'fr' ? (
              <>Smart Building <em className="italic bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-success)] bg-clip-text text-transparent">IA</em></>
            ) : (
              <>Smart Building <em className="italic bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-success)] bg-clip-text text-transparent">AI</em></>
            )}
          </h1>

          <p className="text-lg leading-relaxed text-[var(--color-text-2)] max-w-[580px]">
            {t('subtitle', lang)}
          </p>
        </div>

        {/* Calculator */}
        <Calculator lang={lang} />
      </main>

      {/* Footer */}
      <footer className="mt-32 py-10 border-t border-[var(--color-glass-border)] bg-[var(--color-bg-1)]">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col items-center gap-2 text-center text-xs text-[var(--color-text-3)]">
          <strong className="text-[var(--color-text-2)] font-medium">
            © 2025–2026 Stoffice / Simone J. Stocker – MAS Real Estate
          </strong>
          <span>
            {lang === 'fr'
              ? "Sans garantie. Les valeurs servent uniquement à des fins d'illustration et de test."
              : 'Alle Angaben ohne Gewähr. Werte dienen zur Veranschaulichung & Testzwecken.'}
          </span>
          <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-3)] tracking-wider">
            v8.0 – Powered by Next.js
          </span>
        </div>
      </footer>
    </>
  );
}
