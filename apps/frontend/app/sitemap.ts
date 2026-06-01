import type { MetadataRoute } from 'next';
import { locales } from '../i18n';

// Served at /sitemap.xml. Reads NEXT_PUBLIC_BASE_URL so forks don't hardcode a domain,
// and emits one entry per locale with hreflang alternates.
//
// ROUTES lists the public, indexable paths ('' = home). Add/remove per app — keep
// auth/account pages OUT (see robots.ts disallow).
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
