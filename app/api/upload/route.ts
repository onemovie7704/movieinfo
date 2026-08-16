import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_UPLOAD_TOKEN;
    const providedToken = request.headers.get("x-admin-token");

    if (!adminToken || providedToken !== adminToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, videoUrl } = body;

    // ✅ Validation
    if (!title || !videoUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Video URL required" },
        { status: 400 }
      );
    }

    try {
      new URL(videoUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid video URL" },
        { status: 400 }
      );
    }

    // 🔥 TOKEN (isko .env me rakhna better hai)
    const TOKEN = process.env.TELEGRAM_UPLOAD_BOT_TOKEN;
    const CHANNEL = process.env.TELEGRAM_CHANNEL_ID;

    if (!TOKEN || !CHANNEL) {
      return NextResponse.json(
        { success: false, error: "Upload service is not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendVideo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHANNEL,
          video: videoUrl,
          caption: title,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { success: false, error: data.description },
        { status: 500 }
      );
    }

    const messageId = data.result.message_id;
    const telegramLink = `https://t.me/onemoviedownloa/${messageId}`;

    return NextResponse.json({
      success: true,
      telegramLink,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// ❌ Optional: handle GET
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST method" },
    { status: 405 }
  );
}
