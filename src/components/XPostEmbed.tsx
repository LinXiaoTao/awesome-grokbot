"use client";

import { useTranslations } from "next-intl";

interface XPostEmbedProps {
  url: string;
}

function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}

export default function XPostEmbed({ url }: XPostEmbedProps) {
  const t = useTranslations("bot");
  const tweetId = extractTweetId(url);

  if (!tweetId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted underline"
      >
        {t("viewOnX")}
      </a>
    );
  }

  return (
    <div className="max-w-lg overflow-hidden rounded-xl border border-border">
      <iframe
        src={`https://platform.x.com/embed/Tweet.html?id=${tweetId}&theme=light`}
        className="w-full border-0"
        height="400"
        allowFullScreen
        title={t("xPostTitle")}
        loading="lazy"
      />
    </div>
  );
}
