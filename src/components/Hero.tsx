"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function GrokBotMascot() {
  return (
    <motion.div
      className="pointer-events-none absolute right-[8%] top-1/2 hidden h-32 w-32 -translate-y-1/2 xl:block"
      initial={{ opacity: 0, scale: 0.6, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg
          viewBox="0 0 120 120"
          fill="none"
          className="h-32 w-32 drop-shadow-2xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <circle cx="60" cy="60" r="56" fill="#1a1a1a" />
          <rect x="42" y="38" width="10" height="28" rx="5" fill="white" />
          <rect x="68" y="38" width="10" height="28" rx="5" fill="white" />
          <motion.circle
            cx="60"
            cy="60"
            r="56"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeDasharray="352"
            strokeDashoffset="352"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

interface HeroProps {
  children?: ReactNode;
}

export function Hero({ children }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 md:pb-24 md:pt-20">
      <GrokBotMascot />

      <motion.div
        className="mx-auto max-w-container text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-black">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            {t("badge")}
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-base text-muted md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div variants={itemVariants} className="space-y-8">
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
