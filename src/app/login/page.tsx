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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <Link href="/" className="block text-center no-underline font-[var(--font-serif)] text-3xl text-[var(--color-text)] mb-10">
          Stoffice
        </Link>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
          <h1 className="font-[var(--font-serif)] text-xl text-[var(--color-text)] mb-1">
            Anmelden
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
            Zugang zum Dashboard
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
                placeholder="name@firma.ch"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)] transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-text-tertiary)] mt-6">
          © 2025–2026 Stoffice
        </p>
      </div>
    </div>
  );
}
