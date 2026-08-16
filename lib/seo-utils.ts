/**
 * SEO Utilities for generating SEO-friendly URLs, metadata, and other optimization helpers
 */

/**
 * Converts a title to a SEO-friendly slug
 * @param title - The video title
 * @returns SEO-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove hyphens from start/end
}

/**
 * Generates a canonical URL for a page
 * @param slug - The page slug
 * @param baseUrl - The base URL of the site
 * @returns The canonical URL
 */
export function generateCanonicalUrl(slug: string, baseUrl: string = 'https://www.onemovie.in'): string {
  return `${baseUrl}/movie/${slug}`;
}

/**
 * Generates an optimized meta description
 * @param description - Original description
 * @param maxLength - Maximum length (default 160 characters)
 * @returns Optimized meta description
 */
export function generateMetaDescription(description: string, maxLength: number = 160): string {
  const trimmed = description.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.substring(0, maxLength - 3) + '...';
}

/**
 * Generates SEO-optimized title
 * @param title - Video title
 * @param category - Video category
 * @param maxLength - Maximum length (default 60 characters)
 * @returns SEO-optimized title
 */
export function generateSEOTitle(title: string, category: string, maxLength: number = 60): string {
  const baseTitle = `${title} - Watch on Onemovie`;
  if (baseTitle.length <= maxLength) return baseTitle;
  return `${title.substring(0, maxLength - 20)} - Onemovie`;
}

/**
 * Generates Open Graph metadata object
 */
export function generateOpenGraphMeta(
  title: string,
  description: string,
  image: string,
  url: string,
  type: string = 'video.movie'
) {
  return {
    title,
    description,
    image,
    url,
    type,
    siteName: 'Onemovie',
  };
}

/**
 * Generates Twitter Card metadata
 */
export function generateTwitterCardMeta(
  title: string,
  description: string,
  image: string
) {
  return {
    card: 'summary_large_image',
    title,
    description,
    image,
  };
}

/**
 * Extracts keywords from a genre array and title
 */
export function extractKeywords(title: string, genres: string[], category: string): string[] {
  const keywords: string[] = [title, ...genres, category, 'watch online', 'streaming'];
  return [...new Set(keywords)].slice(0, 10);
}

/**
 * Generates breadcrumb schema data
 */
export function generateBreadcrumbSchema(
  movieTitle: string,
  movieSlug: string,
  category: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.onemovie.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category,
        item: `https://www.onemovie.in/${category.toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: movieTitle,
        item: `https://www.onemovie.in/movie/${movieSlug}`,
      },
    ],
  };
}

/**
 * Formats a date to ISO 8601 format
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}
