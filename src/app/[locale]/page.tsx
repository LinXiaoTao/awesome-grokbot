import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BotExplorer } from "@/components/BotExplorer";
import { BotCrawlIndex } from "@/components/BotCrawlIndex";
import { bots } from "@/data/bots";
import {
  buildDirectoryJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import type { Locale } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: "/",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = buildDirectoryJsonLd(locale as Locale, bots);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <BotExplorer botCount={bots.length} />
        <BotCrawlIndex bots={bots} />
      </main>
      <Footer />
    </>
  );
}
