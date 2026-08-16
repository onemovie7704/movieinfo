"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  WATCH_HISTORY_EVENT,
  WATCH_HISTORY_KEY,
  readLocalWatchHistory,
  type WatchHistoryEntry,
} from "@/lib/watch-history";

export function useWatchHistory() {
  const { user, supabase, isLoading: isAuthLoading } = useAuth();
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadLocal = useCallback(() => {
    setHistory(readLocalWatchHistory());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadLocal();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WATCH_HISTORY_KEY) loadLocal();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(WATCH_HISTORY_EVENT, loadLocal);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(WATCH_HISTORY_EVENT, loadLocal);
    };
  }, [loadLocal]);

  useEffect(() => {
    // Supabase sync logic removed
    if (isAuthLoading || !user || !supabase) return;

    void (async () => {
      const { data } = await supabase
        .from("watch_history")
        .select("movie_id, progress_seconds, duration_seconds, last_watched_at, completed")
        .eq("user_id", user.id)
        .order("last_watched_at", { ascending: false })
        .limit(100);

      const cloudHistory: WatchHistoryEntry[] = (data || []).map((entry) => ({
        movieId: entry.movie_id as string,
        progressSeconds: Number(entry.progress_seconds),
        durationSeconds: Number(entry.duration_seconds),
        lastWatchedAt: entry.last_watched_at as string,
        completed: Boolean(entry.completed),
      }));

      const merged = new Map<string, WatchHistoryEntry>();
      [...cloudHistory, ...readLocalWatchHistory()].forEach((entry) => {
        const existing = merged.get(entry.movieId);
        if (!existing || new Date(entry.lastWatchedAt) > new Date(existing.lastWatchedAt)) {
          merged.set(entry.movieId, entry);
        }
      });

      const mergedHistory = [...merged.values()].sort(
        (a, b) =>
          new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime()
      );

      window.localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(mergedHistory));
      setHistory(mergedHistory);
      setIsLoaded(true);
    })();
  }, [isAuthLoading, supabase, user]);

  return { history, isLoaded };
}
