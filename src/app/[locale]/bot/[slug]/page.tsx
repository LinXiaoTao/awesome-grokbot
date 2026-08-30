import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IntegrationPill } from "@/components/IntegrationPill";
import { BotCard } from "@/components/BotCard";
import XPostEmbed from "@/components/XPostEmbed";
import { Link } from "@/i18n/routing";
import { bots } from "@/data/bots";
import { buildBotJsonLd, buildPageMetadata } from "@/lib/seo";
import { getBotBySlug, getRelatedBots, LOCALES, type Locale } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return bots.flatMap((bot) =>
    LOCALES.map((locale) => ({
      locale,
      slug: bot.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const bot = getBotBySlug(bots, slug);

  if (!bot) {
    return { title: "Bot Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    title: t("botTitle", { name: bot.name }),
    description: t("botDescription", { description: bot.description }),
    path: `/bot/${bot.slug}`,
    type: "article",
  });
}

export default async function BotDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const bot = getBotBySlug(bots, slug);
  if (!bot) {
    notFound();
  }

  const t = await getTranslations("bot");
  const relatedBots = getRelatedBots(bots, bot);
  const jsonLd = buildBotJsonLd(bot, locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="px-4 py-12 md:py-20">
        <div className="mx-auto max-w-container">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("backToDiscover")}
          </Link>

          <article className="rounded-card border border-border bg-white p-6 md:p-10">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div>
                <div>
                  <h1 className="text-3xl font-bold text-black md:text-4xl">
                    {bot.name}
                  </h1>
                  {bot.authorHandle && (
                    <p className="mt-2 text-muted">
                      {t("by")} {bot.authorHandle}
                    </p>
                  )}
                </div>

                <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
                  {bot.longDescription ?? bot.description}
                </p>

                {bot.integrations.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {bot.integrations.map((integration) => (
                      <IntegrationPill key={integration} name={integration} />
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <a
                    href={bot.xaiBotUrl ?? "https://x.ai/bot"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {t("install")}
                  </a>
                  <p className="mt-3 text-sm text-muted">
                    {t("downloadGrok")}{" "}
                    <a
                      href="https://x.ai/bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-black underline underline-offset-2 transition-colors hover:text-muted"
                    >
                      {t("download")}
                    </a>
                  </p>
                </div>
              </div>

              {bot.xPostUrl && (
                <div className="mt-8 lg:mt-0">
                  <XPostEmbed url={bot.xPostUrl} />
                </div>
              )}
            </div>
          </article>

          {relatedBots.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-black">
                {t("relatedBots")}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBots.map((related, index) => (
                  <BotCard key={related.id} bot={related} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
