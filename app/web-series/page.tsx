import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";

export const metadata: Metadata = {
  title: "Web Series | Onemovie",
  description: "Binge-watch the best web series, original shows, and episodic content. Stream crime thrillers, dramas, and more.",
};

export default function WebSeriesPage() {
  const videos = getVideosByCategory("Web Series");

  return (
    <CollectionPage
      title="Web Series"
      description="Binge-worthy web series and original shows that keep you hooked"
      videos={videos}
      basePath="/web-series"
      availableGenres={["Crime", "Drama", "Thriller", "Action", "History"]}
    />
  );
}
