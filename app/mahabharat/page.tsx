import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";

export const metadata: Metadata = {
  title: "Mahabharat | Onemovie",
  description: "A mythological series based on Mahabharat, showing the epic saga of the Kauravas and Pandavas.",
};

export default function mahabharatPage() {
  const videos = getVideosByCategory("mahabharat");

  return (
    <CollectionPage
      title="Mahabharat"
      description="A mythological series based on Mahabharat, showing the epic saga of the Kauravas and Pandavas."
      videos={videos}
      basePath="/mahabharat"
      availableLanguages={["Hindi"]}
    />
  );
}
