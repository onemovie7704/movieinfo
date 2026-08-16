"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FilterBar } from "@/components/filter-bar";
import { VideoGrid } from "@/components/video-grid";
import { type Video } from "@/data/videos";

interface CollectionPageProps {
  title: string;
  description: string;
  videos: Video[];
  basePath: string;
  showGenre?: boolean;
  showLanguage?: boolean;
  availableGenres?: string[];
  availableLanguages?: string[];
  children?: React.ReactNode;
}

function CollectionContent({
  title,
  description,
  videos,
  basePath,
  showGenre = true,
  showLanguage = true,
  availableGenres,
  availableLanguages,
  children,
}: CollectionPageProps) {
  const searchParams = useSearchParams();

  const genre = searchParams.get("genre") || "";
  const language = searchParams.get("language") || "";
  const year = searchParams.get("year") || "";
  const quality = searchParams.get("quality") || "";
  const sort = searchParams.get("sort") || "latest";

  // Apply filters
  let filteredVideos = [...videos];

  if (genre) {
    filteredVideos = filteredVideos.filter((v) =>
      v.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  if (language) {
    filteredVideos = filteredVideos.filter(
      (v) => v.language.toLowerCase() === language.toLowerCase()
    );
  }

  if (year) {
    filteredVideos = filteredVideos.filter((v) => v.year.toString() === year);
  }

  if (quality) {
    filteredVideos = filteredVideos.filter(
      (v) => v.quality.toLowerCase() === quality.toLowerCase()
    );
  }

  // Apply sorting
  switch (sort) {
    case "rating":
      filteredVideos.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "year":
      filteredVideos.sort((a, b) => b.year - a.year);
      break;
    case "latest":
    default:
      filteredVideos.sort((a, b) => b.year - a.year);
      break;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredVideos.length} titles available
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          basePath={basePath}
          showGenre={showGenre}
          showLanguage={showLanguage}
          availableGenres={availableGenres}
          availableLanguages={availableLanguages}
        />

        {/* Ad or Custom Content */}
        {children}

        {/* Videos Grid */}
        <VideoGrid
          videos={filteredVideos}
          emptyMessage="No videos match your filters. Try adjusting your selection."
        />
      </main>

      <Footer />
    </div>
  );
}

export function CollectionPage({ children, ...props }: CollectionPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <CollectionContent {...props}>{children}</CollectionContent>
    </Suspense>
  );
}
