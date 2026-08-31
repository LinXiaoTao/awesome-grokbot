"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { AUTHOR } from "@/config/author";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "./GitHubIcon";
import {
  XIcon,
  XiaohongshuIcon,
  DouyinIcon,
  JikeIcon,
} from "./SocialIcons";
import { LanguageSwitcher } from "./LanguageSwitcher";

const SOCIAL_LINKS = [
  { href: AUTHOR.x, icon: XIcon, label: "X (Twitter)" },
  { href: AUTHOR.xiaohongshu, icon: XiaohongshuIcon, label: "小红书" },
  { href: AUTHOR.douyin, icon: DouyinIcon, label: "抖音" },
  { href: AUTHOR.jike, icon: JikeIcon, label: "即刻" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-64.png"
            alt="Awesome Grok Bot"
            width={28}
            height={28}
            className="rounded-md shadow-xs"
            priority
          />
          <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            {t("brand")}
          </span>
        </Link>

        <div className="flex items-center gap-3 pr-1">
          <div className="hidden sm:block">
            <LanguageSwitcher compact />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={AUTHOR.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-black"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-black"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>

          <a
            href={`${AUTHOR.githubRepo}/issues/new?template=submit-bot.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-black hover:shadow-xs sm:inline-flex"
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
          <div className="flex items-center gap-3">
            <a
              href={AUTHOR.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-black"
              aria-label="GitHub"
              onClick={() => setMobileOpen(false)}
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-black"
                aria-label={label}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a
            href={`${AUTHOR.githubRepo}/issues/new?template=submit-bot.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("submit")}
          </a>
        </div>
      </div>
    </header>
  );
}
