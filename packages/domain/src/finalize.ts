import { DEFAULT_CAKE_LIMITS, type CakeLimits } from "@cakeshop/validation";
import type { CakeDesign, Catalog } from "@cakeshop/types";
import { deriveComplexity, maxComplexity } from "./complexity";
import { DEFAULT_SERVINGS_CONFIG, estimateServings, type ServingsConfig } from "./servings";

/**
 * Recomputes derived fields (servings, complexity). Client-sent values for these are ignored;
 * call this on both client (display) and server (authoritative).
 */
export function finalizeDesign(
  design: CakeDesign,
  catalog: Catalog,
  options: { limits?: CakeLimits; servings?: ServingsConfig } = {},
): CakeDesign {
  const { limits = DEFAULT_CAKE_LIMITS, servings = DEFAULT_SERVINGS_CONFIG } = options;
  const derived = deriveComplexity(design, catalog, limits);
  return {
    ...design,
    servingEstimate: estimateServings(design, catalog, servings),
    complexity: maxComplexity(derived, design.aiMetadata ? design.complexity : derived),
  };
}
