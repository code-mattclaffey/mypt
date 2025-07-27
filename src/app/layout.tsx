import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HealthSync - AI Health Insights",
  description: "Sync your health data with AI-powered insights. Track progress, get personalized recommendations, and achieve your wellness goals.",
  keywords: "AI, fitness, health, personal trainer, weight loss, calorie tracking, step counter",
  authors: [{ name: "MyPT.ai" }],
  themeColor: "#3b82f6",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  openGraph: {
    title: "HealthSync - AI Health Insights",
    description: "Sync your health data with AI-powered insights and personalized recommendations",
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}