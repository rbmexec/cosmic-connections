import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic, Noto_Sans_SC, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import AuthProvider from "@/components/AuthProvider";
import { SubscriptionProvider } from "@/lib/subscription-context";
import { NotificationProvider } from "@/lib/notification-context";
import { OverlayProvider } from "@/lib/overlay-context";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic", weight: ["400", "600", "700"] });
const notoSC = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-noto-sc", weight: ["400", "600", "700"] });
const notoJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-jp", weight: ["400", "600", "700"] });
const notoKR = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: {
    default: "astr — Find Your Cosmic Match",
    template: "%s | astr",
  },
  description: "Discover deep compatibility through Numerology, Western Astrology, and Chinese Zodiac. Meet people who align with your cosmic blueprint.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "astr",
  },
  openGraph: {
    title: "astr — Find Your Cosmic Match",
    description: "Discover deep compatibility through Numerology, Western Astrology, and Chinese Zodiac.",
    siteName: "astr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "astr — Find Your Cosmic Match",
    description: "Discover deep compatibility through Numerology, Western Astrology, and Chinese Zodiac.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const fontVars = [
    inter.variable,
    notoArabic.variable,
    notoSC.variable,
    notoJP.variable,
    notoKR.variable,
  ].join(' ');

  return (
    <html lang={locale} dir={dir} className={fontVars}>
      <body className="antialiased min-h-[100dvh] overflow-x-hidden">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <SubscriptionProvider>
              <NotificationProvider>
                <OverlayProvider>
                  {children}
                </OverlayProvider>
              </NotificationProvider>
            </SubscriptionProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
