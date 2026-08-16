import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  TELEGRAM_CHANNEL_ID,
  TELEGRAM_OWNER_USER_ID,
  callTelegram,
  isValidWebhookSecret,
} from "@/lib/telegram-webhook";

export const runtime = "nodejs";
export const maxDuration = 30;

interface TelegramUser {
  id: number;
  first_name?: string;
  username?: string;
}

interface TelegramMessage {
  chat: { id: number };
  from?: TelegramUser;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

function getStatsClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  return url && secret
    ? createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
}

function hashUser(userId: number) {
  return createHash("sha256").update(String(userId)).digest("hex").slice(0, 32);
}

async function recordEvent(userId: number, eventType: string, metadata = {}) {
  const supabase = getStatsClient();
  if (!supabase) return;
  await supabase.from("telegram_bot_events").insert({
    user_hash: hashUser(userId),
    event_type: eventType,
    metadata,
  });
}

async function canSubmitSupportRequest(userId: number, eventType: string) {
  const supabase = getStatsClient();
  if (!supabase) return true;

  const { data, error } = await supabase
    .from("telegram_bot_events")
    .select("created_at")
    .eq("user_hash", hashUser(userId))
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return true;
  return Date.now() - new Date(data.created_at as string).getTime() >= 60_000;
}

async function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

async function deliverMovie(chatId: number, userId: number, messageId: string) {
  try {
    await callTelegram("copyMessage", {
      chat_id: chatId,
      from_chat_id: TELEGRAM_CHANNEL_ID,
      message_id: Number(messageId),
    });
    await recordEvent(userId, "delivery", { messageId });
  } catch (error) {
    console.error("Telegram movie delivery failed", error);
    await sendMessage(chatId, "Movie could not be sent. Please try again later.");
  }
}

function userLabel(user: TelegramUser) {
  return user.username ? `@${user.username}` : `${user.first_name || "User"} (${user.id})`;
}

async function sendStats(chatId: number) {
  const supabase = getStatsClient();
  if (!supabase) {
    await sendMessage(chatId, "Bot is online. Detailed stats need Supabase server variables.");
    return;
  }

  const { data, error } = await supabase.rpc("get_telegram_bot_stats");
  if (error || !data) {
    await sendMessage(chatId, "Bot is online. Stats table is not configured yet.");
    return;
  }

  const stats = data as Record<string, number>;
  await sendMessage(
    chatId,
    [
      "OneMovie Bot Stats",
      "",
      `Total unique users: ${stats.total_unique_users || 0}`,
      `Total bot starts: ${stats.total_starts || 0}`,
      `Movie requests: ${stats.total_movie_requests || 0}`,
      `Successful deliveries: ${stats.total_deliveries || 0}`,
      `Broken link reports: ${stats.total_reports || 0}`,
      "",
      `Today unique users: ${stats.today_unique_users || 0}`,
      `Today deliveries: ${stats.today_deliveries || 0}`,
    ].join("\n")
  );
}

async function handleMessage(message: TelegramMessage) {
  if (!message.from || !message.text) return;
  const text = message.text.trim();
  const chatId = message.chat.id;
  const user = message.from;

  const movieMatch = text.match(/^\/start(?:@\w+)?\s+m_(\d+)$/i);
  if (movieMatch) {
    await recordEvent(user.id, "movie_request", { messageId: movieMatch[1] });
    await deliverMovie(chatId, user.id, movieMatch[1]);
    return;
  }

  const reportMatch = text.match(/^\/start(?:@\w+)?\s+report_([A-Za-z0-9_-]+)$/i);
  if (reportMatch) {
    if (!(await canSubmitSupportRequest(user.id, "report"))) {
      await sendMessage(chatId, "Please wait one minute before sending another report.");
      return;
    }
    await sendMessage(
      TELEGRAM_OWNER_USER_ID,
      `Broken link report\nMovie ID: ${reportMatch[1]}\nFrom: ${userLabel(user)}`
    );
    await recordEvent(user.id, "report", { movieId: reportMatch[1] });
    await sendMessage(chatId, "Thanks. The broken link report has been sent.");
    return;
  }

  if (/^\/start(?:@\w+)?\s+request$/i.test(text)) {
    await sendMessage(chatId, "Send the movie name in this format:\n/request Movie Name");
    return;
  }

  if (/^\/start(?:@\w+)?\s+unavailable$/i.test(text)) {
    await sendMessage(chatId, "This movie is not available for download yet.");
    return;
  }

  const requestMatch = text.match(/^\/request(?:@\w+)?\s+(.{2,100})$/i);
  if (requestMatch) {
    if (!(await canSubmitSupportRequest(user.id, "content_request"))) {
      await sendMessage(chatId, "Please wait one minute before sending another request.");
      return;
    }
    const movieName = requestMatch[1].trim();
    await sendMessage(
      TELEGRAM_OWNER_USER_ID,
      `New movie request\nMovie: ${movieName}\nFrom: ${userLabel(user)}`
    );
    await recordEvent(user.id, "content_request", { movieName });
    await sendMessage(chatId, `Request received: ${movieName}`);
    return;
  }

  if (/^\/stats(?:@\w+)?$/i.test(text) && user.id === TELEGRAM_OWNER_USER_ID) {
    await sendStats(chatId);
    return;
  }

  if (/^\/start(?:@\w+)?$/i.test(text)) {
    await recordEvent(user.id, "start");
    await sendMessage(chatId, "Welcome to OneMovie Bot. Open a movie from the website.");
  }
}

export async function POST(request: NextRequest) {
  if (!isValidWebhookSecret(request.headers.get("x-telegram-bot-api-secret-token"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    if (update.message) await handleMessage(update.message);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, mode: "webhook" });
}
