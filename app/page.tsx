import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { SectionSlider } from "@/components/section-slider";
import { videos } from "@/data/videos";
import { PersonalizedHomeSections } from "@/components/personalized-home-sections";
import {
  tmdbRecentlyAddedVideos,
  tmdbHollywoodVideos,
  tmdbBollywoodVideos,
} from "@/data/tmdb-generated";

export default function HomePage() {
  // Get different categories for sliders
  const heroVideos = [
    ...tmdbHollywoodVideos,
    ...tmdbBollywoodVideos,
  ]
    .filter(v => v.poster && v.rating && v.rating > 1) // Ensure poster and some rating exists
    .sort((a, b) => b.rating - a.rating) // Sort by highest rating
    .slice(0, 10); // Take top 10

  const trendingVideos = videos.slice(0, 12);
  const newReleases = [...videos].sort((a, b) => b.year - a.year).slice(0, 12);
  const bollywoodVideos = videos.filter(v => v.category === "Bollywood" || v.genre.includes("Bollywood")).slice(0, 12);
  const hollywoodVideos = videos.filter(v => v.category === "Hollywood" || v.genre.includes("Hollywood")).slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pb-12">
        {/* Hero Section */}
        <HeroSlider videos={heroVideos} />

      

        {/* Main Content Sections */}
        <div className="pt-8 space-y-4">
          <PersonalizedHomeSections />
          <SectionSlider title="Newly Added Automatically" videos={tmdbRecentlyAddedVideos.slice(0, 20)} />
          <SectionSlider title="Trending Now" videos={trendingVideos} />
          <SectionSlider title="New Releases" videos={newReleases} />
          <SectionSlider title="Bollywood Hits" videos={bollywoodVideos} />
          <SectionSlider title="Hollywood Blockbusters" videos={hollywoodVideos} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
