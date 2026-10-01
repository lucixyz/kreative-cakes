import { DEFAULT_CAKE_LIMITS, type CakeLimits } from "@cakeshop/validation";
import type { CakeDesign, Catalog } from "@cakeshop/types";
import { findById, findUnavailableRefs, shapeKindOf } from "./catalog-lookup";
import { requiresSupports } from "./complexity";

export type ConstraintSeverity = "error" | "warning";

export interface ConstraintIssue {
  code: string;
  severity: ConstraintSeverity;
  path: string;
  /** Customer-safe message. */
  message: string;
}

/**
 * Full constraint pass (catalog-aware, limits configurable). Errors block submission;
 * warnings are shown live in the builder.
 */
export function validateDesignConstraints(
  design: CakeDesign,
  catalog: Catalog,
  limits: CakeLimits = DEFAULT_CAKE_LIMITS,
): ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];
  const add = (severity: ConstraintSeverity, code: string, path: string, message: string) =>
    issues.push({ code, severity, path, message });

  const kind = shapeKindOf(catalog, design.shapeId);
  const maxTiers = Math.min(limits.tiers.max, limits.tiers.maxByShape[kind]);
  if (design.tiers.length > maxTiers) {
    add("error", "TIER_COUNT_EXCEEDS_SHAPE", "tiers", `A ${kind} cake supports at most ${maxTiers} tier${maxTiers > 1 ? "s" : ""}.`);
  }

  design.tiers.forEach((tier, i) => {
    if (tier.diameter < limits.diameter.min || tier.diameter > limits.diameter.max) {
      add("error", "DIAMETER_RANGE", `tiers.${i}.diameter`, `Diameter must be between ${limits.diameter.min} and ${limits.diameter.max} in.`);
    }
    if (tier.height < limits.height.min || tier.height > limits.height.max) {
      add("error", "HEIGHT_RANGE", `tiers.${i}.height`, `Height must be between ${limits.height.min} and ${limits.height.max} in.`);
    }
    const below = design.tiers[i - 1];
    if (below && below.diameter - tier.diameter < limits.minTierStep) {
      add("error", "TIER_NOT_SMALLER", `tiers.${i}.diameter`, `Tier ${i + 1} must be at least ${limits.minTierStep} in narrower than the tier below.`);
    }
  });

  if (design.message && design.message.text.length > limits.messageMaxLength) {
    add("error", "MESSAGE_TOO_LONG", "message.text", `Messages are limited to ${limits.messageMaxLength} characters.`);
  }

  design.decorations.forEach((deco, i) => {
    const option = findById(catalog.decorations, deco.decorationId);
    const path = `decorations.${i}`;
    if (option && !option.allowedZones.includes(deco.placement.zone)) {
      add("error", "DECORATION_ZONE_NOT_ALLOWED", path, `${option.name} can't be placed on the ${deco.placement.zone} of the cake.`);
    }
    const tiers = deco.placement.tierIndex === "all" ? design.tiers : [design.tiers[deco.placement.tierIndex]];
    const capacity = tiers.reduce(
      (sum, t) => sum + (t ? Math.floor(t.diameter * limits.decorations.densityPerInch[deco.placement.zone]) : 0),
      0,
    );
    if (deco.quantity > capacity) {
      add("warning", "DECORATION_QUANTITY_EXCEEDED", path, `Too many decorations for that area (about ${capacity} fit).`);
    }
  });

  const dietaryIds = new Set(design.dietaryOptionIds);
  for (const option of catalog.dietary.filter((d) => dietaryIds.has(d.id))) {
    const conflicts =
      design.tiers.some((t) => option.incompatibleFlavorIds.includes(t.flavorId) || option.incompatibleFillingIds.includes(t.fillingId)) ||
      option.incompatibleFrostingIds.includes(design.frostingId);
    if (conflicts) add("error", "DIETARY_INCOMPATIBLE", "dietaryOptionIds", `Some selected flavors or fillings aren't available as ${option.name.toLowerCase()}.`);
  }

  if (requiresSupports(design, limits)) {
    add("warning", "REQUIRES_SUPPORTS", "tiers", "Cakes with 3 or more tiers need internal supports and longer lead time.");
  }

  for (const ref of findUnavailableRefs(design, catalog)) {
    add("error", "OPTION_UNAVAILABLE", ref.path, "An option in your design is no longer available — please choose another.");
  }

  return issues;
}

export const hasBlockingIssues = (issues: readonly ConstraintIssue[]): boolean => issues.some((i) => i.severity === "error");
