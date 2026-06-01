import type { MetadataRoute } from 'next';

// Served at /robots.txt. Reads NEXT_PUBLIC_BASE_URL so forks don't hardcode a domain.
// Customize the `disallow` list per app (auth/account pages have no SEO value).
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/en/signin', '/es/signin'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
