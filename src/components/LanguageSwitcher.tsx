"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { LOCALE_NAMES, type Locale } from "@/lib/utils";
import { routing } from "@/i18n/routing";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale as Locale });
  }

  return (
    <div className={compact ? undefined : "flex flex-col gap-2"}>
      {!compact && (
        <label htmlFor="language-select" className="text-sm font-medium text-black">
          {t("language")}
        </label>
      )}
      <select
        id="language-select"
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={t("language")}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-black outline-none transition-colors hover:border-black focus:border-black"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_NAMES[loc as Locale]}
          </option>
        ))}
      </select>
      <nav aria-label={t("language")} className="sr-only">
        {routing.locales.map((loc) => (
          <Link
            key={loc}
            href={pathname}
            locale={loc as Locale}
            hrefLang={loc}
            aria-current={locale === loc ? "page" : undefined}
          >
            {LOCALE_NAMES[loc as Locale]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
