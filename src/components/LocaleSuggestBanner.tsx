"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { LOCALE_NAMES, type Locale } from "@/lib/utils";
import { getLocaleSuggestBannerCopy } from "@/i18n/locale-suggest-banner";
import { Check, ChevronDown, X } from "lucide-react";

const DISMISSED_KEY = "apple_style_lang_banner_dismissed";

export function LocaleSuggestBanner() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const [targetLocale, setTargetLocale] = useState<Locale>(currentLocale);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === "1") {
        return;
      }

      const browserLangs =
        navigator.languages && navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language || ""];

      let matched: Locale | null = null;
      for (const raw of browserLangs) {
        const lang = raw.toLowerCase().split("-")[0];
        if (routing.locales.includes(lang as Locale)) {
          matched = lang as Locale;
          break;
        }
      }

      if (matched && matched !== currentLocale) {
        setTargetLocale(matched);
        setIsVisible(true);
      }
    } catch {
      // Ignore in environments where sessionStorage or navigator is unavailable
    }
  }, [currentLocale]);

  if (!isVisible) return null;

  const bannerCopy = getLocaleSuggestBannerCopy(targetLocale);

  return (
    <aside
      role="region"
      aria-label={bannerCopy.regionLabel}
      className="relative z-50 w-full border-b border-[#d2d2d7] bg-[#f5f5f7] text-xs text-[#1d1d1f]"
    >
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <p className="font-normal text-[#1d1d1f]">{bannerCopy.prompt}</p>

        <div className="flex items-center gap-2.5">
          <div className="relative inline-flex items-center rounded-lg border border-[#d2d2d7] bg-white px-7 py-1 shadow-sm">
            <Check className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-[#1d1d1f]" />
            <select
              value={targetLocale}
              onChange={(e) => setTargetLocale(e.target.value as Locale)}
              aria-label={bannerCopy.selectLabel}
              className="cursor-pointer appearance-none bg-transparent pr-1 font-medium text-[#1d1d1f] outline-none"
            >
              {routing.locales.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_NAMES[l as Locale]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#86868b]" />
          </div>

          <Link
            href={pathname}
            locale={targetLocale}
            hrefLang={targetLocale}
            onClick={() => {
              setIsVisible(false);
              sessionStorage.setItem(DISMISSED_KEY, "1");
            }}
            className="inline-flex min-h-[30px] items-center justify-center rounded-lg bg-[#1d1d1f] px-3.5 font-medium text-white transition-colors hover:bg-[#333336]"
          >
            {bannerCopy.continue}
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              sessionStorage.setItem(DISMISSED_KEY, "1");
            }}
            aria-label={bannerCopy.close}
            className="p-1 text-[#1d1d1f] hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
