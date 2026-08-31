import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const GA_ID = "G-0SYLDM57RR";
const ADSENSE_CLIENT = "ca-pub-1916766675410622";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://awsomebot.com",
  ),
  title: {
    default: "Awesome Grok Bot — Curated Grok Bot Directory",
    template: "%s | Awesome Grok Bot",
  },
  description:
    "Discover the best Grok Bots for work, coding, research, and everyday tasks. A curated directory of community-built Grok Bots and AI agent templates.",
  keywords: [
    "Grok Bot",
    "Grok Bots",
    "Awesome Grok Bot",
    "xAI Grok",
    "Grok AI",
    "Grok Bot Templates",
    "AI Agents",
    "AI Assistants",
    "xAI",
    "AI Directory",
  ],
  authors: [{ name: "LinXiaoTao", url: "https://github.com/LinXiaoTao" }],
  creator: "LinXiaoTao",
  publisher: "Awesome Grok Bot",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    title: "Awesome Grok Bot — Curated Grok Bot Directory",
    description:
      "Discover the best Grok Bots for work, coding, research, and everyday tasks. A curated directory of community-built Grok Bots and AI agent templates.",
    siteName: "Awesome Grok Bot",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Awesome Grok Bot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awesome Grok Bot — Curated Grok Bot Directory",
    description:
      "Discover the best Grok Bots for work, coding, research, and everyday tasks.",
    creator: "@linxiaotao1993",
    site: "@linxiaotao1993",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="beforeInteractive"
        />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
