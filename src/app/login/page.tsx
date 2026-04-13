'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError('E-Mail oder Passwort ungültig.');
    } else if (res?.url) {
      router.push(res.url);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-0)] px-4">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-0.5 no-underline font-[var(--font-serif)] text-[3rem] text-[var(--color-text-0)] mb-10">
          <span className="italic text-[var(--color-accent)]">St</span>
          <span className="font-normal">office</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)] ml-0.5 mb-1.5 self-start" />
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] p-8">
          <h1 className="font-[var(--font-serif)] text-2xl text-[var(--color-text-0)] mb-1">
            Anmelden
          </h1>
          <p className="text-sm text-[var(--color-text-3)] mb-6">
            Zugang zum Dashboard & Dalux-Integration
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-text-3)] mb-2">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] text-[var(--color-text-0)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                placeholder="name@firma.ch"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-[var(--font-mono)] uppercase tracking-wider text-[var(--color-text-3)] mb-2">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-2)] border border-[var(--color-glass-border)] text-[var(--color-text-0)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-bg-0)] font-semibold text-sm hover:bg-[var(--color-accent-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-text-3)] mt-6">
          © 2025–2026 Stoffice — Simone J. Stocker
        </p>
      </div>
    </div>
  );
}
