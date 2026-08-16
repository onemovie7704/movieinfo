import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  browse: [
    { href: "/bollywood", label: "Bollywood" },
    { href: "/hollywood", label: "Hollywood" },
    { href: "/south-indian", label: "South Indian" },
    { href: "/web-series", label: "Web Series" },
    { href: "/cartoons", label: "Cartoons" },
  ],
  genres: [
    { href: "/action", label: "Action" },
    { href: "/comedy", label: "Comedy" },
    { href: "/drama", label: "Drama" },
    { href: "/thriller", label: "Thriller" },
    { href: "/sci-fi", label: "Sci-Fi" },

  ],

  support: [
    
    { href: "/faq", label: "FAQ" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/dmca", label: "DMCA" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="https://cdn.shopify.com/s/files/1/0649/9945/6854/files/one-movie-logo.png?v=1775500619"
                alt="OneMovie Logo"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Your ultimate destination for streaming movies and web series. Watch the latest Bollywood, Hollywood, and South Indian movies in HD quality.
            </p>
            {/* <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Browse</h3>
            <ul className="space-y-2">
              {footerLinks.browse.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              {footerLinks.genres.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} Onemovie. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
}
