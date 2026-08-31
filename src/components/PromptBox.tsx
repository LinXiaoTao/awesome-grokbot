"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface PromptBoxProps {
  name: string;
  category: string;
  description: string;
  longDescription?: string;
}

export function PromptBox({
  name,
  category,
  description,
  longDescription,
}: PromptBoxProps) {
  const t = useTranslations("bot");
  const [copied, setCopied] = useState(false);

  const promptText = `Name: ${name}
Category: ${category}
Role: You are ${name}.
Instructions:
${longDescription || description}

Respond accurately according to the instructions above.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="h-3.5 w-3.5 text-orange-400" />
          <span>{t("promptHeading")}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1 text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                {t("copied")}
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                {t("copyPrompt")}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="p-4">
        <pre className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
          {promptText}
        </pre>
      </div>

      <div className="border-t border-slate-900 bg-slate-900/40 px-4 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-orange-400 shrink-0" />
        <span>{t("promptTip")}</span>
      </div>
    </div>
  );
}
