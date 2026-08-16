# Telegram Webhook Setup

The Telegram bot can run inside Vercel using `app/api/telegram/webhook/route.ts`.
This replaces the local `bot.js` polling process, so the computer can be turned off.

## Required Vercel variables

Add these in **Vercel Project > Settings > Environment Variables** for Production:

```env
ADMIN_UPLOAD_TOKEN=your-long-admin-key
TELEGRAM_BOT_TOKEN=your-botfather-token
TELEGRAM_CHANNEL_ID=-1003845134502
TELEGRAM_OWNER_USER_ID=990444100
```

`TELEGRAM_WEBHOOK_SECRET` is optional. If omitted, the application safely derives one from
the Telegram bot token. Never use a `NEXT_PUBLIC_` prefix for these variables.

## Enable the webhook

1. Redeploy the Production site after adding the variables.
2. Open `https://www.onemovie.in/admin`.
3. Enter the same `ADMIN_UPLOAD_TOKEN` in **Admin Access Key**.
4. Click **Enable 24/7 Bot Webhook**.
5. Confirm the success message contains
   `https://www.onemovie.in/api/telegram/webhook`.

Once enabled, do not run `node bot.js` against the same bot token. Telegram allows either
polling or a webhook, not both at the same time.
