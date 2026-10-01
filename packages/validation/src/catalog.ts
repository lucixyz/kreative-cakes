import { z } from "zod";
import { placementZoneSchema, shapeKindSchema } from "./enums";

/**
 * Admin-managed cake option catalog. Designs store these ids, never display strings.
 * Prices are integer centavos. Semantics per type are documented on each schema.
 */
const catalogItemBase = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  active: z.boolean().default(true),
  available: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  imageUrl: z.string().optional(),
  /** Key into the 3D asset registry (GLB or primitive placeholder). */
  assetKey: z.string().optional(),
});

const money = z.number().int().nonnegative();

export const shapeOptionSchema = catalogItemBase.extend({
  kind: shapeKindSchema,
  /** Volume price multiplier in basis points (10000 = x1.00). */
  priceMultiplierBps: z.number().int().positive().default(10_000),
});

/** Flat price per tier that uses the option. */
export const flavorOptionSchema = catalogItemBase.extend({ priceCentavos: money.default(0) });
export const fillingOptionSchema = catalogItemBase.extend({ priceCentavos: money.default(0) });
export const frostingOptionSchema = catalogItemBase.extend({ priceCentavos: money.default(0) });

/** Price per unit. */
export const decorationOptionSchema = catalogItemBase.extend({
  priceCentavos: money,
  allowedZones: z.array(placementZoneSchema).min(1),
});
export const candleOptionSchema = catalogItemBase.extend({ priceCentavos: money });

/** Flat price per cake. */
export const topperOptionSchema = catalogItemBase.extend({
  priceCentavos: money,
  allowsText: z.boolean().default(false),
});
export const borderOptionSchema = catalogItemBase.extend({ priceCentavos: money });
export const themeOptionSchema = catalogItemBase.extend({ priceCentavos: money.default(0) });

export const dietaryOptionSchema = catalogItemBase.extend({
  priceCentavos: money.default(0),
  incompatibleFlavorIds: z.array(z.string()).default([]),
  incompatibleFillingIds: z.array(z.string()).default([]),
  incompatibleFrostingIds: z.array(z.string()).default([]),
});

export const catalogSchema = z.object({
  shapes: z.array(shapeOptionSchema),
  flavors: z.array(flavorOptionSchema),
  fillings: z.array(fillingOptionSchema),
  frostings: z.array(frostingOptionSchema),
  decorations: z.array(decorationOptionSchema),
  toppers: z.array(topperOptionSchema),
  borders: z.array(borderOptionSchema),
  candles: z.array(candleOptionSchema),
  themes: z.array(themeOptionSchema),
  dietary: z.array(dietaryOptionSchema),
  defaults: z.object({
    shapeId: z.string(),
    flavorId: z.string(),
    fillingId: z.string(),
    frostingId: z.string(),
  }),
});

/** The same catalog doubles as the price catalog for `calculateCakeEstimate`. */
export const priceRulesSchema = z.object({
  currency: z.string().default("PHP"),
  /** Base batter+structure price per cubic inch of cake, in centavos. */
  basePerCubicInchCentavos: money,
  /** Structural fee per tier above the first (supports, assembly). */
  extraTierFeeCentavos: money,
  complexityMultiplierBps: z.object({
    low: z.number().int().min(10_000),
    medium: z.number().int().min(10_000),
    high: z.number().int().min(10_000),
  }),
  rush: z.object({ windowDays: z.number().int().nonnegative(), feeCentavos: money }),
});

export const depositRulesSchema = z.object({
  mode: z.enum(["percent", "fixed"]),
  /** Basis points when mode=percent (5000 = 50%), centavos when mode=fixed. */
  value: z.number().int().positive(),
  /** Event within this many days -> full payment required instead of deposit. */
  fullPaymentWithinDays: z.number().int().nonnegative(),
  /** Balance due this many days before the requested date. */
  balanceDueDaysBefore: z.number().int().nonnegative(),
});
