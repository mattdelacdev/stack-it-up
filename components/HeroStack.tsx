import Image from "next/image";

export default function HeroStack() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none">
      <div
        aria-hidden
        className="absolute -inset-8 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #D946EF 0%, #06B6D4 40%, transparent 70%)",
        }}
      />

      <div className="relative aspect-[3/4] overflow-hidden border-4 border-primary/60 shadow-[0_0_40px_rgba(217,70,239,0.35)]">
        <Image
          src="/hero-supplements.jpg"
          alt="A spilled bottle of colorful supplement capsules and powders"
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="object-cover saturate-[1.15] contrast-[1.05]"
        />

        {/* duotone tint toward brand palette */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-color"
          style={{
            background:
              "linear-gradient(135deg, rgba(217,70,239,0.55) 0%, rgba(30,27,75,0.25) 50%, rgba(6,182,212,0.5) 100%)",
          }}
        />

        {/* darken bottom for text contrast */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, rgba(30,27,75,0.55) 100%)",
          }}
        />

        {/* scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* retro badge */}
        <div className="absolute top-4 right-4 bg-bg-deep/90 border-2 border-accent px-3 py-1.5 font-mono text-accent text-sm tracking-[0.15em]">
          YOUR·STACK
        </div>

        {/* corner tick marks */}
        <span aria-hidden className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-accent" />
        <span aria-hidden className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-accent" />
      </div>
    </div>
  );
}
