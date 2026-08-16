import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedPath = requestUrl.searchParams.get("next") || "/account";
  const nextPath = requestedPath.startsWith("/") ? requestedPath : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = supabase
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("Authentication is not configured") };

    if (!error) return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
  }
  return NextResponse.redirect(new URL("/login?error=oauth", requestUrl.origin));
}
