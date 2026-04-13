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
    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
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
      className="inline-flex items-center justify-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg no-underline hover:bg-[var(--color-accent-hover)] transition-colors"
    >
      {children}
    </a>
  );
}

function BtnSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center px-7 py-3.5 border border-[var(--color-border-strong)] text-[var(--color-text)] text-sm font-semibold rounded-lg no-underline hover:bg-[var(--color-bg-elevated)] transition-colors"
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
        <section className="min-h-[92vh] flex flex-col justify-center max-w-[1200px] mx-auto px-6 pt-20">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-5">
            {t('heroEyebrow', lang)}
          </div>
          <h1 className="font-[var(--font-serif)] text-[clamp(2.6rem,5vw,4.8rem)] leading-[1.06] tracking-tight text-[var(--color-text)] max-w-[780px]">
            {t('heroTitle', lang)}
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-[580px] leading-relaxed">
            {t('heroSub', lang)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <BtnPrimary href="mailto:info@stoffice.ch?subject=Demo">{t('heroCta1', lang)}</BtnPrimary>
            <BtnSecondary href="#calculator">{t('heroCta2', lang)}</BtnSecondary>
          </div>
          <p className="mt-8 text-xs text-[var(--color-text-tertiary)] tracking-wide">
            {t('heroTargets', lang)}
          </p>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  2 — TRUST BAR                           ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-16 border-t border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-tertiary)] text-center mb-8">
              {t('trustLabel', lang)}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {['Dalux', 'HSLU', 'Wüest Partner', 'Implenia', 'pom+'].map((name) => (
                <span key={name} className="text-sm font-medium text-[var(--color-text-tertiary)] opacity-50 hover:opacity-80 transition-opacity">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  3 — PROBLEM                             ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-28 border-t border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[680px] mb-16">
              <Eyebrow>{t('problemEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('problemTitle', lang)}</SectionTitle>
              <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {t('problemSub', lang)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <article key={n} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text)] text-[15px] mb-2">
                        {t(`problemItem${n}Title`, lang)}
                      </h3>
                      <p className="text-[14px] leading-6 text-[var(--color-text-secondary)]">
                        {t(`problemItem${n}Sub`, lang)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-8 text-xs text-[var(--color-text-tertiary)] italic">
              {t('problemSource', lang)}
            </p>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  4 — WHAT WE DO / DIFFERENTIATION        ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-28 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="max-w-[1200px] mx-auto px-6 grid gap-14 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>{t('whatEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('whatTitle', lang)}</SectionTitle>
              <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)] max-w-[500px]">
                {t('whatSub', lang)}
              </p>
            </div>

            <div>
              <div className="rounded-2xl border border-[var(--color-accent)]/20 bg-white p-8 mb-8">
                <p className="text-[17px] leading-8 text-[var(--color-text)] font-medium italic">
                  &ldquo;{t('whatDiff', lang)}&rdquo;
                </p>
              </div>

              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
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
        <section id="how" className="py-28 border-t border-[var(--color-border)] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-16">
              <Eyebrow>{t('howEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('howTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <article key={n} className="rounded-2xl border border-[var(--color-border)] bg-white p-7 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-text-tertiary)] tracking-[0.18em]">
                      0{n}
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                  </div>

                  <h3 className="font-[var(--font-serif)] text-[1.35rem] leading-tight text-[var(--color-text)] mb-3">
                    {t(`howStep${n}Title`, lang)}
                  </h3>
                  <p className="text-[14px] leading-6 text-[var(--color-text-secondary)] mb-6 flex-1">
                    {t(`howStep${n}Sub`, lang)}
                  </p>

                  <div className="space-y-3 border-t border-[var(--color-border)] pt-5 text-[12px]">
                    <div>
                      <span className="font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howInputLabel', lang)}</span>
                      <p className="text-[var(--color-text-secondary)] mt-0.5">{t(`howStep${n}In`, lang)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howOutputLabel', lang)}</span>
                      <p className="text-[var(--color-text-secondary)] mt-0.5">{t(`howStep${n}Out`, lang)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t('howTimeLabel', lang)}</span>
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
        <section id="calculator" className="py-28 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-12">
              <Eyebrow>{t('resultsEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('resultsTitle', lang)}</SectionTitle>
            </div>

            {/* Metric row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-2xl bg-white border border-[var(--color-border)] p-6 text-center">
                  <div className="font-[var(--font-serif)] text-[clamp(1.8rem,3vw,2.6rem)] text-[var(--color-accent)] leading-none mb-2">
                    {t(`resultItem${n}Value`, lang)}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    {t(`resultItem${n}Label`, lang)}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--color-text-tertiary)] italic mb-16">
              {t('resultsDisclaimer', lang)}
            </p>

            {/* Calculator */}
            <Calculator lang={lang} />
          </div>
        </section>

        {/* ╔══════════════════════════════════════════╗
            ║  7 — CASE STUDY                          ║
            ╚══════════════════════════════════════════╝ */}
        <section className="py-28 border-t border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-14">
              <Eyebrow>{t('caseEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('caseTitle', lang)}</SectionTitle>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Problem */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500 mb-4">
                  {t('caseProblemLabel', lang)}
                </div>
                <p className="text-[15px] leading-7 text-[var(--color-text-secondary)]">
                  {t('caseProblem', lang)}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border border-[var(--color-accent)]/20 bg-white p-7">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] mb-4">
                  {t('caseSolutionLabel', lang)}
                </div>
                <p className="text-[15px] leading-7 text-[var(--color-text-secondary)]">
                  {t('caseSolution', lang)}
                </p>
              </div>

              {/* Results */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-7">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 mb-4">
                  {t('caseResultsLabel', lang)}
                </div>
                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 mt-1 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-[14px] leading-6 text-[var(--color-text-secondary)]">
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
        <section id="who" className="py-28 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-16">
              <Eyebrow>{t('forWhoEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('forWhoTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { seg: 1, pains: 4, icon: '🏢' },
                { seg: 2, pains: 4, icon: '🔧' },
                { seg: 3, pains: 3, icon: '📋' },
                { seg: 4, pains: 4, icon: '👷' },
              ].map(({ seg, pains, icon }) => (
                <article key={seg} className="rounded-2xl border border-[var(--color-border)] bg-white p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="font-semibold text-[var(--color-text)] text-[15px]">
                      {t(`seg${seg}Title`, lang)}
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {Array.from({ length: pains }, (_, i) => i + 1).map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
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
        <section id="offers" className="py-28 border-t border-[var(--color-border)] scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-16">
              <Eyebrow>{t('packagesEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('packagesTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              {[
                { pkg: 1, items: 5 },
                { pkg: 2, items: 6 },
                { pkg: 3, items: 5 },
                { pkg: 4, items: 5 },
              ].map(({ pkg, items }) => (
                <article key={pkg} className={`rounded-2xl border p-7 flex flex-col ${pkg === 2 ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]' : 'border-[var(--color-border)] bg-white'}`}>
                  <div className="mb-5">
                    <h3 className="font-[var(--font-serif)] text-[1.25rem] text-[var(--color-text)] mb-1">
                      {t(`pkg${pkg}Title`, lang)}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)]">
                      {t(`pkg${pkg}Sub`, lang)}
                    </p>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {Array.from({ length: items }, (_, i) => i + 1).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
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
            <div className="rounded-2xl border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent-light)] p-8 md:p-10">
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
        <section className="py-28 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-[600px] mb-14">
              <Eyebrow>{t('integEyebrow', lang)}</Eyebrow>
              <SectionTitle>{t('integTitle', lang)}</SectionTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['Formats', 'Deploy', 'Security', 'Compliance', 'Api'] as const).map((key) => (
                <div key={key} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                  <h3 className="font-semibold text-[var(--color-text)] text-[14px] mb-2">
                    {t(`integ${key}Title`, lang)}
                  </h3>
                  <p className="text-[13px] leading-6 text-[var(--color-text-secondary)]">
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
        <section id="faq" className="py-28 border-t border-[var(--color-border)] scroll-mt-20">
          <div className="max-w-[760px] mx-auto px-6">
            <Eyebrow>{t('faqEyebrow', lang)}</Eyebrow>
            <SectionTitle className="mb-12">{t('faqTitle', lang)}</SectionTitle>

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
        <section className="py-28 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <Eyebrow>{t('founderEyebrow', lang)}</Eyebrow>
            <blockquote className="font-[var(--font-serif)] text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.5] text-[var(--color-text)] mb-6">
              &ldquo;{t('founderQuote', lang)}&rdquo;
            </blockquote>
            <p className="text-sm font-semibold text-[var(--color-text)]">{t('founderName', lang)}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-0">{t('founderRole', lang)}</p>
          </div>
        </section>

        <section className="py-28 border-t border-[var(--color-border)]">
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <SectionTitle className="mb-4">{t('finalCtaTitle', lang)}</SectionTitle>
            <p className="text-[var(--color-text-secondary)] mb-10 max-w-[480px] mx-auto">
              {t('finalCtaSub', lang)}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <BtnPrimary href="mailto:info@stoffice.ch?subject=Demo">{t('finalCta1', lang)}</BtnPrimary>
              <BtnSecondary href="#calculator">{t('finalCta2', lang)}</BtnSecondary>
            </div>
            <p className="mt-6">
              <a
                href="mailto:info@stoffice.ch?subject=Diagnostic"
                className="text-sm text-[var(--color-accent)] no-underline hover:underline font-medium"
              >
                {t('finalCta3', lang)}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-10 border-t border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
          <span>{t('footerCopy', lang)}</span>
          <div className="flex items-center gap-6">
            <span>{t('footerDisclaimer', lang)}</span>
            <a href="/login" className="no-underline text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
              {t('admin', lang)}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
