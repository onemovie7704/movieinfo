import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";

export const metadata: Metadata = {
  title: "South Indian Movies | Onemovie",
  description: "Watch Telugu, Tamil, Kannada, and Malayalam movies. Stream the best of South Indian cinema.",
};

export default function SouthIndianPage() {
  const videos = getVideosByCategory("South Indian");

  return (
    <CollectionPage
      title="South Indian Movies"
      description="Discover the best of Telugu, Tamil, Kannada, and Malayalam cinema"
      videos={videos}
      basePath="/south-indian"
      availableLanguages={["Telugu", "Tamil", "Kannada", "Malayalam"]}
    />
  );
}
