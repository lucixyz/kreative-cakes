import type { DepositRules, PriceRules } from "@cakeshop/types";

// PROTOTYPE mock business rules. Later loaded from `business_settings`.
export const mockPriceRules: PriceRules = {
  currency: "PHP",
  basePerCubicInchCentavos: 180,
  extraTierFeeCentavos: 50_000,
  complexityMultiplierBps: { low: 10_000, medium: 11_000, high: 12_500 },
  rush: { windowDays: 3, feeCentavos: 100_000 },
};

export const mockDepositRules: DepositRules = {
  mode: "percent",
  value: 5_000,
  fullPaymentWithinDays: 3,
  balanceDueDaysBefore: 2,
};
