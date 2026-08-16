"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";

const WISHLIST_KEY = "onemovie:wishlist";
const WISHLIST_EVENT = "onemovie:wishlist-change";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(storedValue)
      ? [...new Set(storedValue.filter((id): id is string => typeof id === "string"))]
      : [];
  } catch {
    return [];
  }
}

interface WishlistContextValue {
  wishlistIds: string[];
  isLoaded: boolean;
  isWishlisted: (videoId: string) => boolean;
  toggleWishlist: (videoId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, supabase, isLoading: isAuthLoading, recordActivity } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncedUserId = useRef<string | null>(null);

  const syncWishlist = useCallback(() => {
    setWishlistIds(readWishlist());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    syncWishlist();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_KEY) syncWishlist();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(WISHLIST_EVENT, syncWishlist);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(WISHLIST_EVENT, syncWishlist);
    };
  }, [syncWishlist]);

  useEffect(() => {
    // Supabase sync logic removed
    if (isAuthLoading || !isLoaded) return;
    if (!user || !supabase) {
      syncedUserId.current = null;
      return;
    }
    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    void (async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("movie_id")
        .eq("user_id", user.id);

      const cloudIds = (data || []).map((item) => item.movie_id as string);
      const mergedIds = [...new Set([...readWishlist(), ...cloudIds])];

      if (mergedIds.length > cloudIds.length) {
        await supabase.from("wishlists").upsert(
          mergedIds.map((movieId) => ({ user_id: user.id, movie_id: movieId })),
          { onConflict: "user_id,movie_id" }
        );
      }

      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(mergedIds));
      setWishlistIds(mergedIds);
    })();
  }, [isAuthLoading, isLoaded, supabase, user]);
  const toggleWishlist = useCallback((videoId: string) => {
    const removing = wishlistIds.includes(videoId);
    const nextIds = removing
      ? wishlistIds.filter((id) => id !== videoId)
      : [...wishlistIds, videoId];

    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextIds));
      setWishlistIds(nextIds);
      window.dispatchEvent(new Event(WISHLIST_EVENT));
    } catch {
      // Storage may be blocked by strict browser privacy settings.
    }    

    if (user && supabase) {
      if (removing) {
        void supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", videoId);
      } else {
        void supabase
          .from("wishlists")
          .upsert({ user_id: user.id, movie_id: videoId });
      }
    }
    recordActivity(removing ? "wishlist_remove" : "wishlist_add", videoId);
  }, [recordActivity, supabase, user, wishlistIds]);

  const isWishlisted = useCallback(
    (videoId: string) => wishlistIds.includes(videoId),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, isLoaded, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
