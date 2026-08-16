"use client";

import { useMemo } from "react";
import { SectionSlider } from "@/components/section-slider";
import { videos } from "@/data/videos";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { useWishlist } from "@/hooks/use-wishlist";

export function PersonalizedHomeSections() {
  const { history, isLoaded } = useWatchHistory();
  const { wishlistIds } = useWishlist();

  const continueWatching = useMemo(
    () =>
      history
        .filter(
          (entry) =>
            entry.progressSeconds > 0 &&
            !entry.completed &&
            (!entry.durationSeconds || entry.progressSeconds / entry.durationSeconds < 0.95)
        )
        .map((entry) => videos.find((video) => video.id === entry.movieId))
        .filter((video): video is (typeof videos)[number] => Boolean(video))
        .slice(0, 12),
    [history]
  );

  const recommendations = useMemo(() => {
    const sourceIds = new Set([
      ...wishlistIds,
      ...history.slice(0, 20).map((entry) => entry.movieId),
    ]);
    const genreScores = new Map<string, number>();

    videos
      .filter((video) => sourceIds.has(video.id))
      .forEach((video) =>
        video.genre.forEach((genre) =>
          genreScores.set(genre, (genreScores.get(genre) || 0) + 1)
        )
      );

    return videos
      .filter((video) => !sourceIds.has(video.id))
      .map((video) => ({
        video,
        score: video.genre.reduce((sum, genre) => sum + (genreScores.get(genre) || 0), 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.video.year - a.video.year)
      .map((item) => item.video)
      .slice(0, 12);
  }, [history, wishlistIds]);

  if (!isLoaded) return null;

  return (
    <>
      <SectionSlider title="Continue Watching" videos={continueWatching} />
      <SectionSlider title="Recommended for You" videos={recommendations} />
    </>
  );
}
