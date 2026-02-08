import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmic Connections",
  description: "Find your cosmic match through Numerology, Western Astrology, and Chinese Zodiac compatibility",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
