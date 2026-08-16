import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "FAQ | Onemovie",
  description:
    "Frequently Asked Questions (FAQ) for Onemovie. Find answers about streaming, downloading, and using our platform.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Frequently Asked Questions (FAQ)
        </h1>

        <p className="text-muted-foreground mb-8">
          Find answers to common questions about using Onemovie below.
        </p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Is Onemovie completely free to use?</h2>
            <p className="text-muted-foreground">
              Yes, Onemovie is completely free. You can browse and find links to your favorite movies and web series without any subscription fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Does Onemovie host any videos on its servers?</h2>
            <p className="text-muted-foreground">
              No, we do not host any media files on our servers. All videos and files are hosted on non-affiliated third-party services and platforms. We only provide links to content available elsewhere on the internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How do I download a movie?</h2>
            <p className="text-muted-foreground">
              On the movie details page, click the "Download Now" button. This will safely redirect you to our Telegram channel or a secure link where you can download the requested file.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. How can I request a movie or web series that is not on the site?</h2>
            <p className="text-muted-foreground">
              You can request new movies or web series by joining our Telegram channel and sending a message to the admins. We try our best to fulfill all user requests.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Why are some links broken or not working?</h2>
            <p className="text-muted-foreground">
              Since we rely on third-party servers, files can sometimes be deleted due to copyright claims or server issues. If you find a broken link, please let us know via Telegram, and we will try to update it as soon as possible.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
