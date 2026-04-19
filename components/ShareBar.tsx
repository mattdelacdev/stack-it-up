"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  description?: string;
};

export default function ShareBar({ url, title, description }: Props) {
  const [copied, setCopied] = useState(false);

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encDesc = encodeURIComponent(description ?? "");
  const encBody = encodeURIComponent(`${description ? description + "\n\n" : ""}${url}`);

  const links = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}`,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encTitle}&body=${encBody}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const btn =
    "border-2 border-primary/50 bg-bg/50 px-3 py-2 font-display text-[11px] tracking-[0.2em] text-text hover:border-accent hover:text-accent transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-display text-[11px] tracking-[0.2em] text-text/60 mr-1">
        SHARE:
      </span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target={l.name === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className={btn}
        >
          {l.name.toUpperCase()}
        </a>
      ))}
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? "COPIED ✓" : "COPY LINK"}
      </button>
    </div>
  );
}
