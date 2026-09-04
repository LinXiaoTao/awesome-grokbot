import type { Metadata } from "next";
import { SITE_URL, LOCALES, type Locale } from "@/lib/utils";
import type { Bot } from "@/types";

interface PageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

const DEFAULT_KEYWORDS = [
  "Grok Bot",
  "Grok Bots",
  "Awesome Grok Bot",
  "xAI Grok",
  "Grok AI",
  "Grok Bot Templates",
  "AI Agents",
  "AI Assistants",
  "xAI",
  "AI Workflow Automation",
  "Cursor Agents",
  "Developer Tools",
];

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  type = "website",
}: PageMetadataOptions): Metadata {
  const cleanPath = path === "/" ? "" : path;
  const url = `${SITE_URL}/${locale}${cleanPath}`;

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${SITE_URL}/${loc}${cleanPath}`;
  }
  languages["x-default"] = `${SITE_URL}/en${cleanPath}`;

  const alternateLocales = LOCALES.filter((loc) => loc !== locale);

  return {
    title: { absolute: title },
    description,
    keywords: DEFAULT_KEYWORDS,
    authors: [
      { name: "LinXiaoTao", url: "https://github.com/LinXiaoTao" },
      { name: "Awesome Grok Bot Community", url: SITE_URL },
    ],
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
      alternateLocale: alternateLocales,
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
      creator: "@linxiaotao1993",
      site: "@linxiaotao1993",
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function buildDirectoryJsonLd(locale: Locale, botsList?: Bot[]) {
  const items = (botsList ?? []).slice(0, 30).map((bot, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: bot.name,
    description: bot.description,
    url: `${SITE_URL}/${locale}/bot/${bot.slug}`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/${locale}#website`,
        name: "Awesome Grok Bot",
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        description:
          "Discover the best Grok Bots for work, coding, research, and everyday tasks.",
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Awesome Grok Bot",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/og-image.png`,
          },
          sameAs: [
            "https://github.com/LinXiaoTao/awesome-grokbot",
            "https://x.com/linxiaotao1993",
          ],
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/${locale}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      ...(items.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${SITE_URL}/${locale}#itemlist`,
              name: "Featured Grok Bots",
              itemListElement: items,
            },
          ]
        : []),
    ],
  };
}

export function buildBotJsonLd(bot: Bot, locale: Locale) {
  const botUrl = `${SITE_URL}/${locale}/bot/${bot.slug}`;
  const categoryName =
    bot.category.charAt(0).toUpperCase() + bot.category.slice(1);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${botUrl}#software`,
        name: bot.name,
        description: bot.longDescription ?? bot.description,
        url: botUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        datePublished: bot.createdAt,
        image: `${SITE_URL}/og-image.png`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList:
          bot.integrations.length > 0
            ? bot.integrations.join(", ")
            : undefined,
        author: bot.authorHandle
          ? {
              "@type": "Person",
              name: bot.author ?? bot.authorHandle,
              url: `https://x.com/${bot.authorHandle.replace(/^@/, "")}`,
            }
          : {
              "@type": "Organization",
              name: "xAI Community",
            },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${botUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryName,
            item: `${SITE_URL}/${locale}?category=${bot.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: bot.name,
            item: botUrl,
          },
        ],
      },
    ],
  };
}
