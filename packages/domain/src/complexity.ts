import { COMPLEXITIES, DEFAULT_CAKE_LIMITS, type CakeLimits } from "@cakeshop/validation";
import type { CakeDesign, Catalog, Complexity } from "@cakeshop/types";
import { shapeKindOf } from "./catalog-lookup";

const TIER_POINTS = [0, 0, 1, 3, 5] as const;

export function requiresSupports(design: Pick<CakeDesign, "tiers">, limits: CakeLimits = DEFAULT_CAKE_LIMITS): boolean {
  return design.tiers.length >= limits.supportsFromTierCount;
}

/** Rule-based complexity score: tiers dominate, then decoration volume and shape. */
export function deriveComplexity(
  design: Pick<CakeDesign, "tiers" | "decorations" | "shapeId">,
  catalog: Catalog,
  limits: CakeLimits = DEFAULT_CAKE_LIMITS,
): Complexity {
  let points = TIER_POINTS[Math.min(design.tiers.length, 4)] ?? 5;
  const decoUnits = design.decorations.reduce((sum, d) => sum + d.quantity, 0);
  if (decoUnits >= 20) points += 2;
  else if (decoUnits >= 8) points += 1;
  if (shapeKindOf(catalog, design.shapeId) === "heart") points += 1;

  let result: Complexity = points >= 5 ? "high" : points >= 2 ? "medium" : "low";
  if (requiresSupports(design, limits) && result === "low") result = "medium";
  return result;
}

/** The higher of two complexities (AI may suggest; domain never goes below its own rule). */
export function maxComplexity(a: Complexity, b: Complexity): Complexity {
  return COMPLEXITIES.indexOf(a) >= COMPLEXITIES.indexOf(b) ? a : b;
}
