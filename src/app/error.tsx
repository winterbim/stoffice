'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[400px] text-center">
        <h1 className="font-[var(--font-serif)] text-2xl text-[var(--color-text)] mb-3">
          Etwas ist schiefgelaufen
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">
          {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
          >
            Erneut versuchen
          </button>
          <a href="/" className="text-sm text-[var(--color-text-tertiary)] no-underline hover:text-[var(--color-text-secondary)] transition-colors">
            Startseite
          </a>
        </div>
      </div>
    </div>
  );
}
