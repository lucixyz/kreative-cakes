import { z } from "zod";
import { accentFinishSchema } from "./enums";

export const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected a #RRGGBB hex color");

/** Named color roles. Tiers/decorations reference roles so one palette change recolors the cake. */
export const paletteSchema = z.object({
  primary: hexColorSchema,
  secondary: hexColorSchema,
  accent: hexColorSchema,
});

export const paletteWithFinishSchema = paletteSchema.extend({
  accentFinish: accentFinishSchema.default("matte"),
});
