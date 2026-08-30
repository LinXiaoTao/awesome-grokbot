"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Bot } from "@/types";
import { BotCard } from "./BotCard";

const PAGE_SIZE = 12;

interface BotGridProps {
  bots: Bot[];
}

export function BotGrid({ bots }: BotGridProps) {
  const t = useTranslations("common");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [bots]);

  const visibleBots = useMemo(
    () => bots.slice(0, visibleCount),
    [bots, visibleCount],
  );

  const hasMore = visibleCount < bots.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, bots.length));
  }, [bots.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (bots.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-black">{t("noResults")}</p>
        <p className="mt-2 text-sm text-muted">{t("tryDifferent")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleBots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay:
                  index >= visibleCount - PAGE_SIZE
                    ? (index % PAGE_SIZE) * 0.05
                    : 0,
              }}
            >
              <BotCard bot={bot} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </>
  );
}
