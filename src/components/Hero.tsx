"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function GrokBotMascot() {
  return (
    <motion.div
      className="pointer-events-none absolute right-[6%] top-1/3 hidden h-32 w-32 -translate-y-1/2 xl:block opacity-90"
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          className="h-28 w-28 drop-shadow-xl"
        >
          <circle cx="60" cy="60" r="54" fill="#0f172a" />
          <rect x="42" y="38" width="10" height="28" rx="5" fill="#f8fafc" />
          <rect x="68" y="38" width="10" height="28" rx="5" fill="#f8fafc" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="340"
            strokeDashoffset="120"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

interface HeroProps {
  children?: ReactNode;
  botCount: number;
}

export function Hero({ children, botCount }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-grid-pattern px-4 pb-14 pt-10 md:pb-20 md:pt-16 border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8fafc]" />
      <GrokBotMascot />

      <motion.div
        className="relative z-10 mx-auto max-w-container text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-5 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold text-neutral-800 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-6 max-w-2xl text-base text-slate-600 md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        {/* Feature stats chips */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-600"
        >
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1 shadow-xs">
            <Bot className="h-3.5 w-3.5 text-blue-500" />
            {t("statsBots", { count: botCount })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-3 py-1 shadow-xs">
            <Layers className="h-3.5 w-3.5 text-emerald-500" />
            {t("statsCategories")}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
