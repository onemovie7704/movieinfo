import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Home, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found - Onemovie',
  description: 'The page you&apos;re looking for doesn&apos;t exist. Return to home or search for movies.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* 404 Error Code */}
            <div className="mb-6">
              <h1 className="text-9xl md:text-[120px] font-bold text-primary opacity-20">404</h1>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Oops! Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              The movie or page you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Movies
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
              <Link href="/bollywood" className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <h3 className="font-semibold text-foreground mb-2">Bollywood</h3>
                <p className="text-sm text-muted-foreground">Browse latest Bollywood movies</p>
              </Link>
              <Link href="/hollywood" className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <h3 className="font-semibold text-foreground mb-2">Hollywood</h3>
                <p className="text-sm text-muted-foreground">Explore Hollywood films</p>
              </Link>
              <Link href="/south-indian" className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <h3 className="font-semibold text-foreground mb-2">South Indian</h3>
                <p className="text-sm text-muted-foreground">Discover South Indian movies</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
