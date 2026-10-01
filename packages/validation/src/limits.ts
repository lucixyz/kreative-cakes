import type { PLACEMENT_ZONES, SHAPE_KINDS } from "./enums";

type ShapeKind = (typeof SHAPE_KINDS)[number];
type PlacementZone = (typeof PLACEMENT_ZONES)[number];

/**
 * Physical / content limits for cake designs. The ONE config object the bakery
 * can adjust later (admin setting -> loaded from business_settings).
 * Zod refinements use DEFAULT_CAKE_LIMITS for catalog-independent checks;
 * @cakeshop/domain accepts an override for the full constraint pass.
 */
export interface CakeLimits {
  tiers: { min: number; max: number; maxByShape: Record<ShapeKind, number> };
  /** Inches. */
  diameter: { min: number; max: number };
  height: { min: number; max: number };
  /** Each tier must be at least this many inches narrower than the tier below. */
  minTierStep: number;
  messageMaxLength: number;
  topperTextMaxLength: number;
  notesMaxLength: number;
  /** Tiers at or above this count need internal supports and are never `low` complexity. */
  supportsFromTierCount: number;
  decorations: {
    maxEntries: number;
    maxQuantityPerEntry: number;
    /** Decoration units allowed per inch of tier diameter, by zone. */
    densityPerInch: Record<PlacementZone, number>;
  };
  candles: { maxQuantity: number };
}

export const DEFAULT_CAKE_LIMITS: CakeLimits = {
  tiers: { min: 1, max: 4, maxByShape: { round: 4, square: 4, heart: 2 } },
  diameter: { min: 4, max: 16 },
  height: { min: 3, max: 8 },
  minTierStep: 2,
  messageMaxLength: 40,
  topperTextMaxLength: 30,
  notesMaxLength: 1000,
  supportsFromTierCount: 3,
  decorations: {
    maxEntries: 20,
    maxQuantityPerEntry: 60,
    densityPerInch: { top: 2, side: 3, border: 4, base: 2 },
  },
  candles: { maxQuantity: 50 },
};
