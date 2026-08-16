"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Info, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/data/videos";
import { generateSlug } from "@/lib/seo-utils";

interface HeroSliderProps {
  videos: Video[];
}

export function HeroSlider({ videos }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    if (videos.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const prevSlide = useCallback(() => {
    if (videos.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (!isAutoPlaying || videos.length < 2) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, videos.length]);

  if (videos.length === 0) return null;

  const activeVideo = videos[currentIndex];

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) return;

    const swipeOffset = event.changedTouches[0].clientX - touchStartX;
    const minSwipeDistance = 50;

    if (swipeOffset < -minSwipeDistance) {
      nextSlide();
    } else if (swipeOffset > minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(null);
  };

  return (
    <section
      className="relative h-[72svh] min-h-[560px] max-h-[760px] md:h-[85vh] md:max-h-none w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        <Image
          key={activeVideo.id}
          src={activeVideo.poster}
          alt={activeVideo.title}
          fill
          className="object-cover transition-opacity duration-500"
          priority={currentIndex === 0}
          sizes="100vw"
          quality={65}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full min-w-0 max-w-2xl space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground rounded">
              {activeVideo.quality}
            </span>
            {activeVideo.rating > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-secondary rounded">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {activeVideo.rating}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {activeVideo.year}
            </span>
          </div>

          <h1 className="max-w-full break-words text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight line-clamp-2">
            {activeVideo.title}
          </h1>

          <div className="flex max-w-full flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{activeVideo.duration}</span>
            <span>&bull;</span>
            <span>{activeVideo.language}</span>
            <span>&bull;</span>
            <span className="line-clamp-1">{activeVideo.genre.join(", ")}</span>
          </div>

          <p className="max-w-xl break-words text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-2 sm:line-clamp-3">
            {activeVideo.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/movie/${activeVideo.slug || generateSlug(activeVideo.title)}`}>
              <Button size="lg" className="gap-2 text-sm sm:text-base">
                <Play className="w-5 h-5" fill="currentColor" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/movie/${activeVideo.slug || generateSlug(activeVideo.title)}`}>
              <Button size="lg" variant="outline" className="gap-2 text-sm sm:text-base">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {videos.length > 1 && (
        <>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-background/30 hover:bg-background/50 backdrop-blur-sm"
              onClick={prevSlide}
              aria-label="Previous featured movie"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-background/30 hover:bg-background/50 backdrop-blur-sm"
              onClick={nextSlide}
              aria-label="Next featured movie"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {videos.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show featured movie ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-muted-foreground/50 hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
