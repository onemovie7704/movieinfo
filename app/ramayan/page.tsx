import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";

export const metadata: Metadata = {
  title: "Ramayan | Onemovie",
  description:
    "A mythological series based on Ramayana, showing Lord Rama’s journey and victory of good over evil.",
};

export default function RamayanPage() {
  const videos = getVideosByCategory("ramayan");

  return (
    <CollectionPage
      title="Ramayana"
      description="A mythological series based on Ramayana, showing Lord Rama’s journey and victory of good over evil."
      videos={videos}
      basePath="/ramayana"
      availableLanguages={["Hindi"]}
    />
  );
}