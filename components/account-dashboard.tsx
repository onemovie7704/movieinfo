"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Heart,
  History,
  LogOut,
  MessageSquarePlus,
  UserRound,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { VideoGrid } from "@/components/video-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/hooks/use-wishlist";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { videos } from "@/data/videos";

interface MovieRequest {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Preferences {
  email_notifications: boolean;
  new_release_notifications: boolean;
  request_status_notifications: boolean;
}

interface AccountNotification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

const defaultPreferences: Preferences = {
  email_notifications: true,
  new_release_notifications: true,
  request_status_notifications: true,
};

export function AccountDashboard() {
  const router = useRouter();
  const {
    user,
    isLoading,
    isConfigured,
    supabase,
    signInWithGoogle,
    signOut,
    recordActivity,
  } = useAuth();
  const { wishlistIds } = useWishlist();
  const { history } = useWatchHistory();
  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityCount, setActivityCount] = useState(0);
  const [notifications, setNotifications] = useState<AccountNotification[]>([]);

  useEffect(() => {
    if (!user || !supabase) return;

    void (async () => {
      const [requestResult, preferenceResult, activityResult, notificationResult] = await Promise.all([
        supabase
          .from("movie_requests")
          .select("id, title, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("notification_preferences")
          .select(
            "email_notifications, new_release_notifications, request_status_notifications"
          )
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_activity")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("notifications")
          .select("id, title, message, link, read_at, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setRequests((requestResult.data || []) as MovieRequest[]);
      if (preferenceResult.data) {
        setPreferences(preferenceResult.data as Preferences);
      }
      setActivityCount(activityResult.count || 0);
      setNotifications((notificationResult.data || []) as AccountNotification[]);
    })();
  }, [supabase, user]);

  const continueWatching = useMemo(
    () =>
      history
        .filter((entry) => entry.progressSeconds > 0 && !entry.completed)
        .map((entry) => videos.find((video) => video.id === entry.movieId))
        .filter((video): video is (typeof videos)[number] => Boolean(video))
        .slice(0, 6),
    [history]
  );

  const recommendations = useMemo(() => {
    const sourceIds = new Set([
      ...wishlistIds,
      ...history.slice(0, 20).map((entry) => entry.movieId),
    ]);
    const scores = new Map<string, number>();
    videos
      .filter((video) => sourceIds.has(video.id))
      .forEach((video) =>
        video.genre.forEach((genre) => scores.set(genre, (scores.get(genre) || 0) + 1))
      );

    return videos
      .filter((video) => !sourceIds.has(video.id))
      .map((video) => ({
        video,
        score: video.genre.reduce((total, genre) => total + (scores.get(genre) || 0), 0),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || b.video.year - a.video.year)
      .map(({ video }) => video)
      .slice(0, 6);
  }, [history, wishlistIds]);

  const updatePreference = async (key: keyof Preferences, checked: boolean) => {
    if (!user || !supabase) return;
    const nextPreferences = { ...preferences, [key]: checked };
    setPreferences(nextPreferences);
    await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      ...nextPreferences,
      updated_at: new Date().toISOString(),
    });
  };

  const submitMovieRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !supabase || requestTitle.trim().length < 2) return;

    setIsSubmitting(true);
    setRequestMessage("");
    const { data, error } = await supabase
      .from("movie_requests")
      .insert({ user_id: user.id, title: requestTitle.trim() })
      .select("id, title, status, created_at")
      .single();

    if (error) {
      console.error("Movie request submission failed", error);
      setRequestMessage(
        error.message.includes("request_limit_reached")
          ? "You can submit up to 3 requests in 24 hours. Please try again later."
          : error.message.includes("movie_requests") || error.code === "42P01"
            ? "Movie requests database is not set up yet. Please run the Supabase setup SQL."
            : error.code === "42501"
              ? "Movie request permission is not set up yet. Please run the Supabase setup SQL."
          : "Request could not be submitted. Please try again."
      );
    } else {
      setRequests((current) => [data as MovieRequest, ...current]);
      setRequestTitle("");
      setRequestMessage("Movie request submitted successfully.");
      recordActivity("movie_request", undefined, { requestId: data.id });
    }
    setIsSubmitting(false);
  };

  const markNotificationsRead = async () => {
    if (!user || !supabase) return;
    const readAt = new Date().toISOString();
    setNotifications((current) => current.map((item) => ({ ...item, read_at: readAt })));
    await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("user_id", user.id)
      .is("read_at", null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-[1400px] px-4 pt-28 text-muted-foreground">
          Loading your account...
        </div>
      </main>
    );
  }

  if (!isConfigured || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center px-4 pt-20 text-center">
          <UserRound className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-foreground">
            {isConfigured ? "Login required" : "Login setup is incomplete"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isConfigured
              ? "Login to open your synced wishlist, history, and movie requests."
              : "Add your Supabase project keys to enable user accounts."}
          </p>
          {isConfigured && (
            <Button className="mt-6" onClick={() => void signInWithGoogle()}>
              Continue with Google
            </Button>
          )}
        </div>
        <Footer />
      </main>
    );
  }

  const displayName =
    (user.user_metadata.full_name as string | undefined) || user.email || "Onemovie User";
  const avatarUrl = user.user_metadata.avatar_url as string | undefined;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-foreground">{displayName}</h1>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 self-start"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </header>

        <section className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-4">
          {[
            { label: "Wishlist", value: wishlistIds.length, icon: Heart },
            { label: "Watched", value: history.length, icon: History },
            { label: "Requests", value: requests.length, icon: MessageSquarePlus },
            { label: "Activities", value: activityCount, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        {notifications.length > 0 && (
          <section className="border-t border-border py-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-foreground">Recent Notifications</h2>
              </div>
              {notifications.some((item) => !item.read_at) && (
                <Button variant="ghost" size="sm" onClick={() => void markNotificationsRead()}>
                  Mark all read
                </Button>
              )}
            </div>
            <div className="divide-y divide-border border-y border-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex gap-3 py-4">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notification.read_at ? "bg-muted" : "bg-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {continueWatching.length > 0 && (
          <section className="border-t border-border py-8">
            <div className="mb-5 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-foreground">Continue Watching</h2>
            </div>
            <VideoGrid videos={continueWatching} />
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="border-t border-border py-8">
            <h2 className="mb-5 text-xl font-semibold text-foreground">Recommended for You</h2>
            <VideoGrid videos={recommendations} />
          </section>
        )}

        <div className="grid gap-8 border-t border-border py-8 lg:grid-cols-2">
          <section>
            <div className="mb-5 flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-foreground">Request a Movie</h2>
            </div>
            <form onSubmit={submitMovieRequest} className="flex gap-2">
              <Input
                value={requestTitle}
                onChange={(event) => setRequestTitle(event.target.value)}
                placeholder="Enter movie or series name"
                minLength={2}
                maxLength={120}
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Request"}
              </Button>
            </form>
            {requestMessage && (
              <p className="mt-3 text-sm text-muted-foreground">{requestMessage}</p>
            )}
            <div className="mt-6 space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm"
                >
                  <span className="min-w-0 truncate text-foreground">{request.title}</span>
                  <span className="shrink-0 capitalize text-muted-foreground">
                    {request.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-5">
              {[
                ["email_notifications", "Email notifications"],
                ["new_release_notifications", "New release alerts"],
                ["request_status_notifications", "Movie request status updates"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label htmlFor={key}>{label}</Label>
                  <Switch
                    id={key}
                    checked={preferences[key as keyof Preferences]}
                    onCheckedChange={(checked) =>
                      void updatePreference(key as keyof Preferences, checked)
                    }
                  />
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              These choices control which alerts you want. Email delivery starts after the
              server-side mail provider is connected.
            </p>
          </section>
        </div>

        <div className="border-t border-border pt-6 text-sm text-muted-foreground">
          <Link href="/wishlist" className="hover:text-primary">
            Open full wishlist
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
