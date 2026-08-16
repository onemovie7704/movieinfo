"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/components/auth-provider";
import { readLocalWatchHistory, saveLocalWatchProgress } from "@/lib/watch-history";

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  poster: string;
  title: string;
}
const isYouTube = (url: string) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const getYouTubeEmbedUrl = (url: string) => {
  try {
    if (url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.split("/").pop()?.split("?")[0]}`;
    }

    if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
    }

    return url;
  } catch {
    return url;
  }
};
export function VideoPlayer({ videoId, videoUrl, poster, title }: VideoPlayerProps) {
  const { user, supabase, recordActivity } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedSecond = useRef(-10);
  const hasRecordedStart = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const saveProgress = useCallback(
    (progressSeconds: number, durationSeconds: number) => {
      const safeProgress = Number.isFinite(progressSeconds) ? Math.max(0, progressSeconds) : 0;
      const safeDuration = Number.isFinite(durationSeconds) ? Math.max(0, durationSeconds) : 0;
      const completed = safeDuration > 0 && safeProgress / safeDuration >= 0.95;
      const lastWatchedAt = new Date().toISOString();

      saveLocalWatchProgress({
        movieId: videoId,
        progressSeconds: safeProgress,
        durationSeconds: safeDuration,
        lastWatchedAt,
        completed,
      });

      if (user && supabase) {
        void supabase.from("watch_history").upsert(
          {
            user_id: user.id,
            movie_id: videoId,
            progress_seconds: safeProgress,
            duration_seconds: safeDuration,
            last_watched_at: lastWatchedAt,
            completed,
          },
          { onConflict: "user_id,movie_id" }
        );
      }
    },
    [supabase, user, videoId]
  );

  const recordStart = useCallback(() => {
    if (hasRecordedStart.current) return;
    hasRecordedStart.current = true;
    recordActivity("watch_start", videoId);
  }, [recordActivity, videoId]);

  useEffect(() => {
    const localEntry = readLocalWatchHistory().find((entry) => entry.movieId === videoId);
    if (localEntry && !localEntry.completed) setCurrentTime(localEntry.progressSeconds);

    if (!user || !supabase) return;
    void supabase
      .from("watch_history")
      .select("progress_seconds, duration_seconds, last_watched_at, completed")
      .eq("user_id", user.id)
      .eq("movie_id", videoId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data || data.completed) return;
        const cloudDate = new Date(data.last_watched_at as string).getTime();
        const localDate = localEntry ? new Date(localEntry.lastWatchedAt).getTime() : 0;
        if (cloudDate <= localDate) return;

        const progressSeconds = Number(data.progress_seconds);
        saveLocalWatchProgress({
          movieId: videoId,
          progressSeconds,
          durationSeconds: Number(data.duration_seconds),
          lastWatchedAt: data.last_watched_at as string,
          completed: false,
        });
        setCurrentTime(progressSeconds);
        if (videoRef.current?.readyState) videoRef.current.currentTime = progressSeconds;
      });
  }, [supabase, user, videoId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setHasStarted(true);
        recordStart();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const nextTime = videoRef.current.currentTime;
      setCurrentTime(nextTime);
      if (nextTime - lastSavedSecond.current >= 10) {
        lastSavedSecond.current = nextTime;
        saveProgress(nextTime, videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      const savedEntry = readLocalWatchHistory().find((entry) => entry.movieId === videoId);
      if (savedEntry && !savedEntry.completed && savedEntry.progressSeconds > 5) {
        videoRef.current.currentTime = savedEntry.progressSeconds;
        setCurrentTime(savedEntry.progressSeconds);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      {isYouTube(videoUrl) ? (
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            recordStart();
            saveProgress(0, 0);
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          className="w-full h-full object-contain"
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => {
            setIsPlaying(true);
            setHasStarted(true);
            recordStart();
          }}
          onPause={() => {
            setIsPlaying(false);
            if (videoRef.current) {
              saveProgress(videoRef.current.currentTime, videoRef.current.duration);
            }
          }}
        />
      )}


      {/* Play Button Overlay (before playing) */}
      {!hasStarted && !isYouTube(videoUrl) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <button
            onClick={togglePlay}
            className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${showControls && hasStarted ? "opacity-100" : "opacity-0"
          }`}
      >
        {/* Top Bar - Title */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
        </div>

        {/* Center Controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20"
            onClick={() => skip(-10)}
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-white hover:bg-white/20"
            onClick={() => skip(10)}
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/volume">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-sm text-white/80">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
