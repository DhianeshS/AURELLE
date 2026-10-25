import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "AURELLE — Make space for your best self",
  description:
    "An elegant, minimal personal productivity platform for daily habits, deep work tasks, strategic goals, and intentional routines.",
  keywords: [
    "productivity",
    "habit tracker",
    "minimalist task manager",
    "daily routine",
    "goals and milestones",
    "Aurelle",
  ],
  authors: [{ name: "Aurelle Studio" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AURELLE",
  },
};

export const viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
