'use client';

import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

interface HeaderProps {
  lang: 'de' | 'fr';
  onLangChange: (lang: 'de' | 'fr') => void;
}

const NAV_LINKS = [
  { key: 'navHow', href: '#how' },
  { key: 'navWho', href: '#who' },
  { key: 'navOffers', href: '#offers' },
  { key: 'navFaq', href: '#faq' },
] as const;

export default function Header({ lang, onLangChange }: Readonly<HeaderProps>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <span className="font-[var(--font-serif)] text-xl text-[var(--color-accent)] tracking-tight">
            Stoffice
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className="text-[12px] uppercase tracking-[0.14em] text-[var(--color-text-tertiary)] no-underline hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              {t(key, lang)}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Lang switch */}
          <div className="flex items-center gap-0.5 text-[11px] tracking-wider">
            {(['de', 'fr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                aria-label={l === 'de' ? 'Deutsch' : 'Français'}
                className={`px-2 py-1 rounded bg-transparent border-0 cursor-pointer transition-colors duration-300 ${
                  lang === l
                    ? 'text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA — desktop */}
          <a
            href="mailto:info@stoffice.ch?subject=Demo"
            className="hidden md:inline-flex items-center px-5 py-2 border border-[var(--color-accent)]/40 text-[var(--color-accent)] text-[12px] font-medium tracking-wide rounded-full no-underline hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all duration-300"
          >
            {t('navDemo', lang)}
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 bg-transparent border-0 cursor-pointer text-[var(--color-text)]"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--color-text-secondary)] no-underline py-1"
            >
              {t(key, lang)}
            </a>
          ))}
          <a
            href="mailto:info@stoffice.ch?subject=Demo"
            className="block text-sm font-semibold text-[var(--color-accent)] no-underline pt-2"
          >
            {t('navDemo', lang)}
          </a>
        </div>
      )}
    </header>
  );
}
