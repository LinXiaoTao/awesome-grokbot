"use client";

import { useState } from "react";
import { Copy, Check, Terminal, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

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

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <details className="group mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <Terminal className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          <span>{t("promptHeading")}</span>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="border-t border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            system prompt
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-800"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t("copied")}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-neutral-400" />
                <span>{t("copyPrompt")}</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-neutral-950 p-4">
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-neutral-300">
            {promptText}
          </pre>
        </div>

        <p className="border-t border-neutral-200 px-4 py-2.5 text-[11px] text-neutral-500">
          {t("promptTip")}
        </p>
      </div>
    </details>
  );
}
