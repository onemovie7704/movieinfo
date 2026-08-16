/**
 * Structured Data (JSON-LD) generation for SEO
 */

export interface MovieSchemaData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  datePublished: string;
  director?: {
    '@type': string;
    name: string;
  };
  actor?: Array<{
    '@type': string;
    name: string;
  }>;
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    ratingCount: number;
  };
  duration?: string;
  genre?: string[];
  inLanguage?: string;
}

/**
 * Generates Movie Schema JSON-LD
 */
export function generateMovieSchema(
  title: string,
  description: string,
  posterImage: string,
  year: number,
  rating: number,
  genres: string[],
  language: string,
  director?: string,
  cast?: string[]
): MovieSchemaData {
  const schema: MovieSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    description,
    image: posterImage,
    datePublished: `${year}-01-01`,
    genre: genres,
    inLanguage: language,
  };

  if (director) {
    schema.director = {
      '@type': 'Person',
      name: director,
    };
  }

  if (cast && cast.length > 0) {
    schema.actor = cast.slice(0, 5).map((name) => ({
      '@type': 'Person',
      name,
    }));
  }

  if (rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      ratingCount: Math.floor(Math.random() * 10000) + 100, // Placeholder count
    };
  }

  return schema;
}

/**
 * Generates VideoObject Schema JSON-LD
 */
export function generateVideoObjectSchema(
  title: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl,
    uploadDate,
    duration: convertDurationToISO8601(duration),
  };
}

/**
 * Generates Organization Schema JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Onemovie',
    url: 'https://www.onemovie.in',
    logo: 'https://www.onemovie.in/icons/icon-512.png',
    sameAs: [
      'https://www.facebook.com/onemovie',
      'https://www.twitter.com/onemovie',
      'https://www.instagram.com/onemovie',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@onemovie.in',
    },
  };
}

/**
 * Generates WebSite Schema JSON-LD
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Onemovie',
    url: 'https://www.onemovie.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.onemovie.in/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Converts duration format (e.g., "2h 35m") to ISO 8601
 */
function convertDurationToISO8601(durationString: string): string {
  const match = durationString.match(/(\d+)h\s+(\d+)m/);
  if (!match) return 'PT1H30M';

  const hours = match[1];
  const minutes = match[2];
  return `PT${hours}H${minutes}M`;
}

/**
 * Generates a complete JSON-LD script for a movie page
 */
export function generateMoviePageJsonLd(
  title: string,
  description: string,
  posterImage: string,
  year: number,
  rating: number,
  genres: string[],
  language: string,
  duration: string,
  director?: string,
  cast?: string[]
) {
  const scripts = [
    generateMovieSchema(title, description, posterImage, year, rating, genres, language, director, cast),
    generateVideoObjectSchema(title, description, posterImage, new Date().toISOString(), duration),
    generateOrganizationSchema(),
  ];

  return scripts;
}
