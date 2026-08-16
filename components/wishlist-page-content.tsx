"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { VideoGrid } from "@/components/video-grid";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/components/auth-provider";

export function WishlistPageContent() {
  const { wishlistIds, isLoaded } = useWishlist();
  const { user, isConfigured } = useAuth();
  const wishlistVideos = videos.filter((video) => wishlistIds.includes(video.id));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto min-h-[70vh] max-w-[1400px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLoaded
                ? `${wishlistVideos.length} ${wishlistVideos.length === 1 ? "movie" : "movies"} saved`
                : "Loading saved movies..."}
            </p>
          </div>
        </div>

        {isConfigured && !user && (
          <div className="mb-6 flex flex-col justify-between gap-3 border-y border-border py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Login to sync this wishlist across your phone and computer.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login to Sync</Link>
            </Button>
          </div>
        )}

        {!isLoaded ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : wishlistVideos.length > 0 ? (
          <VideoGrid videos={wishlistVideos} />
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center border-y border-border py-16 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-foreground">Your wishlist is empty</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Tap the heart on any movie to keep it here for later.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse Movies</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
