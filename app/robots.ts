import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://www.onemovie.in/sitemap.xml',
    host: 'https://www.onemovie.in',
  };
}
