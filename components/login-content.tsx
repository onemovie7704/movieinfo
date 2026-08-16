"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, Cloud, Heart, History, LogIn, Mail } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

const benefits = [
  { icon: Heart, text: "Sync your wishlist across devices" },
  { icon: History, text: "Continue watching from where you stopped" },
  { icon: Cloud, text: "Keep requests and preferences in your account" },
];

export function LoginContent() {
  const { user, isLoading, isConfigured, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMode, setEmailMode] = useState<"login" | "signup">("login");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailBusy, setEmailBusy] = useState(false);
  const searchParams = useSearchParams();
  const hasOAuthError = searchParams.get("error") === "oauth";

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailMessage(null);
    setEmailBusy(true);
    const result = emailMode === "login"
      ? await signInWithEmail(email.trim(), password)
      : await signUpWithEmail(email.trim(), password);
    setEmailBusy(false);
    if (result.error) setEmailMessage(result.error);
    else if (emailMode === "signup" && result.confirmationRequired) setEmailMessage("Account created. Check your email to confirm, then log in.");
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto flex min-h-[78vh] max-w-lg items-center px-4 pb-16 pt-24 sm:px-6">
        <section className="w-full rounded-lg border border-border bg-card p-6 text-center shadow-xl sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Login to Onemovie</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Browsing stays free. Login only saves your personal movie activity.
            </p>
          </div>

          <div className="mb-6 space-y-3">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {hasOAuthError && (
            <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm leading-relaxed text-red-200">
              Google login failed. Check the Supabase Google provider, site URL, and allowed
              callback URL, then try again.
            </div>
          )}

          {!isConfigured ? (
            <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm leading-relaxed text-yellow-200">
              Login code is ready, but Supabase keys are missing. Add
              <span className="font-mono"> NEXT_PUBLIC_SUPABASE_URL </span>
              and
              <span className="font-mono"> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY </span>
              to activate Google login.
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="h-4 w-4" aria-hidden="true" />
                You are logged in as {user.email}
              </div>
              <Button asChild className="w-full">
                <Link href="/account">Open My Account</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button className="w-full gap-2" disabled={isLoading} onClick={() => void signInWithGoogle()}>
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {isLoading ? "Checking session..." : "Continue with Google"}
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or email<span className="h-px flex-1 bg-border" /></div>
              <form className="space-y-3" onSubmit={handleEmailSubmit}>
                <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" type="password" required minLength={6} placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
                {emailMessage && <p className="text-sm text-yellow-300">{emailMessage}</p>}
                <Button className="w-full gap-2" type="submit" disabled={emailBusy}><Mail className="h-4 w-4" />{emailBusy ? "Please wait..." : emailMode === "login" ? "Login with Email" : "Create account"}</Button>
              </form>
              <button type="button" className="w-full text-center text-xs text-muted-foreground hover:text-foreground" onClick={() => { setEmailMode(emailMode === "login" ? "signup" : "login"); setEmailMessage(null); }}>{emailMode === "login" ? "Create a new email account" : "Already have an account? Log in"}</button>
            </div>
          )}

          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="text-foreground hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-foreground hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
