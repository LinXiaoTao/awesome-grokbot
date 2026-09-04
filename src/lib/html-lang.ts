import type { Locale } from "@/lib/utils";

const HTML_LANG: Record<Locale, string> = {
  en: "en",
  zh: "zh-Hans",
  ja: "ja",
  ko: "ko",
  es: "es",
  fr: "fr",
  de: "de",
};

export function toHtmlLang(locale: string): string {
  return HTML_LANG[locale as Locale] ?? "en";
}
