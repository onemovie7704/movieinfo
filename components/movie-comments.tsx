"use client";
import { useEffect, useState } from "react";
import { DiscussionEmbed } from "disqus-react";

interface MovieCommentsProps {
  slug: string;
  title: string;
}

export function MovieComments({ slug, title }: MovieCommentsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const disqusShortname = "onemovie-2";

  const disqusConfig = {
    url: `https://onemovie.in/movie/${slug}`,
    identifier: slug,
    title: title,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="mt-10 p-4 sm:p-6 rounded-xl border w-full mx-auto" style={{ backgroundColor: "rgb(15, 15, 15)", borderColor: "rgb(38, 38, 38)", colorScheme: 'dark' }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: "rgb(255, 255, 255)" }}>Leave a Comment</h3>
      {isMounted && (
        <div style={{ backgroundColor: "rgb(15, 15, 15)", color: "rgb(255, 255, 255)" }} className="rounded-lg">
          <DiscussionEmbed
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      )}
    </div>
  );
}