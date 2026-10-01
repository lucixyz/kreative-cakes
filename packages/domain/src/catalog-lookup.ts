import type { CakeDesign, Catalog, ShapeKind } from "@cakeshop/types";

export interface CatalogRef {
  /** Dot path into the design, e.g. "tiers.1.flavorId". */
  path: string;
  kind: keyof Omit<Catalog, "defaults">;
  id: string;
}

export function findById<T extends { id: string }>(items: readonly T[], id: string | undefined): T | undefined {
  return id === undefined ? undefined : items.find((item) => item.id === id);
}

export function shapeKindOf(catalog: Catalog, shapeId: string): ShapeKind {
  return findById(catalog.shapes, shapeId)?.kind ?? "round";
}

/** Every catalog id a design references, with where it is referenced. */
export function collectCatalogRefs(design: CakeDesign): CatalogRef[] {
  const refs: CatalogRef[] = [
    { path: "shapeId", kind: "shapes", id: design.shapeId },
    { path: "frostingId", kind: "frostings", id: design.frostingId },
  ];
  design.tiers.forEach((tier, i) => {
    refs.push({ path: `tiers.${i}.flavorId`, kind: "flavors", id: tier.flavorId });
    refs.push({ path: `tiers.${i}.fillingId`, kind: "fillings", id: tier.fillingId });
  });
  design.decorations.forEach((deco, i) => {
    refs.push({ path: `decorations.${i}.decorationId`, kind: "decorations", id: deco.decorationId });
  });
  if (design.borderStyleId) refs.push({ path: "borderStyleId", kind: "borders", id: design.borderStyleId });
  if (design.topper) refs.push({ path: "topper.topperId", kind: "toppers", id: design.topper.topperId });
  if (design.candles) refs.push({ path: "candles.candleId", kind: "candles", id: design.candles.candleId });
  if (design.themeId) refs.push({ path: "themeId", kind: "themes", id: design.themeId });
  design.dietaryOptionIds.forEach((id, i) => refs.push({ path: `dietaryOptionIds.${i}`, kind: "dietary", id }));
  return refs;
}

export type RefProblem = CatalogRef & { problem: "unknown" | "inactive" | "unavailable" };

/**
 * Finds references that are missing, deactivated or out of stock. The UI turns these into a
 * "no longer available — please choose another" state instead of crashing.
 */
export function findUnavailableRefs(design: CakeDesign, catalog: Catalog): RefProblem[] {
  const problems: RefProblem[] = [];
  for (const ref of collectCatalogRefs(design)) {
    const item = findById(catalog[ref.kind] as ReadonlyArray<{ id: string; active: boolean; available: boolean }>, ref.id);
    if (!item) problems.push({ ...ref, problem: "unknown" });
    else if (!item.active) problems.push({ ...ref, problem: "inactive" });
    else if (!item.available) problems.push({ ...ref, problem: "unavailable" });
  }
  return problems;
}
