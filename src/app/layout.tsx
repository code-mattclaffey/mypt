import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Assistant",
  description: "Track your daily health metrics and get AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}