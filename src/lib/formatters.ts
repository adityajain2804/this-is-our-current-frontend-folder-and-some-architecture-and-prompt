/**
 * Shared number formatters — used everywhere in the Studio, no exceptions.
 * Never call `.toLocaleString()` directly in a component.
 */

export const fmtCOP = (v: number): string =>
  "$" + new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(v)) + " COP";

export const fmtMillionCOP = (v: number): string =>
  (v < 0 ? "-$" : "$") + (Math.abs(v) / 1_000_000).toFixed(2) + "M COP";

export const fmtInt = (v: number): string => new Intl.NumberFormat("en-US").format(Math.round(v));

export const fmtPct = (v: number, decimals = 1): string => (v * 100).toFixed(decimals) + "%";

export const fmtSignedPct = (v: number, decimals = 1): string =>
  (v >= 0 ? "+" : "") + (v * 100).toFixed(decimals) + "%";

export const fmtMultiplier = (v: number): string => v.toFixed(2) + "x";

export const fmtTau = (v: number): string => (v >= 0 ? "+" : "") + v.toFixed(3);

export const fmtUnits = (v: number): string => (v >= 0 ? "+" : "") + v.toFixed(1) + " Units";

export const REDEEMED_ONLY_NOTE = "Redeemed Only — not exposure liability";
