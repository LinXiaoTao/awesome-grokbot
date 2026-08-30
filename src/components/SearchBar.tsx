"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations("hero");
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl"
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-full border border-border bg-white py-3.5 pl-12 pr-4 text-base text-black outline-none transition-shadow duration-200 placeholder:text-muted focus:border-black focus:shadow-md"
        aria-label={t("searchPlaceholder")}
      />
    </motion.div>
  );
}
