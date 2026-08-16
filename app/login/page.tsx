import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginContent } from "@/components/login-content";

export const metadata: Metadata = {
  title: "Login - Onemovie",
  description: "Login to sync your wishlist, watch history, and movie requests.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
