import type { ReactNode } from "react";

export type DoseUnit = "mg" | "g" | "mcg" | "IU" | "CFU-B" | "capsule" | "scoop";
export type DosePref = "native" | "si";

export interface DoseFields {
  dose: string | null;
  dose_low: number | null;
  dose_high: number | null;
  dose_unit: string | null;
}

const IU_PER_MCG_D3 = 40;

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (Number.isInteger(n)) return n.toString();
  return Number.parseFloat(n.toFixed(2)).toString();
}

function range(low: number, high: number | null): string {
  if (high == null || high === low) return formatNumber(low);
  return `${formatNumber(low)}–${formatNumber(high)}`;
}

type Convert = { low: number; high: number | null; unit: string };

function toSI(low: number, high: number | null, unit: string): Convert {
  // Vitamin D / similar: IU → mcg (only for D3-class supplements where 1 mcg = 40 IU)
  if (unit === "IU") {
    return { low: low / IU_PER_MCG_D3, high: high == null ? null : high / IU_PER_MCG_D3, unit: "mcg" };
  }
  // g → mg if under 1 g (keep g otherwise to avoid "5000 mg" ugliness)
  if (unit === "g" && low < 1 && (high == null || high < 1)) {
    return { low: low * 1000, high: high == null ? null : high * 1000, unit: "mg" };
  }
  // mcg → mg if ≥ 1000 mcg
  if (unit === "mcg" && low >= 1000) {
    return { low: low / 1000, high: high == null ? null : high / 1000, unit: "mg" };
  }
  return { low, high, unit };
}

function render(unit: string, amount: string): string {
  if (unit === "capsule") {
    return `${amount} ${amount === "1" ? "capsule" : "capsules"}`;
  }
  if (unit === "scoop") {
    return `${amount} ${amount === "1" ? "scoop" : "scoops"}`;
  }
  if (unit === "CFU-B") {
    return `${amount}B CFU`;
  }
  return `${amount} ${unit}`;
}

export function formatDose(s: DoseFields, pref: DosePref): string {
  if (s.dose_low == null || !s.dose_unit) return s.dose ?? "";
  const base =
    pref === "si"
      ? toSI(Number(s.dose_low), s.dose_high == null ? null : Number(s.dose_high), s.dose_unit)
      : { low: Number(s.dose_low), high: s.dose_high == null ? null : Number(s.dose_high), unit: s.dose_unit };
  return render(base.unit, range(base.low, base.high));
}

export function hasStructuredDose(s: DoseFields): boolean {
  return s.dose_low != null && !!s.dose_unit;
}

/**
 * Renders both "native" and "SI" dose variants so the page can toggle via CSS
 * without re-rendering. The html[data-dose-pref] attribute (set in
 * app/layout.tsx) drives which variant is visible.
 */
export function DualDose({
  s,
  className = "",
}: {
  s: DoseFields;
  className?: string;
}): ReactNode {
  if (!hasStructuredDose(s)) {
    return <span className={className}>{s.dose}</span>;
  }
  const native = formatDose(s, "native");
  const si = formatDose(s, "si");
  if (native === si) {
    return <span className={className}>{native}</span>;
  }
  return (
    <span className={className}>
      <span data-dose-variant="native">{native}</span>
      <span data-dose-variant="si">{si}</span>
    </span>
  );
}
