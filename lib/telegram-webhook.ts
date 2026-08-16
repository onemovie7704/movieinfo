import { createHash, timingSafeEqual } from "node:crypto";

export const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "-1003845134502";
export const TELEGRAM_OWNER_USER_ID = Number(process.env.TELEGRAM_OWNER_USER_ID || "990444100");

export function getTelegramToken() {
  return process.env.TELEGRAM_BOT_TOKEN || "";
}

export function getTelegramWebhookSecret() {
  if (process.env.TELEGRAM_WEBHOOK_SECRET) return process.env.TELEGRAM_WEBHOOK_SECRET;

  const token = getTelegramToken();
  if (!token) return "";

  return createHash("sha256").update(`onemovie-webhook:${token}`).digest("hex");
}

export function isValidWebhookSecret(receivedSecret: string | null) {
  const expectedSecret = getTelegramWebhookSecret();
  if (!receivedSecret || !expectedSecret) return false;

  const received = Buffer.from(receivedSecret);
  const expected = Buffer.from(expectedSecret);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function callTelegram<T = unknown>(
  method: string,
  body: Record<string, unknown> = {}
): Promise<T> {
  const token = getTelegramToken();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const result = (await response.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram ${method} failed`);
  }

  return result.result as T;
}
