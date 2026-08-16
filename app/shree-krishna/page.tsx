import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";

export const metadata: Metadata = {
  title: "Shree Krishna Episodes | Onemovie",
  description:
    "Watch Shree Krishna episodes in Hindi and explore the complete mythological series.",
  alternates: { canonical: "/shree-krishna" },
};

export default function ShreeKrishnaPage() {
  return (
    <CollectionPage
      title="Shree Krishna"
      description="Watch Shree Krishna episodes in Hindi in chronological order."
      videos={getVideosByCategory("Shree Krishna")}
      basePath="/shree-krishna"
      availableLanguages={["Hindi"]}
    />
  );
}
