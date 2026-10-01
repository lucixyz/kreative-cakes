import { describe, expect, it } from "vitest";
import { aiDesignSuggestionSchema, cakeDesignSchema, catalogSchema } from "./index";

// Local fixture (validation must not depend on @cakeshop/database).
const valid = {
  id: "d1",
  name: "Test",
  source: "manual",
  shapeId: "shape_round",
  tiers: [
    { diameter: 10, height: 4, colorRole: "primary", flavorId: "f", fillingId: "fl" },
    { diameter: 8, height: 4, colorRole: "secondary", flavorId: "f", fillingId: "fl" },
  ],
  frostingId: "fr",
  palette: { primary: "#F7C8D0", secondary: "#FFFFFF", accent: "#D4AF37", accentFinish: "metallic" },
  decorations: [],
  dietaryOptionIds: [],
  servingEstimate: 10,
  complexity: "low",
  version: 1,
  schemaVersion: 1,
};

describe("cakeDesignSchema", () => {
  it("accepts a valid design", () => {
    expect(cakeDesignSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a tier that is not smaller than the one below", () => {
    const bad = { ...valid, tiers: [valid.tiers[0], { ...valid.tiers[1], diameter: 9 }] };
    const res = cakeDesignSchema.safeParse(bad);
    expect(res.success).toBe(false);
    expect(JSON.stringify(res.error?.issues)).toContain("narrower");
  });

  it("rejects out-of-range dimensions, >4 tiers and long messages", () => {
    expect(cakeDesignSchema.safeParse({ ...valid, tiers: [{ ...valid.tiers[0], diameter: 30 }] }).success).toBe(false);
    const five = [16, 14, 12, 10, 8].map((diameter) => ({ ...valid.tiers[0], diameter }));
    expect(cakeDesignSchema.safeParse({ ...valid, tiers: five }).success).toBe(false);
    expect(cakeDesignSchema.safeParse({ ...valid, message: { text: "x".repeat(41), placement: "top" } }).success).toBe(false);
  });

  it("rejects bad hex colors and decorations targeting a missing tier", () => {
    expect(cakeDesignSchema.safeParse({ ...valid, palette: { ...valid.palette, primary: "pink" } }).success).toBe(false);
    const deco = { decorationId: "d", quantity: 2, placement: { tierIndex: 5, zone: "side", distribution: "even" } };
    expect(cakeDesignSchema.safeParse({ ...valid, decorations: [deco] }).success).toBe(false);
  });
});

describe("aiDesignSuggestionSchema", () => {
  it("accepts a sparse suggestion and defaults follow-ups", () => {
    const res = aiDesignSuggestionSchema.parse({ occasion: "Birthday" });
    expect(res.followUpQuestions).toEqual([]);
  });
  it("rejects malformed output and more than 2 follow-ups", () => {
    expect(aiDesignSuggestionSchema.safeParse({ tiers: "three" }).success).toBe(false);
    expect(aiDesignSuggestionSchema.safeParse({ followUpQuestions: ["a", "b", "c"] }).success).toBe(false);
  });
});

describe("catalogSchema", () => {
  it("rejects non-integer money", () => {
    const res = catalogSchema.safeParse({
      shapes: [], flavors: [{ id: "f", name: "F", priceCentavos: 10.5 }], fillings: [], frostings: [], decorations: [],
      toppers: [], borders: [], candles: [], themes: [], dietary: [],
      defaults: { shapeId: "s", flavorId: "f", fillingId: "f", frostingId: "f" },
    });
    expect(res.success).toBe(false);
  });
});
