import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AUTHOR } from "@/config/author";
import { Terminal, Rss } from "lucide-react";
import { GitHubIcon } from "./GitHubIcon";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-border/80 bg-white px-4 py-12 text-slate-600">
      <div className="mx-auto max-w-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
              <span>{tNav("brand")}</span>
            </Link>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
              {t("tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span>MIT Licensed</span>
              <span>·</span>
              <a
                href={AUTHOR.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-slate-900"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="transition-colors hover:text-black">
                  {tNav("discover")}
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="transition-colors hover:text-black">
                  {tNav("categories")}
                </Link>
              </li>
              <li>
                <a
                  href={`${AUTHOR.githubRepo}/issues/new?template=submit-bot.yml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-black"
                >
                  {tNav("submit")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900">
              For AI Agents
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/api/v1/feed.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-black"
                >
                  <Rss className="h-3 w-3 text-orange-500" />
                  <span>Feed API (JSON)</span>
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-black"
                >
                  <Terminal className="h-3 w-3 text-purple-500" />
                  <span>llms.txt</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-black"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-900">
              Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={AUTHOR.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-black"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href={AUTHOR.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-black"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
