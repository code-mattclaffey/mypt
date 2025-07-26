import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyPT.ai - AI Personal Trainer",
  description: "AI-powered health tracking with personalized fitness recommendations. Track your progress, get insights, and achieve your fitness goals.",
  keywords: "AI, fitness, health, personal trainer, weight loss, calorie tracking, step counter",
  authors: [{ name: "MyPT.ai" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title: "MyPT.ai - AI Personal Trainer",
    description: "AI-powered health tracking with personalized fitness recommendations",
    type: "website",
    locale: "en_US"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}