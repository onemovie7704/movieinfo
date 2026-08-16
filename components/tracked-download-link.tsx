"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import { useAuth } from "@/components/auth-provider";

interface TrackedDownloadLinkProps {
  children: ReactNode;
  href: string;
  movieId: string;
  source: string;
}

export function TrackedDownloadLink({
  children,
  href,
  movieId,
  source,
}: TrackedDownloadLinkProps) {
  const { recordActivity } = useAuth();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("Movie Download Click", { movieId, source });
        recordActivity("download_click", movieId, { source });
      }}
    >
      {children}
    </a>
  );
}
