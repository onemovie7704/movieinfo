import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { videos } from "@/data/videos";

export const metadata: Metadata = {
  title: "Shree Krishna | Onemovie",
  description: "Watch Shree Krishna episodes and movies online in HD quality.",
};

export default function ShreeKrishnaPage() {
  const shreeKrishnaVideos = videos.filter(
    (v) =>
      v.genre.includes("Shree Krishna") || v.category === "Shree Krishna"
  );

  return (
    <CollectionPage
      title="Shree Krishna"
      description="Watch Shree Krishna episodes online in HD quality."
      videos={shreeKrishnaVideos}
      basePath="/shree-krishna"
    />
  );
}