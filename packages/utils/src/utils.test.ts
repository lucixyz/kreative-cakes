import { describe, expect, it } from "vitest";
import { addDays, applyBps, assertCentavos, createSeededRandom, diffInDays, formatMoney, pesosToCentavos } from "./index";

describe("money", () => {
  it("converts pesos to integer centavos without float drift", () => {
    expect(pesosToCentavos(19.99)).toBe(1999);
    expect(pesosToCentavos(0.1 + 0.2)).toBe(30);
  });
  it("applies basis points with one rounding step", () => {
    expect(applyBps(10_001, 5000)).toBe(5001);
    expect(applyBps(100_000, 12_500)).toBe(125_000);
  });
  it("rejects non-integer centavos", () => {
    expect(() => assertCentavos(10.5)).toThrow();
  });
  it("formats PHP", () => {
    expect(formatMoney(123_456)).toContain("1,234.56");
  });
});

describe("dates", () => {
  it("computes day differences and additions", () => {
    expect(diffInDays("2026-10-01", "2026-10-04")).toBe(3);
    expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
  });
});

describe("seeded random", () => {
  it("is deterministic per seed", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe("formatMoney hideZeroCents", () => {
  it("drops .00 only for whole-peso amounts", () => {
    expect(formatMoney(125_000, { hideZeroCents: true })).toBe("₱1,250");
    expect(formatMoney(125_050, { hideZeroCents: true })).toBe("₱1,250.50");
    expect(formatMoney(125_000)).toBe("₱1,250.00");
  });
});
