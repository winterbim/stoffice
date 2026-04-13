import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: {
    default: 'Stoffice — From Handover to FM Operations',
    template: '%s | Stoffice',
  },
  description:
    'Turn project data into usable FM operations. Stoffice helps owners and FM teams structure assets, documents and workflows so building operations start clean, stay traceable and cost less to run.',
  metadataBase: new URL('https://stoffice.vercel.app'),
  alternates: {
    canonical: '/',
    languages: { 'de-CH': '/', 'fr-CH': '/?lang=fr' },
  },
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    alternateLocale: 'fr_CH',
    siteName: 'Stoffice',
    title: 'Stoffice — From Handover Chaos to Operational Clarity',
    description: 'We turn project data into usable FM operations. Structure assets, documents and workflows so building operations start clean and cost less.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Stoffice — Handover to FM Operations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stoffice — Handover to FM Operations',
    description: 'Turn project data into usable FM operations. Less waste, fewer errors, lower FM costs.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Stoffice',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              description: 'AI-powered Facility Management cost optimization platform with Dalux FM & Build integration.',
              url: 'https://stoffice.vercel.app',
              author: {
                '@type': 'Person',
                name: 'Simone J. Stocker',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CHF',
                description: 'Free ROI calculator demo',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-secondary)] font-[var(--font-sans)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
