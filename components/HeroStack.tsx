"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const layer = (depth: number) => ({
    transform: `translate3d(${offset.x * depth}px, ${offset.y * depth}px, 0)`,
    transition: "transform 200ms ease-out",
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-md mx-auto lg:max-w-none aspect-square"
      style={{ perspective: "1000px" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #D946EF 0%, #06B6D4 40%, transparent 70%)",
          ...layer(10),
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative w-full h-full drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]"
        role="img"
        aria-label="Illustration of a personalized supplement stack"
        style={{
          transform: `rotateY(${offset.x * 8}deg) rotateX(${offset.y * -8}deg)`,
          transition: "transform 200ms ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <defs>
          <linearGradient id="pink" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#F472B6" />
            <stop offset="1" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="cyan" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#67E8F9" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="amber" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#FDE68A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="violet" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#C4B5FD" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="shine" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.6" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* retro sun / backdrop */}
        <g
          style={{
            transform: `translate(${offset.x * 4}px, ${offset.y * 4}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <circle cx="200" cy="200" r="150" fill="url(#violet)" opacity="0.12" />
          <circle cx="200" cy="200" r="110" fill="url(#pink)" opacity="0.18" />

          {/* scanlines on backdrop */}
          <g opacity="0.25">
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="60"
                x2="340"
                y1={130 + i * 12}
                y2={130 + i * 12}
                stroke="#1E1B4B"
                strokeWidth="2"
              />
            ))}
          </g>
        </g>

        {/* Capsule 1 - pink, top */}
        <g
          style={{
            transform: `translate(${offset.x * 18}px, ${offset.y * 18}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <g transform="translate(85 90) rotate(-18)">
            <rect x="0" y="0" width="180" height="58" rx="29" fill="url(#pink)" />
            <rect x="90" y="0" width="90" height="58" rx="29" fill="#FEF3C7" opacity="0.95" />
            <rect x="88" y="0" width="4" height="58" fill="#1E1B4B" opacity="0.25" />
            <rect x="10" y="8" width="80" height="10" rx="5" fill="url(#shine)" />
            <rect x="0" y="0" width="180" height="58" rx="29" fill="none" stroke="#1E1B4B" strokeWidth="3" opacity="0.4" />
          </g>
        </g>

        {/* Capsule 2 - cyan, middle */}
        <g
          style={{
            transform: `translate(${offset.x * 12}px, ${offset.y * 12}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <g transform="translate(70 180) rotate(8)">
            <rect x="0" y="0" width="190" height="62" rx="31" fill="url(#cyan)" />
            <rect x="0" y="0" width="95" height="62" rx="31" fill="#1E1B4B" opacity="0.85" />
            <rect x="93" y="0" width="4" height="62" fill="#0E7490" opacity="0.5" />
            <rect x="12" y="8" width="70" height="10" rx="5" fill="url(#shine)" opacity="0.5" />
            <rect x="0" y="0" width="190" height="62" rx="31" fill="none" stroke="#1E1B4B" strokeWidth="3" opacity="0.4" />
          </g>
        </g>

        {/* Pill 3 - amber tablet */}
        <g
          style={{
            transform: `translate(${offset.x * 24}px, ${offset.y * 24}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <g transform="translate(130 275) rotate(-6)">
            <ellipse cx="70" cy="25" rx="70" ry="25" fill="url(#amber)" />
            <ellipse cx="70" cy="22" rx="68" ry="22" fill="none" stroke="#92400E" strokeWidth="2" opacity="0.4" />
            <line x1="30" y1="25" x2="110" y2="25" stroke="#92400E" strokeWidth="2" opacity="0.5" />
            <ellipse cx="50" cy="15" rx="22" ry="4" fill="white" opacity="0.5" />
          </g>
        </g>

        {/* sparkles */}
        <g
          fill="#FBBF24"
          style={{
            transform: `translate(${offset.x * 30}px, ${offset.y * 30}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <path d="M70 70 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" />
          <path d="M330 140 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" opacity="0.9" />
          <path d="M340 310 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" opacity="0.7" />
        </g>
        <g
          fill="#06B6D4"
          style={{
            transform: `translate(${offset.x * 28}px, ${offset.y * 28}px)`,
            transition: "transform 200ms ease-out",
          }}
        >
          <circle cx="55" cy="280" r="5" />
          <circle cx="355" cy="220" r="4" opacity="0.8" />
        </g>

      </svg>
    </div>
  );
}
