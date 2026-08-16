import { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { getVideosByCategory } from "@/data/videos";
import { AmazonAd } from "@/components/amazon-ad";

export const metadata: Metadata = {
  title: "Hollywood Movies | Onemovie",
  description: "Watch the latest Hollywood blockbusters, action movies, sci-fi thrillers, and more. Stream the best of American cinema.",
};

export default function HollywoodPage() {
  const videos = getVideosByCategory("Hollywood");

  return (
    <CollectionPage
      title="Hollywood Movies"
      description="Experience the best of Hollywood - blockbusters, classics, and everything in between"
      videos={videos}
      basePath="/hollywood"
      availableLanguages={["English"]}
    >
    
    </CollectionPage>
  );
}
