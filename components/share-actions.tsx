"use client";

import { Facebook, MessageCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareActionsProps {
  title: string;
}

export function ShareActions({ title }: ShareActionsProps) {
  const shareUrl = () => window.location.href;

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=560");
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: shareUrl() });
      return;
    }

    await navigator.clipboard.writeText(shareUrl());
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        onClick={shareNative}
        aria-label="Share movie"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() =>
          openShareWindow(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`,
          )
        }
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() =>
          openShareWindow(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl())}`,
          )
        }
        aria-label="Share on X"
        title="X"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() =>
          openShareWindow(
            `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl()}`)}`,
          )
        }
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
