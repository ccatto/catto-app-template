import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { notFound } from 'next/navigation';
import cn from 'clsx';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '../../i18n';
import '@ui/global.css';
import HeaderCatto from '../components/HeaderCatto/HeaderCatto';
import { Providers } from '../providers';
import { montserrat, urbanist } from '../ui/fonts';

// Lazy load footer (not critical for initial render)
const FooterCatto = dynamicImport(
  () => import('../components/FooterCatto/FooterCatto'),
);

// Force dynamic rendering for pages that use session context
export const dynamic = 'force-dynamic';

// Base URL drives canonical/OG/Twitter absolute URLs. Reads NEXT_PUBLIC_BASE_URL
// so forks don't hardcode a domain (set it per environment in .env).
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Generate metadata with translations. Provides a full SEO baseline (canonical,
// hreflang alternates, OpenGraph, Twitter) for every fork.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: {
      canonical: '/',
      // Mirror the locales in i18n.ts; extend if you add more languages.
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: title,
      type: 'website',
      // TODO: add a social share image at public/og-image.png (1200x630) and set:
      // images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // TODO: images: ['/og-image.png'] once the asset exists.
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('catto-theme') || 'default';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${montserrat.className} ${montserrat.variable} ${urbanist.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <HeaderCatto />
            <main className={cn('min-h-screen')}>
              {children}
            </main>
            <FooterCatto />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
