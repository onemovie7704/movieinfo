import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "DMCA | Onemovie",
  description:
    "DMCA Policy for Onemovie. Learn how to report copyright infringement.",
};

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          DMCA Policy
        </h1>

        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-2">Copyright Infringement</h2>
            <p className="text-muted-foreground">
              Onemovie respects the intellectual property rights of others. We do not host any media files on our servers. All content is provided by non-affiliated third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Takedown Request</h2>
            <p className="text-muted-foreground">
              If you believe your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please notify us. Provide the URL of the content in question so we can investigate and remove the links.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-muted-foreground">
              Please use our contact form or support email to submit your DMCA takedown notice. We aim to process all valid requests within 48 hours.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
