import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Accent = "primary" | "secondary" | "accent";

const COLORS = {
  bg: "#1E1B4B",
  bgDeep: "#15123A",
  text: "#E9D5FF",
  primary: "#D946EF",
  secondary: "#06B6D4",
  accent: "#FBBF24",
};

const ACCENT_HEX: Record<Accent, string> = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  accent: COLORS.accent,
};

type OgProps = {
  eyebrow: string;
  title: string;
  tagline?: string;
  emoji?: string;
  accent?: Accent;
  footer?: string;
};

export function renderOg({
  eyebrow,
  title,
  tagline,
  emoji,
  accent = "primary",
  footer = "stackitup",
}: OgProps) {
  const accentHex = ACCENT_HEX[accent];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgDeep} 100%)`,
          color: COLORS.text,
          position: "relative",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        {/* retro grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${COLORS.primary}22 1px, transparent 1px), linear-gradient(90deg, ${COLORS.primary}22 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
            display: "flex",
          }}
        />
        {/* top corner glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 500,
            height: 500,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${accentHex}55 0%, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -220,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${COLORS.secondary}44 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* brand lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: COLORS.primary,
              border: `4px solid ${COLORS.text}`,
              boxShadow: `6px 6px 0 ${COLORS.accent}`,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.text,
              display: "flex",
            }}
          >
            StackItUp
          </div>
        </div>

        {/* eyebrow */}
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: accentHex,
            display: "flex",
          }}
        >
          {eyebrow}
        </div>

        {/* title row */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 24,
            maxWidth: "100%",
          }}
        >
          {emoji ? (
            <div
              style={{
                fontSize: 96,
                lineHeight: 1,
                display: "flex",
              }}
            >
              {emoji}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 22 ? 72 : title.length > 14 ? 88 : 108,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: COLORS.text,
              display: "flex",
              maxWidth: emoji ? 920 : 1060,
            }}
          >
            {title}
          </div>
        </div>

        {/* tagline */}
        {tagline ? (
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              lineHeight: 1.35,
              color: `${COLORS.text}CC`,
              maxWidth: 1020,
              display: "flex",
            }}
          >
            {tagline}
          </div>
        ) : null}

        {/* spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `4px solid ${accentHex}`,
            paddingTop: 22,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: `${COLORS.text}99`,
          }}
        >
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 14, height: 14, background: COLORS.primary, display: "flex" }} />
            <div style={{ width: 14, height: 14, background: COLORS.secondary, display: "flex" }} />
            <div style={{ width: 14, height: 14, background: COLORS.accent, display: "flex" }} />
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
