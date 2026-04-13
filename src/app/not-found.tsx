import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[400px] text-center">
        <div className="font-[var(--font-serif)] text-[5rem] text-[var(--color-text)] leading-none mb-4">
          404
        </div>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">
          Die angeforderte Seite existiert nicht.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg no-underline hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
