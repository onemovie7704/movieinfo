"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { WishlistProvider } from "@/hooks/use-wishlist";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </AuthProvider>
  );
}
