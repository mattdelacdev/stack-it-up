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
  const encTweet = encodeURIComponent(`${title}\n\n${url}`);
  const encWa = encodeURIComponent(`${title} — ${url}`);
  const encSubject = encodeURIComponent(title);
  const encBody = encodeURIComponent(
    `${title}\n\n${description ? description + "\n\n" : ""}${url}`,
  );

  const links = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encTweet}`,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/feed/?shareActive=true&text=${encTweet}&shareUrl=${encUrl}`,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encWa}`,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encSubject}&body=${encBody}`,
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
