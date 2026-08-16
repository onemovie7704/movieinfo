export const WATCH_HISTORY_KEY = "onemovie:watch-history";
export const WATCH_HISTORY_EVENT = "onemovie:watch-history-change";

export interface WatchHistoryEntry {
  movieId: string;
  progressSeconds: number;
  durationSeconds: number;
  lastWatchedAt: string;
  completed: boolean;
}

export function readLocalWatchHistory(): WatchHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(WATCH_HISTORY_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (entry): entry is WatchHistoryEntry =>
            typeof entry?.movieId === "string" &&
            typeof entry?.progressSeconds === "number" &&
            typeof entry?.durationSeconds === "number"
        )
      : [];
  } catch {
    return [];
  }
}

export function saveLocalWatchProgress(entry: WatchHistoryEntry) {
  const history = readLocalWatchHistory();
  const nextHistory = [entry, ...history.filter((item) => item.movieId !== entry.movieId)]
    .sort(
      (a, b) =>
        new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime()
    )
    .slice(0, 100);

  try {
    window.localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(nextHistory));
    window.dispatchEvent(new Event(WATCH_HISTORY_EVENT));
  } catch {
    // Storage may be blocked by strict browser privacy settings.
  }
}
