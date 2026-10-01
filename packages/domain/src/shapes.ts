import type { ShapeKind } from "@cakeshop/types";

/**
 * Footprint area of a tier as a fraction of diameter² (heart is an approximation of
 * a typical heart-shaped pan whose widest span equals `diameter`).
 */
export const SHAPE_AREA_FACTOR: Readonly<Record<ShapeKind, number>> = {
  round: Math.PI / 4,
  square: 1,
  heart: 0.72,
};

/** Tier footprint in square inches. */
export function tierAreaSqIn(kind: ShapeKind, diameter: number): number {
  return SHAPE_AREA_FACTOR[kind] * diameter * diameter;
}

/** Tier volume in cubic inches. */
export function tierVolumeCuIn(kind: ShapeKind, diameter: number, height: number): number {
  return tierAreaSqIn(kind, diameter) * height;
}
