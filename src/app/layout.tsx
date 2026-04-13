import type { Metadata } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const serif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Stoffice | Smart Building AI – FM Cost Optimizer',
    template: '%s | Stoffice',
  },
  description:
    'AI-powered Facility Management cost optimization platform with Dalux FM & Build integration. Calculate savings from building automation and digital twins.',
  metadataBase: new URL('https://stoffice.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    alternateLocale: 'fr_CH',
    siteName: 'Stoffice',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-[var(--color-bg-0)] text-[var(--color-text-1)] font-[var(--font-sans)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
