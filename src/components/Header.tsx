'use client';

import Link from 'next/link';

interface HeaderProps {
  lang: 'de' | 'fr';
  onLangChange: (lang: 'de' | 'fr') => void;
}

export default function Header({ lang, onLangChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(11,15,25,0.82)] border-b border-[var(--color-glass-border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-[60px] sm:h-[72px]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-0.5 no-underline group">
            <span className="font-[var(--font-serif)] text-[1.6rem] sm:text-[2.2rem] leading-none">
              <span className="italic text-[var(--color-accent)] group-hover:drop-shadow-[0_0_8px_rgba(0,212,170,0.4)] transition-all">St</span>
              <span className="text-[var(--color-text-0)]">office</span>
            </span>
            <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[var(--color-coral)] ml-0.5 -mt-3 sm:-mt-4 shadow-[0_0_6px_rgba(232,115,90,0.5)]" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Lang */}
            <div className="flex items-center gap-0.5 font-[var(--font-mono)] text-[10px] sm:text-[11px] uppercase tracking-wider">
              {(['de', 'fr'] as const).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="text-[var(--color-bg-4)] mx-1">|</span>}
                  <button
                    onClick={() => onLangChange(l)}
                    className={`px-2 py-1 rounded-md border-0 bg-transparent cursor-pointer transition-all ${
                      lang === l
                        ? 'text-[var(--color-accent)] font-bold bg-[var(--color-accent-glow)]'
                        : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/dashboard"
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg-0)] font-semibold text-xs sm:text-sm no-underline hover:bg-[var(--color-accent-dim)] hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all"
            >
              {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
