'use client';

import Link from 'next/link';

interface HeaderProps {
  lang: 'de' | 'fr';
  onLangChange: (lang: 'de' | 'fr') => void;
}

export default function Header({ lang, onLangChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-glass)] border-b border-[var(--color-glass-border)]">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-0.5 no-underline font-[var(--font-serif)] text-[2.6rem] text-[var(--color-text-0)] hover:opacity-80 transition-opacity">
            <span className="italic text-[var(--color-accent)]">St</span>
            <span className="font-normal">office</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)] ml-0.5 mb-1.5 self-start" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-[var(--font-mono)] text-xs uppercase tracking-wider">
              <button
                onClick={() => onLangChange('de')}
                className={`px-2 py-1 rounded transition-all border-0 bg-transparent cursor-pointer ${
                  lang === 'de'
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'
                }`}
              >
                DE
              </button>
              <span className="text-[var(--color-text-3)]">|</span>
              <button
                onClick={() => onLangChange('fr')}
                className={`px-2 py-1 rounded transition-all border-0 bg-transparent cursor-pointer ${
                  lang === 'fr'
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'
                }`}
              >
                FR
              </button>
            </div>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg-0)] font-semibold text-sm no-underline hover:bg-[var(--color-accent-dim)] transition-colors"
            >
              {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
