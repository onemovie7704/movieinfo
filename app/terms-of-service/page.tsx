import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Onemovie",
  description:
    "Read the Terms of Service for Onemovie. Learn about the rules and guidelines for using our platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Terms of Service
        </h1>

        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily view the materials on Onemovie for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on Onemovie are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall Onemovie or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
