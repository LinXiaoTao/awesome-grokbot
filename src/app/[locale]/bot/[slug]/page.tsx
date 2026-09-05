import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BotIcon } from "@/components/BotIcon";
import { IntegrationPill } from "@/components/IntegrationPill";
import { BotCard } from "@/components/BotCard";
import { PromptBox } from "@/components/PromptBox";
import XPostEmbed from "@/components/XPostEmbed";
import { Link } from "@/i18n/routing";
import { bots } from "@/data/bots";
import { buildBotJsonLd, buildPageMetadata } from "@/lib/seo";
import { getBotBySlug, getRelatedBots, LOCALES, type Locale } from "@/lib/utils";
import { getCategoryStyle } from "@/lib/category-styles";

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
  const tFilters = await getTranslations("filters");
  const relatedBots = getRelatedBots(bots, bot);
  const jsonLd = buildBotJsonLd(bot, locale as Locale);

  const categoryLabel = tFilters.has(bot.category)
    ? tFilters(bot.category)
    : bot.category;
  const categoryStyle = getCategoryStyle(bot.category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="px-4 py-10 md:py-16">
        <div className="mx-auto max-w-container">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t("backToDiscover")}
          </Link>

          <article className="rounded-2xl border border-border/80 bg-white p-6 shadow-xs md:p-10">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <BotIcon
                    name={bot.name}
                    shape={bot.shape}
                    color={bot.color}
                    slug={bot.slug}
                    id={bot.id}
                    size="lg"
                  />
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${categoryStyle.badge}`}
                  >
                    {categoryLabel}
                  </span>
                  {bot.createdAt && (
                    <span className="text-xs text-neutral-400">
                      {bot.createdAt}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
                    {bot.name}
                  </h1>
                  {bot.authorHandle && (
                    <p className="mt-1.5 text-sm font-medium text-neutral-500">
                      {t("by")}{" "}
                      <span className="font-semibold text-neutral-800">
                        {bot.authorHandle}
                      </span>
                    </p>
                  )}
                </div>

                <p className="mt-6 max-w-prose text-base leading-relaxed text-neutral-700 md:text-lg">
                  {bot.longDescription ?? bot.description}
                </p>

                {bot.integrations.length > 0 && (
                  <div className="mt-6">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {tFilters("allIntegrations")}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {bot.integrations.map((integration) => (
                        <IntegrationPill key={integration} name={integration} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  <a
                    href={bot.xaiBotUrl ?? "https://x.ai/bot"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-black hover:shadow-card-hover active:scale-[0.99] sm:w-auto"
                  >
                    <span>{t("install")}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <p className="text-xs text-neutral-500">
                    {t("downloadGrok")}{" "}
                    <a
                      href="https://x.ai/bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neutral-800 underline underline-offset-2 transition-colors hover:text-black"
                    >
                      {t("download")}
                    </a>
                  </p>
                </div>

                <PromptBox
                  name={bot.name}
                  category={bot.category}
                  description={bot.description}
                  longDescription={bot.longDescription}
                />
              </div>

              {bot.xPostUrl && (
                <div className="mt-6 lg:mt-0">
                  <XPostEmbed url={bot.xPostUrl} />
                </div>
              )}
            </div>
          </article>

          {relatedBots.length > 0 && (
            <section className="mt-16">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  {t("relatedBots")}
                </h2>
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBots.map((related) => (
                  <BotCard key={related.id} bot={related} />
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
