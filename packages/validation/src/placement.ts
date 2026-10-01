import { z } from "zod";
import { placementDistributionSchema, placementZoneSchema } from "./enums";

export const placementSchema = z.object({
  /** 0 = bottom tier. "all" = every tier. */
  tierIndex: z.union([z.number().int().nonnegative(), z.literal("all")]),
  zone: placementZoneSchema,
  distribution: placementDistributionSchema,
});
