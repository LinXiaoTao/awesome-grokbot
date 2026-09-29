"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { toHtmlLang } from "@/lib/html-lang";

export function HtmlLangSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = toHtmlLang(locale);
  }, [locale]);

  return null;
}
