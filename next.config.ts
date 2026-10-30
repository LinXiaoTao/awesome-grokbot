import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    // GSC 404 export 2026-10-30 (233 URLs): almost all were locale-less /bot/:slug
    // for live bots, plus a few retired slugs under /:locale/bot/...
    // localeDetection stays off so Accept-Language is not negotiated and the
    // vercel.json "/" → "/en" permanent redirect stays authoritative.
    const locales = "en|zh|ja|ko|es|fr|de";
    return [
      // Retired slugs → nearest live bot (keep before the generic /bot/:slug rule)
      {
        source: `/:locale(${locales})/bot/product-lead`,
        destination: "/:locale/bot/mercury-product-lead",
        permanent: true,
      },
      {
        source: "/bot/product-lead",
        destination: "/en/bot/mercury-product-lead",
        permanent: true,
      },
      {
        source: `/:locale(${locales})/bot/firstmate-the-only-bot-you-talk-to`,
        destination: "/:locale/bot/firstmate",
        permanent: true,
      },
      {
        source: "/bot/firstmate-the-only-bot-you-talk-to",
        destination: "/en/bot/firstmate",
        permanent: true,
      },
      // Empty-description stub (GSC + sitemap slim) → category home
      {
        source: `/:locale(${locales})/bot/apps`,
        destination: "/:locale?category=engineering",
        permanent: true,
      },
      {
        source: "/bot/apps",
        destination: "/en?category=engineering",
        permanent: true,
      },
      // Bare /bot/:slug(+/) → English canonical for live bots
      {
        source: "/bot/:slug",
        destination: "/en/bot/:slug",
        permanent: true,
      },
      {
        source: "/bot/:slug/",
        destination: "/en/bot/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/favicon-:size.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/android-chrome-:size.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo-64.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/og-image.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
