"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bot, CheckCircle, Loader2, Download, Link2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadResponse {
  success: boolean;
  telegramLink?: string;
  error?: string;
}

interface WebhookResponse {
  success: boolean;
  webhookUrl?: string;
  error?: string;
}

export default function AdminPanel() {
  const [accessToken, setAccessToken] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [isConfiguringWebhook, setIsConfiguringWebhook] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": accessToken,
        },
        body: JSON.stringify({ title, videoUrl }),
      });

      const data: UploadResponse = await res.json();
      setResponse(data);

      if (data.success) {
        setTitle("");
        setVideoUrl("");
      }
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const configureWebhook = async () => {
    setIsConfiguringWebhook(true);
    setWebhookResponse(null);
    try {
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": accessToken,
        },
        body: JSON.stringify({}),
      });
      setWebhookResponse((await res.json()) as WebhookResponse);
    } catch (error) {
      setWebhookResponse({
        success: false,
        error: error instanceof Error ? error.message : "Webhook setup failed",
      });
    } finally {
      setIsConfiguringWebhook(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Upload movies to your streaming platform</p>
        </div>

        {/* Main Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Upload Movie</CardTitle>
            <CardDescription>Add a new movie to your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accessToken" className="text-slate-200">
                  Admin Access Key
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  autoComplete="current-password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-600 bg-slate-700/50 text-white"
                />
              </div>

              {/* Movie Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">
                  Movie Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter movie title (e.g., The Dark Knight Returns)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>

              {/* Video URL Input */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-slate-200">
                  Video URL (MP4 Link)
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://example.com/movie.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>

              {/* Upload Button */}
              <Button
                type="submit"
                disabled={isLoading || !accessToken || !title.trim() || !videoUrl.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold h-10"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? "Uploading..." : "Upload Movie"}
              </Button>
            </form>

            {/* Success Response */}
            {response?.success && response?.telegramLink && (
              <div className="mt-6 space-y-4 p-4 rounded-lg bg-green-950/30 border border-green-800/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-400 mb-1">Upload Successful!</h3>
                    <p className="text-sm text-green-300/80 mb-3">
                      Your movie has been uploaded successfully.
                    </p>
                  </div>
                </div>

                {/* Telegram Link Display */}
                <div className="bg-slate-700/50 rounded p-3 border border-slate-600">
                  <p className="text-xs text-slate-400 mb-2">Telegram Download Link:</p>
                  <div className="flex items-center gap-2 text-slate-200 break-all text-sm">
                    <Link2 className="w-4 h-4 flex-shrink-0 text-orange-500" />
                    <code className="bg-slate-800 px-2 py-1 rounded text-xs flex-1 overflow-auto">
                      {response.telegramLink}
                    </code>
                  </div>
                </div>

                {/* Download Button */}
                <a
                  href={response.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Movie
                  </Button>
                </a>
              </div>
            )}

            {/* Error Response */}
            {response?.success === false && (
              <Alert className="mt-6 border-red-800/50 bg-red-950/30">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-300 ml-2">
                  {response.error || "An error occurred during upload"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Bot className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Telegram Bot Hosting
            </CardTitle>
            <CardDescription>
              Connect Telegram to this live site so the bot works without your computer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!accessToken || isConfiguringWebhook}
              onClick={() => void configureWebhook()}
            >
              {isConfiguringWebhook ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Bot className="h-4 w-4" aria-hidden="true" />
              )}
              {isConfiguringWebhook ? "Connecting..." : "Enable 24/7 Bot Webhook"}
            </Button>

            {webhookResponse?.success && (
              <Alert className="border-green-800/50 bg-green-950/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="ml-2 text-green-300">
                  Bot webhook connected to {webhookResponse.webhookUrl}
                </AlertDescription>
              </Alert>
            )}
            {webhookResponse?.success === false && (
              <Alert className="border-red-800/50 bg-red-950/30">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="ml-2 text-red-300">
                  {webhookResponse.error || "Webhook setup failed"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-lg">How it Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 min-w-6">1.</span>
                <span>Enter the movie title and MP4 video URL</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 min-w-6">2.</span>
                <span>Click the Upload button to submit</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 min-w-6">3.</span>
                <span>Receive a Telegram download link</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 min-w-6">4.</span>
                <span>Share or download the movie using the link</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
