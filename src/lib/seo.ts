import type { Metadata } from "next";
import { SITE_URL, LOCALES, type Locale } from "@/lib/utils";

interface PageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  type = "website",
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${SITE_URL}/${loc}${path === "/" ? "" : path}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Awesome Grok Bot",
      locale,
      type,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function buildDirectoryJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Awesome Grok Bot",
    url: `${SITE_URL}/${locale}`,
    description:
      "Discover the best Grok Bots for work, coding, research, and everyday tasks.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/${locale}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBotJsonLd(
  bot: {
    name: string;
    description: string;
    slug: string;
    authorHandle?: string;
    installs: number;
  },
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: bot.name,
    description: bot.description,
    url: `${SITE_URL}/${locale}/bot/${bot.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    author: bot.authorHandle
      ? { "@type": "Person", name: bot.authorHandle }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: Math.max(bot.installs, 1),
    },
  };
}
