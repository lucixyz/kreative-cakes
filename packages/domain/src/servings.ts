import type { CakeDesign, Catalog } from "@cakeshop/types";
import { shapeKindOf } from "./catalog-lookup";
import { tierVolumeCuIn } from "./shapes";

export interface ServingsConfig {
  /** Volume of one "wedding" portion (1 in x 2 in x 4 in). */
  cubicInchesPerServing: number;
}

export const DEFAULT_SERVINGS_CONFIG: ServingsConfig = { cubicInchesPerServing: 8 };

/**
 * servings = sum over tiers( floor( tierVolume / cubicInchesPerServing ) )
 * tierVolume = shapeAreaFactor * diameter² * height. See docs/cake-design-schema.md.
 */
export function estimateServings(
  design: Pick<CakeDesign, "shapeId" | "tiers">,
  catalog: Catalog,
  config: ServingsConfig = DEFAULT_SERVINGS_CONFIG,
): number {
  const kind = shapeKindOf(catalog, design.shapeId);
  return design.tiers.reduce(
    (total, tier) => total + Math.floor(tierVolumeCuIn(kind, tier.diameter, tier.height) / config.cubicInchesPerServing),
    0,
  );
}
