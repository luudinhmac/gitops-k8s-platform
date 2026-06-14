import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.luumac.io.vn';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/portal-dashboard/',
        '/login/',
        '/register/',
        '/profile/',
        '/write/',
        '/settings/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

