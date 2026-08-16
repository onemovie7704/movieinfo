import Link from "next/link";
import { Film, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function VideoNotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <Film className="w-12 h-12 text-muted-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Video Not Found
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8">
            Sorry, the video you&apos;re looking for doesn&apos;t exist or may have been removed. Please check the URL or browse our collection for more amazing content.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Browse Movies
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
