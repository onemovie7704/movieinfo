import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByGenre } from "@/data/videos";

export const metadata: Metadata = {
  title: "Comedy Movies | Onemovie",
  description: "Laugh out loud with the funniest comedy movies, stand-up specials, and hilarious entertainment.",
};

export default function ComedyPage() {
  const videos = getVideosByGenre("Comedy");

  return (
    <CollectionPage
      title="Comedy Movies"
      description="Laugh out loud with our collection of hilarious comedies"
      videos={videos}
      basePath="/comedy"
    />
  );
}
