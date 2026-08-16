import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Download, Star, Clock, Calendar, Globe, Film, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/video-player";
import { SectionSlider } from "@/components/section-slider";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getVideoById, getRecommendedVideos, videos } from "@/data/videos";
import { resolveDownloadUrl } from "@/lib/download-url";
import { TrackedDownloadLink } from "@/components/tracked-download-link";
import { ShareActions } from "@/components/share-actions";
import { MovieSupportActions } from "@/components/movie-support-actions";
import { WishlistButton } from "@/components/wishlist-button";

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return videos.map((video) => ({
    id: video.id,
  }));
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    return {
      title: "Video Not Found - Onemovie",
    };
  }

  return {
    title: `${video.title} - Watch on Onemovie`,
    description: video.description,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  const recommendedVideos = getRecommendedVideos(id);
  const downloadUrl = resolveDownloadUrl(video.downloadUrl);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Button>
          </Link>

          <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Video Player and Details */}
            <div className="min-w-0 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                videoId={video.id}
                videoUrl={video.videoUrl}
                poster={video.poster}
                title={video.title}
              />

              {/* Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="break-words text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {video.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {video.rating > 0 && (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-foreground font-medium">{video.rating}</span>
                        </div>
                        <span>&bull;</span>
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.year}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <WishlistButton videoId={video.id} showLabel />
                  <TrackedDownloadLink
                    href={downloadUrl}
                    movieId={video.id}
                    source="primary"
                  >
                    <Button className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </TrackedDownloadLink>
                </div>
              </div>

              {/* Quality Badge */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded">
                  {video.quality}
                </span>
                {video.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                <p className="break-words text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Movie Details */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Movie Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="text-foreground font-medium">{video.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Film className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="text-foreground font-medium">{video.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-foreground font-medium">{video.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Release Year</p>
                      <p className="text-foreground font-medium">{video.year}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Poster and Quick Info */}
            <div className="min-w-0 space-y-6">
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={video.poster}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded shadow-lg">
                    {video.quality}
                  </span>
                </div>
                {video.rating > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-foreground font-medium">{video.rating}</span>
                  </div>
                )}
              </div>

              {/* Quick Download */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Download</h3>
                <TrackedDownloadLink
                  href={downloadUrl}
                  movieId={video.id}
                  source="quick-download"
                >
                  <Button className="w-full justify-between">
                    <span>Download Movie</span>
                    <Download className="w-4 h-4" />
                  </Button>
                </TrackedDownloadLink>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
                <MovieSupportActions movieId={video.id} />
              </div>

              {/* Share */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Share This Movie</h3>
                <ShareActions title={video.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <SectionSlider title="You May Also Like" videos={recommendedVideos} />

      <Footer />
    </main>
  );
}
