import { describe, expect, it } from "vitest";
import { demoButterflyCake, mockCatalog, mockPriceRules } from "@cakeshop/database";
import { aiDesignSuggestionSchema, cakeDesignSchema } from "@cakeshop/validation";
import { sampleAISuggestion } from "@cakeshop/database";
import type { CakeDesign } from "@cakeshop/types";
import {
  calculateCakeEstimate,
  colorNameToHex,
  deriveComplexity,
  estimateServings,
  finalizeDesign,
  findUnavailableRefs,
  hasBlockingIssues,
  isMetallicColorName,
  validateDesignConstraints,
} from "./index";

const design = (patch: Partial<CakeDesign>): CakeDesign => ({ ...demoButterflyCake, ...patch });
const codes = (d: CakeDesign) => validateDesignConstraints(d, mockCatalog).map((i) => i.code);

describe("demo data", () => {
  it("demo cake and sample AI output match their schemas", () => {
    expect(cakeDesignSchema.safeParse(demoButterflyCake).success).toBe(true);
    expect(aiDesignSuggestionSchema.safeParse(sampleAISuggestion).success).toBe(true);
  });
  it("finalizeDesign reproduces the seed's derived fields", () => {
    const f = finalizeDesign(demoButterflyCake, mockCatalog);
    expect(f.servingEstimate).toBe(demoButterflyCake.servingEstimate);
    expect(f.complexity).toBe("medium");
  });
});

describe("servings", () => {
  it("uses tier volume / 8 cu in", () => {
    // 10"x4" round = 314.16 cu in -> 39; 8" -> 25; 6" -> 14
    expect(estimateServings(demoButterflyCake, mockCatalog)).toBe(78);
  });
  it("treats square tiers as larger than round", () => {
    const sq = design({ shapeId: "shape_square" });
    expect(estimateServings(sq, mockCatalog)).toBeGreaterThan(78);
  });
});

describe("complexity", () => {
  it("is at least medium for 3+ tiers and high for 4 tiers", () => {
    expect(deriveComplexity(design({ decorations: [] }), mockCatalog)).toBe("medium");
    const four = design({
      tiers: [14, 12, 10, 8].map((diameter) => ({ ...demoButterflyCake.tiers[0]!, diameter })),
    });
    expect(deriveComplexity(four, mockCatalog)).toBe("high");
  });
  it("single plain tier is low", () => {
    expect(deriveComplexity(design({ tiers: [demoButterflyCake.tiers[0]!], decorations: [] }), mockCatalog)).toBe("low");
  });
});

describe("constraints", () => {
  it("demo cake has no blocking issues but warns about supports", () => {
    const issues = validateDesignConstraints(demoButterflyCake, mockCatalog);
    expect(hasBlockingIssues(issues)).toBe(false);
    expect(issues.map((i) => i.code)).toContain("REQUIRES_SUPPORTS");
  });
  it("limits heart cakes to 2 tiers", () => {
    expect(codes(design({ shapeId: "shape_heart" }))).toContain("TIER_COUNT_EXCEEDS_SHAPE");
  });
  it("rejects a decoration in a disallowed zone", () => {
    const d = design({
      decorations: [{ decorationId: "deco_butterfly", quantity: 2, placement: { tierIndex: 0, zone: "base", distribution: "even" } }],
    });
    expect(codes(d)).toContain("DECORATION_ZONE_NOT_ALLOWED");
  });
  it("warns when too many decorations are requested", () => {
    const d = design({
      decorations: [{ decorationId: "deco_pearl", quantity: 60, placement: { tierIndex: 2, zone: "top", distribution: "even" } }],
    });
    expect(codes(d)).toContain("DECORATION_QUANTITY_EXCEEDED");
  });
  it("flags incompatible dietary options", () => {
    expect(codes(design({ dietaryOptionIds: ["diet_sugar_free"] }))).toContain("DIETARY_INCOMPATIBLE"); // fondant
  });
  it("flags unavailable catalog options instead of crashing", () => {
    const d = design({
      decorations: [{ decorationId: "deco_gold_leaf", quantity: 1, placement: { tierIndex: 0, zone: "top", distribution: "even" } }],
    });
    expect(findUnavailableRefs(d, mockCatalog)[0]?.problem).toBe("unavailable");
    expect(codes(d)).toContain("OPTION_UNAVAILABLE");
  });
});

describe("pricing", () => {
  const est = calculateCakeEstimate(demoButterflyCake, mockCatalog, mockPriceRules);

  it("is an integer-centavo estimate whose lines sum to the total", () => {
    expect(est.isEstimate).toBe(true);
    expect(est.lineItems.every((l) => Number.isInteger(l.amount) && Number.isInteger(l.unitPrice))).toBe(true);
    expect(est.lineItems.reduce((s, l) => s + l.amount, 0)).toBe(est.estimatedTotal);
  });
  it("prices the first tier by volume (10x4 round = 314.16 cu in x 180)", () => {
    expect(est.lineItems.find((l) => l.code === "TIER_1_BASE")?.amount).toBe(56_549);
  });
  it("applies a complexity adjustment and multi-tier fee", () => {
    expect(est.lineItems.some((l) => l.code === "COMPLEXITY")).toBe(true);
    expect(est.lineItems.find((l) => l.code === "TIER_STRUCTURE")?.quantity).toBe(2);
    expect(est.estimatedTotal).toBeGreaterThan(est.subtotal);
  });
  it("adds more decorations -> higher price", () => {
    const more = design({
      decorations: [
        ...demoButterflyCake.decorations,
        { decorationId: "deco_flower", quantity: 6, placement: { tierIndex: "all", zone: "side", distribution: "even" } },
      ],
    });
    expect(calculateCakeEstimate(more, mockCatalog, mockPriceRules).estimatedTotal).toBeGreaterThan(est.estimatedTotal);
  });
  it("adds a rush fee inside the rush window only", () => {
    const rush = calculateCakeEstimate(demoButterflyCake, mockCatalog, mockPriceRules, { today: "2026-10-01", requestedDate: "2026-10-03" });
    const normal = calculateCakeEstimate(demoButterflyCake, mockCatalog, mockPriceRules, { today: "2026-10-01", requestedDate: "2026-10-20" });
    expect(rush.estimatedTotal - normal.estimatedTotal).toBe(mockPriceRules.rush.feeCentavos);
  });
  it("warns instead of pricing unavailable options", () => {
    const d = design({
      decorations: [{ decorationId: "deco_gold_leaf", quantity: 3, placement: { tierIndex: 0, zone: "top", distribution: "even" } }],
    });
    const e = calculateCakeEstimate(d, mockCatalog, mockPriceRules);
    expect(e.warnings.length).toBeGreaterThan(0);
    expect(e.lineItems.some((l) => l.code.startsWith("DECO_"))).toBe(false);
  });
  it("changing the palette never changes the price", () => {
    const purple = design({ palette: { ...demoButterflyCake.palette, primary: "#8E5BB5" } });
    expect(calculateCakeEstimate(purple, mockCatalog, mockPriceRules).estimatedTotal).toBe(est.estimatedTotal);
  });
});

describe("colors", () => {
  it("maps names to hex and detects metallics", () => {
    expect(colorNameToHex("Pink")).toBe("#F7C8D0");
    expect(colorNameToHex("dark  green")).toBe("#1F4D2E");
    expect(colorNameToHex("nonsense")).toBeUndefined();
    expect(isMetallicColorName("gold")).toBe(true);
    expect(isMetallicColorName("pink")).toBe(false);
  });
});
