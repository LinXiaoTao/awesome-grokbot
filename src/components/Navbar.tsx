"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-64.png"
            alt="Awesome Grok Bot"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          <span className="text-sm font-semibold text-black sm:text-base">
            {t("brand")}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>

          <a
            href="https://forms.gle/Rn4o1qXAAUGGD3ss9"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
          >
            {t("submit")}
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-black md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "border-t border-border bg-white md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-3 px-4 py-3">
          <LanguageSwitcher compact />
          <a
            href="https://forms.gle/Rn4o1qXAAUGGD3ss9"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-5 py-2.5 text-center text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("submit")}
          </a>
        </div>
      </div>
    </header>
  );
}
