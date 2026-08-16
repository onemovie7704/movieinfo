"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Film, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { videos, type Video } from "@/data/videos";
import { generateSlug } from "@/lib/seo-utils";

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ className, onClose, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Video[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter videos based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.category.toLowerCase().includes(query.toLowerCase()) ||
          video.genre.some((g) =>
            g.toLowerCase().includes(query.toLowerCase())
          ) ||
          video.language.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const selected = suggestions[selectedIndex];
        router.push(`/movie/${selected.slug || generateSlug(selected.title)}`);
        setIsOpen(false);
        setQuery("");
        onClose?.();
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const trendingSearches = ["Action", "Bollywood", "Cartoon", "Hollywood", "Comedy"];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search movies, shows, genres..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 bg-secondary border-border w-full"
          autoFocus={autoFocus}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {suggestions.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                Search Results
              </div>
              {suggestions.map((video, index) => (
                <Link
                  key={video.id}
                  href={`/movie/${video.slug || generateSlug(video.title)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    onClose?.();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 hover:bg-secondary transition-colors ${
                    index === selectedIndex ? "bg-secondary" : ""
                  }`}
                >
                  <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <img
                      src={video.poster}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {video.category} &bull; {video.year} &bull; {video.language}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-primary font-medium">
                        {video.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        &bull; {video.quality}
                      </span>
                    </div>
                  </div>
                  <Film className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
              {query.trim() && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="flex items-center gap-2 px-3 py-3 border-t border-border hover:bg-secondary transition-colors text-primary"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    See all results for &quot;{query}&quot;
                  </span>
                </Link>
              )}
            </div>
          ) : query.trim() ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for a different movie or genre
              </p>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <TrendingUp className="w-3 h-3" />
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
