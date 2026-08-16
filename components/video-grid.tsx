"use client";

import { VideoCard } from "@/components/video-card";
import { type Video } from "@/data/videos";

interface VideoGridProps {
  videos: Video[];
  emptyMessage?: string;
}

export function VideoGrid({ videos, emptyMessage = "No videos found" }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
