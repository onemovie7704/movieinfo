"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthChangeEvent,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  supabase: SupabaseClient | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: () => Promise<{ error: string | null }>;
  signUpWithEmail: () => Promise<{ error: string | null; confirmationRequired: boolean }>;
  signOut: () => Promise<void>;
  recordActivity: (eventType: string, movieId?: string, metadata?: Record<string, unknown>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      }
    );

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
  }, [supabase]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, [supabase]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase is not configured.", confirmationRequired: false };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
    return { error: error?.message ?? null, confirmationRequired: !error && !data.session };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const recordActivity = useCallback(
    (eventType: string, movieId?: string, metadata: Record<string, unknown> = {}) => {
      if (!supabase || !user) return;
      void supabase.from("user_activity").insert({
        user_id: user.id,
        event_type: eventType,
        movie_id: movieId || null,
        metadata,
      });
    },
    [supabase, user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        supabase,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        recordActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
