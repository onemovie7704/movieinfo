import fs from "node:fs/promises";
import path from "node:path";

const token = process.env.TMDB_ACCESS_TOKEN;
if (!token) {
  throw new Error("TMDB_ACCESS_TOKEN is required. Add it to .env.local or GitHub Actions secrets.");
}

const apiBase = "https://api.themoviedb.org/3";
const outputFile = path.resolve("data/tmdb-generated.ts");
const catalogFile = path.resolve("data/tmdb-catalog.json");
const maxPerCategory = Number(process.env.TMDB_MAX_PER_CATEGORY || 12);
const today = new Date();
const start = new Date(today);
start.setUTCDate(start.getUTCDate() - 14);
const end = new Date(today);
end.setUTCDate(end.getUTCDate() + 2);
const iso = (date) => date.toISOString().slice(0, 10);

async function tmdb(endpoint, params = {}) {
  const url = new URL(`${apiBase}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`TMDB ${response.status}: ${endpoint}`);
  return response.json();
}

async function discoverMovies(language, animation = false) {
  const data = await tmdb("/discover/movie", {
    include_adult: false,
    include_video: false,
    sort_by: "primary_release_date.desc",
    "primary_release_date.gte": iso(start),
    "primary_release_date.lte": iso(end),
    with_original_language: language,
    with_genres: animation ? 16 : undefined,
    page: 1,
  });
  return data.results || [];
}

async function discoverSeries() {
  const data = await tmdb("/discover/tv", {
    include_adult: false,
    sort_by: "first_air_date.desc",
    "first_air_date.gte": iso(start),
    "first_air_date.lte": iso(end),
    without_genres: 16,
    page: 1,
  });
  return data.results || [];
}

async function discoverAnimatedSeries() {
  const data = await tmdb("/discover/tv", {
    include_adult: false,
    sort_by: "first_air_date.desc",
    "first_air_date.gte": iso(start),
    "first_air_date.lte": iso(end),
    with_genres: 16,
    page: 1,
  });
  return data.results || [];
}

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const runtime = (minutes) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};

function trailerFrom(details) {
  const videos = details.videos?.results || [];
  const picked = videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official)
    || videos.find((v) => v.site === "YouTube" && v.type === "Trailer")
    || videos.find((v) => v.site === "YouTube");
  return picked ? `https://youtu.be/${picked.key}` : null;
}

async function makeVideo(item, mediaType, category) {
  const details = await tmdb(`/${mediaType}/${item.id}`, {
    append_to_response: "credits,videos",
    language: "en-US",
  });
  const videoUrl = trailerFrom(details);
  if (!videoUrl || !details.poster_path) return null;

  const title = details.title || details.name;
  const date = details.release_date || details.first_air_date || "";
  const year = Number(date.slice(0, 4)) || today.getUTCFullYear();
  const directors = mediaType === "movie"
    ? (details.credits?.crew || []).filter((person) => person.job === "Director").map((person) => person.name)
    : (details.created_by || []).map((person) => person.name);
  const minutes = mediaType === "movie" ? details.runtime : details.episode_run_time?.[0];

  return {
    id: `tmdb-${mediaType}-${details.id}`,
    title: `${title} (${year})`,
    slug: `${slugify(title)}-${year}`,
    videoUrl,
    downloadUrl: `https://www.themoviedb.org/${mediaType}/${details.id}`,
    poster: `https://image.tmdb.org/t/p/w780${details.poster_path}`,
    description: details.overview || `${title} is a newly released ${category.toLowerCase()} title.`,
    seoDescription: `${title} (${year}) trailer, cast, genres, rating and release information.`,
    category,
    year,
    duration: mediaType === "tv" ? `Season 1${details.number_of_episodes ? ` • ${details.number_of_episodes} Episodes` : ""}` : runtime(minutes),
    rating: Number((details.vote_average || 0).toFixed(1)),
    genre: (details.genres || []).map((genre) => genre.name),
    language: new Intl.DisplayNames(["en"], { type: "language" }).of(details.original_language) || details.original_language,
    quality: "HD",
    featured: false,
    director: directors.join(", ") || undefined,
    cast: (details.credits?.cast || []).slice(0, 6).map((person) => person.name),
    keywords: [title, `${title} ${year}`, category, "official trailer"],
  };
}

async function hydrate(items, mediaType, category) {
  const unique = [...new Map(items.map((item) => [item.id, item])).values()];
  const output = [];
  for (const item of unique) {
    if (output.length >= maxPerCategory) break;
    try {
      const video = await makeVideo(item, mediaType, category);
      if (video) output.push(video);
    } catch (error) {
      console.warn(`Skipping TMDB ${mediaType} ${item.id}:`, error.message);
    }
  }
  return output;
}

const [english, hindi, tamil, telugu, malayalam, kannada, series, animatedSeries] = await Promise.all([
  discoverMovies("en"), discoverMovies("hi"), discoverMovies("ta"), discoverMovies("te"),
  discoverMovies("ml"), discoverMovies("kn"), discoverSeries(), discoverAnimatedSeries(),
]);
const animatedMovies = [...english, ...hindi, ...tamil, ...telugu, ...malayalam, ...kannada]
  .filter((item) => item.genre_ids?.includes(16));
const nonAnimated = (items) => items.filter((item) => !item.genre_ids?.includes(16));

const [hollywood, bollywood, southIndian, webSeries, cartoonsFromMovies, cartoonsFromTv] = await Promise.all([
  hydrate(nonAnimated(english), "movie", "Hollywood"),
  hydrate(nonAnimated(hindi), "movie", "Bollywood"),
  hydrate(nonAnimated([...tamil, ...telugu, ...malayalam, ...kannada]), "movie", "South Indian"),
  hydrate(series, "tv", "Web Series"),
  hydrate(animatedMovies, "movie", "Cartoon"),
  hydrate(animatedSeries, "tv", "Cartoon"),
]);
const cartoons = [...cartoonsFromMovies, ...cartoonsFromTv].slice(0, maxPerCategory);

let previous = { recentlyAdded: [], hollywood: [], bollywood: [], southIndian: [], webSeries: [], cartoons: [] };
try {
  previous = JSON.parse(await fs.readFile(catalogFile, "utf8"));
} catch {
  console.warn("No previous TMDB catalog found; creating a new one.");
}
const merge = (oldItems = [], newItems = []) =>
  [...new Map([...newItems, ...oldItems].map((item) => [item.id, item])).values()]
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
    .slice(0, 500);
const previousIds = new Set(
  [previous.hollywood, previous.bollywood, previous.southIndian, previous.webSeries, previous.cartoons]
    .flat()
    .map((item) => item.id),
);
const freshlyAdded = [hollywood, bollywood, southIndian, webSeries, cartoons]
  .flat()
  .filter((item) => !previousIds.has(item.id));
const catalog = {
  recentlyAdded: [...new Set([
    ...freshlyAdded.map((item) => item.id),
    ...(previous.recentlyAdded ?? []),
  ])].slice(0, 30),
  hollywood: merge(previous.hollywood, hollywood),
  bollywood: merge(previous.bollywood, bollywood),
  southIndian: merge(previous.southIndian, southIndian),
  webSeries: merge(previous.webSeries, webSeries),
  cartoons: merge(previous.cartoons, cartoons),
};
const videosById = new Map(
  [catalog.hollywood, catalog.bollywood, catalog.southIndian, catalog.webSeries, catalog.cartoons]
    .flat()
    .map((item) => [item.id, item]),
);
const recentlyAdded = catalog.recentlyAdded.map((id) => videosById.get(id)).filter(Boolean);

const serialize = (name, videos) => `export const ${name}: Video[] = ${JSON.stringify(videos, null, 2)};`;
const source = [
  'import type { Video } from "./videos";',
  "",
  "// Generated by scripts/sync-tmdb.mjs. Do not edit this file manually.",
  serialize("tmdbHollywoodVideos", catalog.hollywood),
  serialize("tmdbBollywoodVideos", catalog.bollywood),
  serialize("tmdbSouthIndianVideos", catalog.southIndian),
  serialize("tmdbWebSeriesVideos", catalog.webSeries),
  serialize("tmdbCartoonVideos", catalog.cartoons),
  serialize("tmdbRecentlyAddedVideos", recentlyAdded),
  "",
].join("\n\n");
await fs.writeFile(outputFile, source, "utf8");
await fs.writeFile(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`TMDB sync complete: ${hollywood.length} Hollywood, ${bollywood.length} Bollywood, ${southIndian.length} South Indian, ${webSeries.length} web series, ${cartoons.length} cartoons.`);
