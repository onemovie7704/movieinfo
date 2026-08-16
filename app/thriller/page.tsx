import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByGenre } from "@/data/videos";

export const metadata: Metadata = {
  title: "Thriller Movies | Onemovie",
  description: "Edge-of-your-seat thriller movies, suspenseful dramas, and gripping mysteries.",
};

export default function ThrillerPage() {
  const videos = getVideosByGenre("Thriller");

  return (
    <CollectionPage
      title="Thriller Movies"
      description="Edge-of-your-seat suspense that keeps you guessing"
      videos={videos}
      basePath="/thriller"
    />
  );
}
