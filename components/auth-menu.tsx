"use client";

import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export function AuthMenu() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-md bg-muted" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="gap-2 px-2 sm:px-3">
        <Link href="/login" aria-label="Login">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      </Button>
    );
  }

  const avatarUrl = user.user_metadata.avatar_url as string | undefined;

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href="/account" aria-label="Open account" title="My Account">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserRound className="h-5 w-5" aria-hidden="true" />
        )}
      </Link>
    </Button>
  );
}
