"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FilterBar } from "@/components/filter-bar";
import { VideoGrid } from "@/components/video-grid";
import { videos, type Video } from "@/data/videos";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const language = searchParams.get("language") || "";
  const year = searchParams.get("year") || "";
  const quality = searchParams.get("quality") || "";
  const sort = searchParams.get("sort") || "latest";

  // Search videos
  let searchResults: Video[] = videos; // Start with all videos

  if (query.trim()) {
    searchResults = searchResults.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.category.toLowerCase().includes(query.toLowerCase()) ||
        video.genre.some((g) =>
          g.toLowerCase().includes(query.toLowerCase())
        ) ||
        video.language.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply filters
  if (genre) {
    searchResults = searchResults.filter((v) =>
      v.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  if (language) {
    searchResults = searchResults.filter(
      (v) => v.language.toLowerCase() === language.toLowerCase()
    );
  }

  if (year) {
    searchResults = searchResults.filter((v) => v.year.toString() === year);
  }

  if (quality) {
    searchResults = searchResults.filter(
      (v) => v.quality.toLowerCase() === quality.toLowerCase()
    );
  }

  // Apply sorting
  switch (sort) {
    case "rating":
      searchResults.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      searchResults.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "year":
      searchResults.sort((a, b) => b.year - a.year);
      break;
    case "latest":
    default:
      searchResults.sort((a, b) => b.year - a.year);
      break;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Search Results
            </h1>
          </div>
          {query ? (
            <>
              <p className="text-muted-foreground">
                Showing results for &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchResults.length} results found
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">
              Enter a search term to find movies and shows
            </p>
          )}
        </div>

        {query && (
          <>
            {/* Filters */}
            <FilterBar basePath={`/search?q=${encodeURIComponent(query)}`} />

            {/* Results Grid */}
            <VideoGrid
              videos={searchResults}
              emptyMessage={`No results found for "${query}". Try a different search term.`}
            />
          </>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              Use the search bar to find movies, shows, and more
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
