import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getCartoonVideos } from "@/data/videos";

export const metadata: Metadata = {
  title: "Cartoon Shows & Movies | Onemovie",
  description: "Watch your favorite cartoon shows and animated movies. Stream popular cartoons like Shinchan, Doraemon, Dragon Ball, and more.",
};

export default function CartoonsPage() {
  const videos = getCartoonVideos();

  return (
    <CollectionPage
      title="Cartoon Shows & Movies"
      description="Your favorite animated content - from classic cartoons to modern anime"
      videos={videos}
      basePath="/cartoons"
      availableGenres={["Animation", "Comedy", "Action", "Adventure", "Family", "Sci-Fi", "Fantasy"]}
      availableLanguages={["English", "Hindi", "Japanese"]}
    />
  );
}
