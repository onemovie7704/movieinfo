import type { Metadata } from "next";
import { WishlistPageContent } from "@/components/wishlist-page-content";

export const metadata: Metadata = {
  title: "My Wishlist - Onemovie",
  description: "View the movies and web series saved to your Onemovie wishlist.",
  alternates: {
    canonical: "/wishlist",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
