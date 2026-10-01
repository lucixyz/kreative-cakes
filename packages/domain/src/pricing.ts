import type { CakeDesign, Catalog, PriceRules } from "@cakeshop/types";
import { applyBps, diffInDays, type Centavos, type IsoDate } from "@cakeshop/utils";
import { findById, shapeKindOf } from "./catalog-lookup";
import { tierVolumeCuIn } from "./shapes";

export interface PriceLineItem {
  code: string;
  label: string;
  quantity: number;
  unitPrice: Centavos;
  amount: Centavos;
}

export interface CakeEstimate {
  lineItems: PriceLineItem[];
  /** Sum of item lines, before complexity and rush adjustments. */
  subtotal: Centavos;
  estimatedTotal: Centavos;
  currency: string;
  isEstimate: true;
  warnings: string[];
}

export interface EstimateContext {
  requestedDate?: IsoDate;
  today?: IsoDate;
}

/**
 * Pure, deterministic estimate. Runs on the client for display and on the server for the
 * authoritative recalculation; the server never trusts a client-sent price.
 * Money is integer centavos; geometry uses floats but is rounded once per line.
 * Delivery fees are added separately at checkout.
 */
export function calculateCakeEstimate(
  design: CakeDesign,
  catalog: Catalog,
  rules: PriceRules,
  context: EstimateContext = {},
): CakeEstimate {
  const items: PriceLineItem[] = [];
  const warnings: string[] = [];
  const push = (code: string, label: string, quantity: number, unitPrice: Centavos, amount = quantity * unitPrice) => {
    if (quantity > 0) items.push({ code, label, quantity, unitPrice, amount });
  };
  const lookup = <T extends { id: string; name: string; active: boolean; available: boolean }>(list: readonly T[], id: string): T | undefined => {
    const item = findById(list, id);
    if (!item || !item.active || !item.available) {
      warnings.push(`"${item?.name ?? id}" is no longer available and was not priced.`);
      return undefined;
    }
    return item;
  };

  const shape = lookup(catalog.shapes, design.shapeId);
  const kind = shapeKindOf(catalog, design.shapeId);
  const shapeBps = shape?.priceMultiplierBps ?? 10_000;

  design.tiers.forEach((tier, i) => {
    const volume = tierVolumeCuIn(kind, tier.diameter, tier.height);
    const base = applyBps(Math.round(volume * rules.basePerCubicInchCentavos), shapeBps);
    push(`TIER_${i + 1}_BASE`, `Tier ${i + 1} (${tier.diameter}" × ${tier.height}")`, 1, base);
  });
  push("TIER_STRUCTURE", "Multi-tier structure", design.tiers.length - 1, rules.extraTierFeeCentavos);

  const perTier = <T extends { id: string; name: string; active: boolean; available: boolean; priceCentavos: number }>(
    prefix: string,
    list: readonly T[],
    ids: readonly string[],
  ) => {
    const counts = new Map<string, number>();
    ids.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    counts.forEach((count, id) => {
      const item = lookup(list, id);
      if (item) push(`${prefix}_${id}`, item.name, count, item.priceCentavos);
    });
  };
  perTier("FLAVOR", catalog.flavors, design.tiers.map((t) => t.flavorId));
  perTier("FILLING", catalog.fillings, design.tiers.map((t) => t.fillingId));
  perTier("FROSTING", catalog.frostings, design.tiers.map(() => design.frostingId));

  for (const deco of design.decorations) {
    const item = lookup(catalog.decorations, deco.decorationId);
    if (item) push(`DECO_${item.id}`, item.name, deco.quantity, item.priceCentavos);
  }
  if (design.borderStyleId) {
    const item = lookup(catalog.borders, design.borderStyleId);
    if (item) push(`BORDER_${item.id}`, item.name, 1, item.priceCentavos);
  }
  if (design.topper) {
    const item = lookup(catalog.toppers, design.topper.topperId);
    if (item) push(`TOPPER_${item.id}`, item.name, 1, item.priceCentavos);
  }
  if (design.candles) {
    const item = lookup(catalog.candles, design.candles.candleId);
    if (item) push(`CANDLE_${item.id}`, item.name, design.candles.quantity, item.priceCentavos);
  }
  if (design.themeId) {
    const item = lookup(catalog.themes, design.themeId);
    if (item) push(`THEME_${item.id}`, item.name, 1, item.priceCentavos);
  }
  for (const id of design.dietaryOptionIds) {
    const item = lookup(catalog.dietary, id);
    if (item) push(`DIETARY_${item.id}`, `${item.name} surcharge`, 1, item.priceCentavos);
  }

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);

  const multiplierBps = rules.complexityMultiplierBps[design.complexity];
  const complexityAmount = applyBps(subtotal, multiplierBps) - subtotal;
  if (complexityAmount > 0) push("COMPLEXITY", `${design.complexity} complexity adjustment`, 1, complexityAmount);

  if (context.requestedDate && context.today && diffInDays(context.today, context.requestedDate) < rules.rush.windowDays) {
    push("RUSH", "Rush fee", 1, rules.rush.feeCentavos);
  }

  return {
    lineItems: items,
    subtotal,
    estimatedTotal: items.reduce((sum, i) => sum + i.amount, 0),
    currency: rules.currency,
    isEstimate: true,
    warnings,
  };
}
