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
  const encTweet = encodeURIComponent(`${title} ${url}`);
  const encWa = encodeURIComponent(`${title} ${url}`);
  const encSubject = encodeURIComponent(title);
  const encBody = encodeURIComponent(
    `${description ? description + "\n\n" : ""}${url}`,
  );

  const links = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encTweet}`,
      popup: true,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      popup: true,
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encWa}`,
      popup: true,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encSubject}&body=${encBody}`,
      popup: false,
    },
  ];

  function openShare(e: React.MouseEvent<HTMLAnchorElement>, href: string, popup: boolean) {
    if (!popup) return;
    e.preventDefault();
    const w = 600;
    const h = 600;
    const y = window.top ? window.top.outerHeight / 2 + window.top.screenY - h / 2 : 0;
    const x = window.top ? window.top.outerWidth / 2 + window.top.screenX - w / 2 : 0;
    window.open(
      href,
      "share",
      `popup=yes,width=${w},height=${h},left=${x},top=${y},noopener,noreferrer`,
    );
  }

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
          target={l.popup ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={(e) => openShare(e, l.href, l.popup)}
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
