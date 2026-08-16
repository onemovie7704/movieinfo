"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { AuthMenu } from "@/components/auth-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bollywood", label: "Bollywood" },
  { href: "/hollywood", label: "Hollywood" },
  { href: "/south-indian", label: "South Indian" },
  { href: "/web-series", label: "Web Series" },
  { href: "/cartoons", label: "Cartoons" },
  { href: "/action", label: "Action" },
  { href: "/comedy", label: "Comedy" },
];


const moreLinks = [
  { href: "/drama", label: "Drama" },
  { href: "/thriller", label: "Thriller" },
  { href: "/sci-fi", label: "Sci-Fi" },
  { href: "/ramayan", label: "Ramayan" },
  { href: "/mahabharat", label: "Mahabharat" },
  { href: "/shree-krishna", label: "Shree Krishna" },

];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="https://cdn.shopify.com/s/files/1/0649/9945/6854/files/one-movie-logo.png?v=1775500619"
              alt="OneMovie Logo"
              className="h-10 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
                More
              </button>
              <div className="absolute top-full left-0 mt-1 py-2 w-40 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mx-3 my-2 border-t border-border" />
                <a
                  href="/OneMovie.apk"
                  download="OneMovie.apk"
                  className="mx-2 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download App
                </a>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/wishlist" aria-label="Open Wishlist" title="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          <div className="hidden md:block">
            <AuthMenu />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Button asChild variant="ghost" size="icon">
              <Link href="/wishlist" aria-label="Open Wishlist" title="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <AuthMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false);
              }}
            >
              {isSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsSearchOpen(false);
              }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <SearchBar
              autoFocus
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {[...navLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                My Wishlist
              </Link>
              <a
                href="/OneMovie.apk"
                download="OneMovie.apk"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                Download App
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
