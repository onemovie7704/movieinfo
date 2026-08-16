"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  basePath: string;
  showGenre?: boolean;
  showLanguage?: boolean;
  showYear?: boolean;
  showQuality?: boolean;
  showSort?: boolean;
  availableGenres?: string[];
  availableLanguages?: string[];
}

const years = ["2025", "2024", "2023", "2022", "2021", "2020"];
const qualities = ["4K", "HD", "SD"];
const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "A-Z" },
  { value: "year", label: "Year" },
];

const defaultGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Sci-Fi",
  "Thriller",
  "Ramayan",
  "Mahabharat",
  "Shree Krishna",
  "Mythology",
];

const defaultLanguages = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Japanese",
];

export function FilterBar({
  basePath,
  showGenre = true,
  showLanguage = true,
  showYear = true,
  showQuality = true,
  showSort = true,
  availableGenres = defaultGenres,
  availableLanguages = defaultLanguages,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentYear = searchParams.get("year") || "";
  const currentQuality = searchParams.get("quality") || "";
  const currentSort = searchParams.get("sort") || "latest";

  const hasActiveFilters =
    currentGenre || currentLanguage || currentYear || currentQuality;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(basePath);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showGenre && (
          <Select
            value={currentGenre || "all"}
            onValueChange={(value) => updateFilter("genre", value)}
          >
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {availableGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showLanguage && (
          <Select
            value={currentLanguage || "all"}
            onValueChange={(value) => updateFilter("language", value)}
          >
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showYear && (
          <Select
            value={currentYear || "all"}
            onValueChange={(value) => updateFilter("year", value)}
          >
            <SelectTrigger className="w-[120px] bg-secondary border-border">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showQuality && (
          <Select
            value={currentQuality || "all"}
            onValueChange={(value) => updateFilter("quality", value)}
          >
            <SelectTrigger className="w-[120px] bg-secondary border-border">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quality</SelectItem>
              {qualities.map((quality) => (
                <SelectItem key={quality} value={quality}>
                  {quality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showSort && (
          <Select
            value={currentSort}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger className="w-[130px] bg-secondary border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
