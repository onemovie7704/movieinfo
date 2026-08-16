import { NextResponse, type NextRequest } from "next/server";
import {
  callTelegram,
  getTelegramToken,
  getTelegramWebhookSecret,
} from "@/lib/telegram-webhook";

function isAuthorized(request: NextRequest) {
  const adminToken = process.env.ADMIN_UPLOAD_TOKEN;
  return Boolean(adminToken && request.headers.get("x-admin-token") === adminToken);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const info = await callTelegram<Record<string, unknown>>("getWebhookInfo");
    return NextResponse.json({ success: true, info });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const secretToken = getTelegramWebhookSecret();
  if (!getTelegramToken() || !secretToken) {
    return NextResponse.json(
      { success: false, error: "Telegram or admin environment variables are missing" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { siteUrl?: string };
    const origin = body.siteUrl || request.nextUrl.origin;
    const url = new URL("/api/telegram/webhook", origin);
    if (url.protocol !== "https:") {
      return NextResponse.json(
        { success: false, error: "Webhook requires a live HTTPS site" },
        { status: 400 }
      );
    }

    await callTelegram("setWebhook", {
      url: url.toString(),
      secret_token: secretToken,
      allowed_updates: ["message"],
      drop_pending_updates: false,
    });
    const info = await callTelegram<Record<string, unknown>>("getWebhookInfo");
    return NextResponse.json({ success: true, webhookUrl: url.toString(), info });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Webhook setup failed" },
      { status: 500 }
    );
  }
}
