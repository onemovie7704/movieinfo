import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByGenre } from "@/data/videos";

export const metadata: Metadata = {
  title: "Drama Movies | Onemovie",
  description: "Emotional drama movies, powerful storytelling, and award-winning performances.",
};

export default function DramaPage() {
  const videos = getVideosByGenre("Drama");

  return (
    <CollectionPage
      title="Drama Movies"
      description="Powerful stories and emotional journeys that move you"
      videos={videos}
      basePath="/drama"
    />
  );
}
