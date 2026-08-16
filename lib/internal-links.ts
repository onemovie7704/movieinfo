/**
 * Internal linking strategies for SEO
 */

import { Video, videos } from '@/data/videos';

/**
 * Gets related movies based on genre and category similarity
 */
export function getRelatedMovies(currentVideoId: string, limit: number = 12): Video[] {
  const currentVideo = videos.find((v) => v.id === currentVideoId);
  if (!currentVideo) return [];

  const related = videos
    .filter((v) => {
      // Don't include the current video
      if (v.id === currentVideoId) return false;

      // Prioritize same category and genre overlap
      const categoryMatch = v.category === currentVideo.category;
      const genreOverlap = v.genre.some((g) => currentVideo.genre.includes(g));

      return categoryMatch || genreOverlap;
    })
    .sort((a, b) => {
      // Sort by rating and relevance
      const aScore = a.rating + (a.category === currentVideo.category ? 2 : 0);
      const bScore = b.rating + (b.category === currentVideo.category ? 2 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);

  // If we don't have enough, fill with highly rated videos
  if (related.length < limit) {
    const additional = videos
      .filter(
        (v) =>
          v.id !== currentVideoId &&
          !related.some((r) => r.id === v.id)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit - related.length);

    related.push(...additional);
  }

  return related;
}

/**
 * Gets popular movies for sidebar recommendations
 */
export function getPopularMovies(limit: number = 5): Video[] {
  return videos
    .filter((v) => v.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Gets latest released movies
 */
export function getLatestMovies(limit: number = 10): Video[] {
  return videos
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}

/**
 * Gets videos by category
 */
export function getVideosByCategory(category: string, limit?: number): Video[] {
  let result = videos.filter(
    (v) => v.category.toLowerCase() === category.toLowerCase()
  );

  if (limit) {
    result = result.slice(0, limit);
  }

  return result;
}

/**
 * Gets top rated videos
 */
export function getTopRatedVideos(limit: number = 10): Video[] {
  return videos
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Generates breadcrumb links for a video
 */
export function generateBreadcrumbs(
  videoTitle: string,
  category: string,
  slug: string
): Array<{
  name: string;
  url: string;
  position: number;
}> {
  return [
    {
      name: 'Home',
      url: '/',
      position: 1,
    },
    {
      name: category,
      url: `/${category.toLowerCase()}`,
      position: 2,
    },
    {
      name: videoTitle,
      url: `/movie/${slug}`,
      position: 3,
    },
  ];
}

/**
 * Gets category links for navigation
 */
export function getCategoryLinks(): Array<{
  name: string;
  url: string;
  count: number;
}> {
  const categories = new Map<string, number>();

  videos.forEach((video) => {
    const key = video.category;
    categories.set(key, (categories.get(key) || 0) + 1);
  });

  return Array.from(categories.entries())
    .map(([category, count]) => ({
      name: category,
      url: `/${category.toLowerCase()}`,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates "You may also like" section items
 */
export function getYouMayAlsoLike(currentVideoId: string, limit: number = 8): Video[] {
  return getRelatedMovies(currentVideoId, limit);
}

/**
 * Gets trending movies based on category popularity
 */
export function getTrendingMovies(limit: number = 10): Video[] {
  return videos
    .sort((a, b) => {
      // Combine rating and recency
      const aScore = a.rating + a.year * 0.1;
      const bScore = b.rating + b.year * 0.1;
      return bScore - aScore;
    })
    .slice(0, limit);
}
