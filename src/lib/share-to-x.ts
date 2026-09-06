const TWEET_INTENT_BASE = "https://x.com/intent/tweet";

export function buildTweetIntentUrl(text: string, url?: string): string {
  const params = new URLSearchParams();
  params.set("text", text);
  if (url) {
    params.set("url", url);
  }
  return `${TWEET_INTENT_BASE}?${params.toString()}`;
}

export function openTweetIntent(intentUrl: string): void {
  const width = 600;
  const height = 400;
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  window.open(
    intentUrl,
    "share-on-x",
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
  );
}
