import { z } from "zod";
import { accentFinishSchema, colorRoleSchema, complexitySchema, messagePlacementSchema } from "./enums";
import { placementSchema } from "./placement";

/**
 * Raw structured output of any AIProvider. Deliberately lenient (almost everything optional,
 * hex colors unchecked) because the normalizer in @cakeshop/ai clamps/repairs it into a CakeDesign.
 * Nothing consumes this before it passes this schema.
 */
export const aiTierSuggestionSchema = z.object({
  diameter: z.number(),
  height: z.number(),
  colorRole: colorRoleSchema.optional(),
  flavorId: z.string().optional(),
  fillingId: z.string().optional(),
});

export const aiDecorationSuggestionSchema = z.object({
  decorationId: z.string(),
  quantity: z.number(),
  placement: placementSchema.optional(),
  colorRole: colorRoleSchema.optional(),
});

export const aiDesignSuggestionSchema = z.object({
  occasion: z.string().optional(),
  theme: z.string().optional(),
  palette: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      accentFinish: accentFinishSchema.optional(),
    })
    .optional(),
  shapeId: z.string().optional(),
  tiers: z.array(aiTierSuggestionSchema).optional(),
  frostingId: z.string().optional(),
  decorations: z.array(aiDecorationSuggestionSchema).optional(),
  topper: z.object({ topperId: z.string(), text: z.string().optional() }).optional(),
  message: z.object({ text: z.string(), placement: messagePlacementSchema.optional() }).optional(),
  dietaryOptionIds: z.array(z.string()).optional(),
  complexity: complexitySchema.optional(),
  suggestedServings: z.number().optional(),
  /** Up to 2 optional chips shown to the user; never blocks generation. */
  followUpQuestions: z.array(z.string()).max(2).default([]),
  confidence: z.number().min(0).max(1).optional(),
});

/** Request body for POST /ai/design-requests (input side of the pipeline). */
export const aiDesignRequestSchema = z.object({
  prompt: z.string().trim().max(1000).optional(),
  guestCount: z.number().int().positive().max(1000).optional(),
  occasion: z.string().max(80).optional(),
  preferredColors: z.array(z.string()).max(6).optional(),
  dietaryOptionIds: z.array(z.string()).optional(),
  /** Storage path of an already-uploaded inspiration image (signed upload flow). */
  inspirationImagePath: z.string().optional(),
});
