import { bollywoodVideos } from "./bollywood";
import { hollywoodVideos } from "./hollywood";
import { webSeriesVideos } from "./web-series";
import { cartoonVideos } from "./cartoon";
import { ramayanaVideos } from "./ramayana";
import { southindianVideos } from "./south-indian";
import { mahabharatVideos } from "./mahabharat";
import { shreekrishnaVideos } from "./shree-krishna";

/* ---------------- INTERFACE ---------------- */

export interface Video {
  id: string;
  title: string;
  slug: string;
  videoUrl: string;
  downloadUrl: string;
  poster: string;
  description: string;
  seoDescription?: string;
  category: string;
  year: number;
  duration: string;
  rating: number;
  genre: string[];
  language: string;
  quality: string;
  featured?: boolean;
  director?: string;
  cast?: string[];
  keywords?: string[];
}

/* ---------------- NORMALIZE ---------------- */

const normalize = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");

/* ---------------- SLUG HELPER ---------------- */

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------------- MAIN DATA ---------------- */

export const videos: Video[] = [
  ...bollywoodVideos,
  ...hollywoodVideos,
  ...webSeriesVideos,
  ...cartoonVideos,
  ...ramayanaVideos,
  ...southindianVideos,
  ...mahabharatVideos,
  ...shreekrishnaVideos,
];

/* ---------------- HELPERS ---------------- */

export const getVideosByCategory = (category: string): Video[] => {
  return videos.filter(
    (v) => normalize(v.category) === normalize(category)
  );
};

export const getFeaturedVideos = (): Video[] => {
  return videos.filter((v) => v.featured === true);
};

export const getLatestVideos = (): Video[] => {
  return [...videos].sort((a, b) => b.year - a.year).slice(0, 10);
};

export const getTrendingVideos = (): Video[] => {
  return [...videos].sort((a, b) => b.rating - a.rating).slice(0, 10);
};

export const getPopularVideos = (): Video[] => {
  return videos.filter((v) => v.rating >= 7.5).slice(0, 10);
};

export const getTopRatedVideos = (): Video[] => {
  return [...videos].sort((a, b) => b.rating - a.rating).slice(0, 10);
};

export const getVideosByGenre = (genre: string): Video[] => {
  return videos.filter((v) => v.genre.includes(genre));
};

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((v) => v.id === id);
};

export const getVideoBySlug = (slug: string): Video | undefined => {
  return videos.find((v) => v.slug === slug);
};

export const getAllVideoSlugs = (): string[] => {
  return videos.map((v) => v.slug);
};

export const getRecommendedVideos = (currentVideoId: string): Video[] => {
  const current = getVideoById(currentVideoId);
  if (!current) return videos.slice(0, 10);

  return videos
    .filter((v) => v.id !== currentVideoId)
    .filter(
      (v) =>
        v.category === current.category ||
        v.genre.some((g) => current.genre.includes(g))
    )
    .slice(0, 10);
};

export const getUpcomingVideos = (): Video[] => {
  return videos.filter((v) => v.year >= 2025).slice(0, 10);
};

export const getHindiDubbedVideos = (): Video[] => {
  return videos
    .filter(
      (v) => normalize(v.language) === "hindi" &&
        (normalize(v.category) === "hollywood" ||
          normalize(v.category) === "southindian")
    )
    .slice(0, 10);
};

/* ---------------- CARTOON HELPERS (FIXED ERROR) ---------------- */

export const getCartoonVideos = (): Video[] => {
  return videos.filter((v) => normalize(v.category) === "cartoon");
};

export const getAnimeVideos = (): Video[] => {
  return videos.filter(
    (v) =>
      v.genre.includes("Animation") ||
      v.title.toLowerCase().includes("anime")
  );
};

export const getKidsCartoons = (): Video[] => {
  return videos.filter(
    (v) =>
      v.genre.includes("Family") ||
      normalize(v.category) === "cartoon"
  );
};
