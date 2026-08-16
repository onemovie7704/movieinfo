"use client";

import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  videoId: string;
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({
  videoId,
  showLabel = false,
  className,
}: WishlistButtonProps) {
  const { isLoaded, isWishlisted, toggleWishlist } = useWishlist();
  const saved = isLoaded && isWishlisted(videoId);
  const label = saved ? "Remove from Wishlist" : "Add to Wishlist";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(videoId);
  };

  return (
    <Button
      type="button"
      variant={showLabel ? "outline" : "secondary"}
      size={showLabel ? "default" : "icon"}
      className={cn(
        !showLabel && "bg-black/75 text-white shadow-md hover:bg-black/90 hover:text-white",
        saved && "border-red-500/60 text-red-500 hover:text-red-500",
        className
      )}
      aria-label={label}
      aria-pressed={saved}
      title={label}
      onClick={handleClick}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
      {showLabel && <span>{saved ? "In Wishlist" : "Wishlist"}</span>}
    </Button>
  );
}
