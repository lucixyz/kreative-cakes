import type { AIDesignSuggestion, CakeDesign } from "@cakeshop/types";

/**
 * The core demo cake (§40): three tiers, pink/white/gold, metallic accent, butterflies.
 * servingEstimate (78) and complexity are what `finalizeDesign` derives; a domain test asserts it.
 */
export const demoButterflyCake: CakeDesign = {
  id: "demo_butterfly_18th",
  name: "Butterfly Garden 18th",
  source: "ai_text",
  shapeId: "shape_round",
  tiers: [
    { diameter: 10, height: 4, colorRole: "primary", flavorId: "flavor_vanilla", fillingId: "filling_buttercream" },
    { diameter: 8, height: 4, colorRole: "secondary", flavorId: "flavor_chocolate", fillingId: "filling_ganache" },
    { diameter: 6, height: 4, colorRole: "primary", flavorId: "flavor_vanilla", fillingId: "filling_strawberry" },
  ],
  frostingId: "frosting_fondant",
  palette: { primary: "#F7C8D0", secondary: "#FFFFFF", accent: "#D4AF37", accentFinish: "metallic" },
  decorations: [
    {
      decorationId: "deco_butterfly",
      quantity: 8,
      placement: { tierIndex: "all", zone: "side", distribution: "cascade" },
      colorRole: "accent",
    },
  ],
  topper: { topperId: "topper_text", text: "Happy 18th" },
  themeId: "theme_butterfly_garden",
  dietaryOptionIds: [],
  servingEstimate: 78,
  complexity: "medium",
  aiMetadata: { occasion: "18th Birthday", detectedTheme: "Butterfly Garden", confidence: 0.8, warnings: [] },
  version: 1,
  schemaVersion: 1,
};

/** The example AI output from the spec (§14), used by schema/normalizer tests. */
export const sampleAISuggestion: AIDesignSuggestion = {
  occasion: "18th Birthday",
  theme: "Butterfly Garden",
  palette: { primary: "#F7C8D0", secondary: "#FFFFFF", accent: "#D4AF37", accentFinish: "metallic" },
  shapeId: "shape_round",
  tiers: [
    { diameter: 10, height: 4, colorRole: "primary" },
    { diameter: 8, height: 4, colorRole: "secondary" },
    { diameter: 6, height: 4, colorRole: "primary" },
  ],
  frostingId: "frosting_fondant",
  decorations: [
    {
      decorationId: "deco_butterfly",
      quantity: 8,
      placement: { tierIndex: "all", zone: "side", distribution: "cascade" },
      colorRole: "accent",
    },
  ],
  topper: { topperId: "topper_text", text: "Happy 18th" },
  complexity: "medium",
  suggestedServings: 60,
  followUpQuestions: [],
  confidence: 0.8,
};
