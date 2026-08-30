"use client";

import { useEffect, useRef } from "react";

interface XPostEmbedProps {
  url: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

export default function XPostEmbed({ url }: XPostEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidgets = () => {
      window.twttr?.widgets.load(containerRef.current);
    };

    if (window.twttr) {
      loadWidgets();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://platform.x.com/widgets.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", loadWidgets);
      return () => {
        existingScript.removeEventListener("load", loadWidgets);
      };
    }

    const script = document.createElement("script");
    script.src = "https://platform.x.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    script.addEventListener("load", loadWidgets);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", loadWidgets);
    };
  }, [url]);

  return (
    <div ref={containerRef} className="max-w-lg">
      <blockquote className="twitter-tweet">
        <a href={url}>Loading post...</a>
      </blockquote>
    </div>
  );
}
