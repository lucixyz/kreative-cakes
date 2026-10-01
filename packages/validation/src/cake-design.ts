import { z } from "zod";
import {
  colorRoleSchema,
  complexitySchema,
  designSourceSchema,
  messagePlacementSchema,
} from "./enums";
import { DEFAULT_CAKE_LIMITS as L } from "./limits";
import { hexColorSchema, paletteWithFinishSchema } from "./palette";
import { placementSchema } from "./placement";

export const CAKE_DESIGN_SCHEMA_VERSION = 1 as const;

export const cakeTierSchema = z.object({
  /** Inches. */
  diameter: z.number().min(L.diameter.min).max(L.diameter.max),
  /** Inches. */
  height: z.number().min(L.height.min).max(L.height.max),
  colorRole: colorRoleSchema,
  colorOverride: hexColorSchema.optional(),
  flavorId: z.string().min(1),
  fillingId: z.string().min(1),
});

export const cakeDecorationSchema = z.object({
  decorationId: z.string().min(1),
  quantity: z.number().int().min(1).max(L.decorations.maxQuantityPerEntry),
  placement: placementSchema,
  colorRole: colorRoleSchema.optional(),
  colorOverride: hexColorSchema.optional(),
});

export const cakeTopperSchema = z.object({
  topperId: z.string().min(1),
  text: z.string().max(L.topperTextMaxLength).optional(),
});

export const cakeMessageSchema = z.object({
  text: z.string().min(1).max(L.messageMaxLength),
  placement: messagePlacementSchema,
});

export const aiMetadataSchema = z.object({
  occasion: z.string().optional(),
  detectedTheme: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  warnings: z.array(z.string()).default([]),
});

/**
 * The single contract shared by manual builder, AI, saved designs, quotations and the 3D renderer.
 *
 * Catalog-independent physical rules are enforced here (ranges, tier ordering, lengths).
 * Rules that need catalog knowledge (heart max tiers, allowed zones, dietary compatibility)
 * are enforced by `validateDesignConstraints` in @cakeshop/domain.
 */
export const cakeDesignSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).max(80),
    source: designSourceSchema,
    shapeId: z.string().min(1),
    /** Bottom tier first. */
    tiers: z.array(cakeTierSchema).min(L.tiers.min).max(L.tiers.max),
    frostingId: z.string().min(1),
    palette: paletteWithFinishSchema,
    decorations: z.array(cakeDecorationSchema).max(L.decorations.maxEntries).default([]),
    borderStyleId: z.string().optional(),
    topper: cakeTopperSchema.optional(),
    message: cakeMessageSchema.optional(),
    candles: z
      .object({ candleId: z.string().min(1), quantity: z.number().int().min(1).max(L.candles.maxQuantity) })
      .optional(),
    themeId: z.string().optional(),
    dietaryOptionIds: z.array(z.string()).default([]),
    /** Derived by `finalizeDesign`; never trusted from clients. */
    servingEstimate: z.number().int().nonnegative(),
    /** Derived by domain rules; AI may suggest, domain takes the higher of the two. */
    complexity: complexitySchema,
    notes: z.string().max(L.notesMaxLength).optional(),
    previewImageUrl: z.string().optional(),
    aiMetadata: aiMetadataSchema.optional(),
    version: z.number().int().min(1),
    schemaVersion: z.literal(CAKE_DESIGN_SCHEMA_VERSION),
  })
  .superRefine((design, ctx) => {
    design.tiers.forEach((tier, i) => {
      const below = design.tiers[i - 1];
      if (below && below.diameter - tier.diameter < L.minTierStep) {
        ctx.addIssue({
          code: "custom",
          path: ["tiers", i, "diameter"],
          message: `Each tier must be at least ${L.minTierStep} in narrower than the tier below it.`,
        });
      }
    });
    design.decorations.forEach((deco, i) => {
      if (typeof deco.placement.tierIndex === "number" && deco.placement.tierIndex >= design.tiers.length) {
        ctx.addIssue({
          code: "custom",
          path: ["decorations", i, "placement", "tierIndex"],
          message: "Decoration targets a tier that does not exist.",
        });
      }
    });
  });
