'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { t, type Locale } from '@/lib/i18n';

const Calculator = dynamic(() => import('@/components/Calculator'), {
  loading: () => <div className="h-[400px]" />,
});

/* ── Tiny reusable bits ─────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)] mb-5">
      {children}
    </div>
  );
}

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-[var(--font-serif)] text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.12] tracking-tight text-[var(--color-text)] ${className}`}>
      {children}
    </h2>
  );
}

function BtnPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-semibold rounded-full no-underline hover:bg-[var(--color-accent-hover)] transition-all duration-300"
    >
      {children}
    </a>
  );
}

function BtnSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-8 py-3.5 border border-[var(--color-border-strong)] text-[var(--color-text)] text-sm font-medium rounded-full no-underline hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-all duration-300"
    >
      {children}
    </a>
  );
}

/* ── FAQ Accordion Item ─────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-0 bg-transparent border-0 cursor-pointer text-left"
      >
        <span className="text-[15px] font-medium text-[var(--color-text)] pr-4">{q}</span>
        <svg
          className={`w-5 h-5 shrink-0 text-[var(--color-text-tertiary)] transition-transform ${open ? 'rotate-45' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-[15px] leading-7 text-[var(--color-text-secondary)] pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════════════════════ */

export default function Home() {
  const [lang, setLang] = useState<Locale>('de');

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />

      <main>
        {/* ╔══════════════════════════════════════════╗
            ║  1 — HERO                                ║
            ╚══════════════════════════════════════════╝ */}
        <section className="relative min-h-[100vh] flex flex-col justify-center max-w-[1200px] mx-auto px-6 pt-20">
          {/* Atmospheric glow */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-accent)] opacity-[0.02] blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--color-accent)] mb-6">
              {t('heroEyebrow', lang)}
            </div>
            <h1 className="font-[var(--font-serif)] text-[clamp(2.6rem,5.2vw,5rem)] leading-[1.04] tracking-tight text-[var(--color-text)] max-w-[820px]">
              {t('heroTitle', lang)}
            </h1>
            <p className="mt-7 text-[17px] text-[var(--color-text-secondary)] max-w-[560px] leading-[1.75]">
              {t('heroSub', lang)}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <BtnPrimary href="mailto:info@stoffice.ch?subject=Demo">{t('heroCta1', lang)}</BtnPrimary>
              <BtnSecondary href="#calculator">{t('heroCta2', lang)}</BtnSecondary>
            </div>
            <p className="mt-10 text-[11px] text-[var(--color-text-tertiary)] tracking-[0.1em]">
              {t('heroTargets', lang)}
            </p>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  2 — TRUST BAR                           ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-16">
          <div className="divider-glow mx-auto max-w-[600px] mb-12" />
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-tertiary)] text-center mb-8">
              {t('trustLabel', lang)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
              {['Dalux', 'HSLU', 'Wüest Partner', 'Implenia', 'pom+'].map((name) => (
                <span key={name} className="text-[13px] font-medium text-[var(--color-text-tertiary)] opacity-30 hover:opacity-70 hover:text-[var(--color-accent)] transition-all duration-500">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  3 — PROBLEM                             ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-32">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[700px] mb-20">
              <Eyebrow>{t('problemEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('problemTitle', lang)}</SectionTitle>
              <p className="mt-6 text-[15px] leading-[1.85] text-[var(--color-text-secondary)]">
                {t('problemSub', lang)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <article key={n} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-8 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)] transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)] text-[15px] mb-2">
                        {t(`problemItem${n}Title`, lang)}
                      </h3>
                      <p className="text-[14px] leading-7 text-[var(--color-text-secondary)]">
                        {t(`problemItem${n}Sub`, lang)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-10 text-[11px] text-[var(--color-text-tertiary)] italic">
              {t('problemSource', lang)}
            </p>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  4 — WHAT WE DO / DIFFERENTIATION        ║
            ╚══════════════════════════════════════════╝ */}
        <section className="relative py-32 overflow-hidden">
          {/* Warm side glow */}
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)] opacity-[0.025] blur-[150px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>{t('whatEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('whatTitle', lang)}</SectionTitle>
              <p className="mt-6 text-[15px] leading-[1.85] text-[var(--color-text-secondary)] max-w-[500px]">
                {t('whatSub', lang)}
              </p>
            </div>

            <div>
              <div className="rounded-2xl border border-[var(--color-accent)]/15 bg-[var(--color-glow)] p-9 mb-10">
                <p className="text-[17px] leading-[1.75] text-[var(--color-text)] font-medium italic">
                  &ldquo;{t('whatDiff', lang)}&rdquo;
                </p>
              </div>

              <ul className="space-y-5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                    <span className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                      {t(`whatPoint${n}`, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  5 — HOW IT WORKS (4 steps)              ║
            ╚══════════════════════════════════════════╝ */}
        <section id="how" className="py-32 scroll-mt-20">
          <div className="divider-glow mx-auto max-w-[400px] mb-32" />
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-20">
              <Eyebrow>{t('howEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('howTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <article key={n} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-7 flex flex-col hover:border-[var(--color-accent)]/20 transition-all duration-500">
                  <div className="flex items-center justify-between mb-7">
                    <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-text-tertiary)] tracking-[0.18em]">
                      0{n}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <h3 className="font-[var(--font-serif)] text-[1.35rem] leading-tight text-[var(--color-text)] mb-3">
                    {t(`howStep${n}Title`, lang)}
                  </h3>
                  <p className="text-[14px] leading-7 text-[var(--color-text-secondary)] mb-7 flex-1">
                    {t(`howStep${n}Sub`, lang)}
                  </p>

                  <div className="space-y-3 border-t border-[var(--color-border)] pt-5 text-[12px]">
                    <div>
                      <span className="font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howInputLabel', lang)}</span>
                      <p className="text-[var(--color-text-secondary)] mt-0.5">{t(`howStep${n}In`, lang)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howOutputLabel', lang)}</span>
                      <p className="text-[var(--color-text-secondary)] mt-0.5">{t(`howStep${n}Out`, lang)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howTimeLabel', lang)}</span>
                      <p className="text-[var(--color-accent)] font-medium mt-0.5">{t(`howStep${n}Time`, lang)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  6 — RESULTS / ROI + CALCULATOR          ║
            ╚══════════════════════════════════════════╝ */}
        <section id="calculator" className="relative py-32 bg-[var(--color-bg-elevated)] scroll-mt-20">
          {/* Top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-accent)] opacity-[0.015] blur-[120px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 relative">
            <div className="max-w-[600px] mb-14">
              <Eyebrow>{t('resultsEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('resultsTitle', lang)}</SectionTitle>
            </div>

            {/* Metric row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-7 text-center">
                  <div className="font-[var(--font-serif)] text-[clamp(1.8rem,3vw,2.6rem)] text-[var(--color-accent)] leading-none mb-3">
                    {t(`resultItem${n}Value`, lang)}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-tertiary)] tracking-wide">
                    {t(`resultItem${n}Label`, lang)}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[var(--color-text-tertiary)] italic mb-16">
              {t('resultsDisclaimer', lang)}
            </p>

            {/* Calculator */}
            <Calculator lang={lang} />
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  7 — CASE STUDY                          ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-32">
          <div className="divider-glow mx-auto max-w-[400px] mb-32" />
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-16">
              <Eyebrow>{t('caseEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('caseTitle', lang)}</SectionTitle>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Problem */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-8">
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-400 mb-5">
                  {t('caseProblemLabel', lang)}
                </div>
                <p className="text-[15px] leading-7 text-[var(--color-text-secondary)]">
                  {t('caseProblem', lang)}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border border-[var(--color-accent)]/15 bg-[var(--color-glow)] p-8">
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)] mb-5">
                  {t('caseSolutionLabel', lang)}
                </div>
                <p className="text-[15px] leading-7 text-[var(--color-text-secondary)]">
                  {t('caseSolution', lang)}
                </p>
              </div>

              {/* Results */}
              <div className="rounded-2xl border border-emerald-800/30 bg-emerald-950/20 p-8">
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400 mb-5">
                  {t('caseResultsLabel', lang)}
                </div>
                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[14px] leading-7 text-[var(--color-text-secondary)]">
                        {t(`caseResult${n}`, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  8 — FOR WHO (4 segments)                ║
            ╚══════════════════════════════════════════╝ */}
        <section id="who" className="py-32 bg-[var(--color-bg-elevated)] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-20">
              <Eyebrow>{t('forWhoEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('forWhoTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { seg: 1, pains: 4, icon: '🏢' },
                { seg: 2, pains: 4, icon: '🔧' },
                { seg: 3, pains: 3, icon: '📋' },
                { seg: 4, pains: 4, icon: '👷' },
              ].map(({ seg, pains, icon }) => (
                <article key={seg} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-8 hover:border-[var(--color-border-strong)] transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500">{icon}</span>
                    <h3 className="font-semibold text-[var(--color-text)] text-[15px]">
                      {t(`seg${seg}Title`, lang)}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {Array.from({ length: pains }, (_, i) => i + 1).map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400/60 shrink-0" />
                        <span className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
                          {t(`seg${seg}Pain${p}`, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  9 — PACKAGES                            ║
            ╚══════════════════════════════════════════╝ */}
        <section id="offers" className="py-32 scroll-mt-20">
          <div className="divider-glow mx-auto max-w-[400px] mb-32" />
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-20">
              <Eyebrow>{t('packagesEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('packagesTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-14">
              {[
                { pkg: 1, items: 5 },
                { pkg: 2, items: 6 },
                { pkg: 3, items: 5 },
                { pkg: 4, items: 5 },
              ].map(({ pkg, items }) => (
                <article key={pkg} className={`rounded-2xl border p-7 flex flex-col transition-all duration-500 ${pkg === 2 ? 'border-[var(--color-accent)]/30 bg-[var(--color-glow)]' : 'border-[var(--color-border)] bg-[var(--color-surface-glass)] hover:border-[var(--color-border-strong)]'}`}>
                  <div className="mb-6">
                    <h3 className="font-[var(--font-serif)] text-[1.25rem] text-[var(--color-text)] mb-1">
                      {t(`pkg${pkg}Title`, lang)}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)]">
                      {t(`pkg${pkg}Sub`, lang)}
                    </p>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {Array.from({ length: items }, (_, i) => i + 1).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 rounded-full bg-[var(--color-accent)] opacity-60 shrink-0" />
                        <span className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                          {t(`pkg${pkg}Item${item}`, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {/* Entry offer — highlighted */}
            <div className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-glow)] p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] mb-2">
                    {t('pkgEntryTitle', lang)}
                  </div>
                  <h3 className="font-[var(--font-serif)] text-[1.6rem] text-[var(--color-text)] mb-1">
                    {t('pkgEntryName', lang)}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                    {t('pkgEntrySub', lang)}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <li key={n} className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-[13px] text-[var(--color-text-secondary)]">
                          {t(`pkgEntryItem${n}`, lang)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:text-right">
                  <BtnPrimary href="mailto:info@stoffice.ch?subject=Diagnostic">
                    {t('pkgEntryCta', lang)}
                  </BtnPrimary>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  10 — INTEGRATIONS / SECURITY            ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-32 bg-[var(--color-bg-elevated)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-16">
              <Eyebrow>{t('integEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('integTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(['Formats', 'Deploy', 'Security', 'Compliance', 'Api'] as const).map((key) => (
                <div key={key} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-7 hover:border-[var(--color-border-strong)] transition-all duration-500">
                  <h3 className="font-semibold text-[var(--color-text)] text-[14px] mb-3">
                    {t(`integ${key}Title`, lang)}
                  </h3>
                  <p className="text-[13px] leading-7 text-[var(--color-text-secondary)]">
                    {t(`integ${key}`, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  11 — FAQ                                ║
            ╚══════════════════════════════════════════╝ */}
        <section id="faq" className="py-32 scroll-mt-20">
          <div className="divider-glow mx-auto max-w-[400px] mb-32" />
          <div className="max-w-[760px] mx-auto px-6">
            <Eyebrow>{t('faqEyebrow', lang)}</Eyebrow>
            <SectionTitle className="mb-14">{t('faqTitle', lang)}</SectionTitle>

            <div>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <FaqItem key={n} q={t(`faq${n}Q`, lang)} a={t(`faq${n}A`, lang)} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  12 — FOUNDER + FINAL CTA                ║
            ╚══════════════════════════════════════════╝ */}
        <section className="relative py-36 bg-[var(--color-bg-elevated)] overflow-hidden">
          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--color-accent)] opacity-[0.02] blur-[120px] pointer-events-none" />

          <div className="max-w-[760px] mx-auto px-6 text-center relative">
            <Eyebrow>{t('founderEyebrow', lang)}</Eyebrow>
            <blockquote className="font-[var(--font-serif)] text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.6] text-[var(--color-text)] mb-8">
              &ldquo;{t('founderQuote', lang)}&rdquo;
            </blockquote>
            <p className="text-sm font-semibold text-[var(--color-text)]">{t('founderName', lang)}</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] mb-0">{t('founderRole', lang)}</p>
          </div>
        </section>

        <section className="py-32">
          <div className="divider-glow mx-auto max-w-[300px] mb-20" />
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <SectionTitle className="mb-5">{t('finalCtaTitle', lang)}</SectionTitle>
            <p className="text-[var(--color-text-secondary)] mb-12 max-w-[480px] mx-auto leading-relaxed">
              {t('finalCtaSub', lang)}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <BtnPrimary href="mailto:info@stoffice.ch?subject=Demo">{t('finalCta1', lang)}</BtnPrimary>
              <BtnSecondary href="#calculator">{t('finalCta2', lang)}</BtnSecondary>
            </div>
            <p className="mt-8">
              <a
                href="mailto:info@stoffice.ch?subject=Diagnostic"
                className="text-[13px] text-[var(--color-accent)] no-underline hover:underline font-medium transition-colors duration-300"
              >
                {t('finalCta3', lang)}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-12 border-t border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[var(--color-text-tertiary)]">
          <span>{t('footerCopy', lang)}</span>
          <div className="flex items-center gap-6">
            <span>{t('footerDisclaimer', lang)}</span>
            <a href="/login" className="no-underline text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors duration-300">
              {t('admin', lang)}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
