import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account-dashboard";

export const metadata: Metadata = {
  title: "My Account - Onemovie",
  description: "Manage your Onemovie wishlist, history, requests, and notifications.",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
