"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import type { Bot } from "@/types";
import { IntegrationPill } from "./IntegrationPill";

interface BotCardProps {
  bot: Bot;
  index?: number;
}

export function BotCard({ bot, index = 0 }: BotCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/bot/${bot.slug}`} className="block h-full">
        <motion.div
          className="group flex h-full flex-col rounded-card border border-border bg-white p-5 transition-shadow duration-200 md:p-6"
          whileHover={{ y: -2, boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.1)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mb-3">
            <h3 className="truncate text-base font-bold text-black">
              {bot.name}
            </h3>
            {bot.authorHandle && (
              <p className="mt-0.5 text-sm text-muted">{bot.authorHandle}</p>
            )}
          </div>

          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
            {bot.description}
          </p>

          {bot.integrations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {bot.integrations.slice(0, 3).map((integration) => (
                <IntegrationPill key={integration} name={integration} />
              ))}
              {bot.integrations.length > 3 && (
                <IntegrationPill name={`+${bot.integrations.length - 3}`} />
              )}
            </div>
          )}
        </motion.div>
      </Link>
    </motion.article>
  );
}
