import type { Centavos } from "@cakeshop/utils";

// Pure cart rules shared by the website and the mobile app. A line snapshots name and unit price
// for display only: the server MUST recompute prices from the catalog when an order is created.

export type Fulfillment = "delivery" | "pickup";

export interface CartLine {
  productId: string;
  sizeId: string;
  flavor: string;
  name: string;
  sizeLabel: string;
  /** Presentation hint for the placeholder illustration. */
  tone: string;
  unitPriceCentavos: Centavos;
  quantity: number;
}

export const MAX_LINE_QUANTITY = 20;
/** PLACEHOLDER flat fee (₱120). Real fees depend on the delivery area. */
export const DELIVERY_FEE_PLACEHOLDER: Centavos = 12_000;

export const lineKey = (l: Pick<CartLine, "productId" | "sizeId" | "flavor">) => `${l.productId}|${l.sizeId}|${l.flavor}`;

const clamp = (q: number) => Math.min(Math.max(Math.trunc(q), 0), MAX_LINE_QUANTITY);

export function addLine(lines: readonly CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line);
  const existing = lines.find((l) => lineKey(l) === key);
  if (!existing) return [...lines, { ...line, quantity: Math.max(clamp(line.quantity), 1) }];
  return lines.map((l) => (lineKey(l) === key ? { ...l, quantity: clamp(l.quantity + line.quantity) } : l));
}

/** A quantity of 0 (or less) removes the line. */
export function setQuantity(lines: readonly CartLine[], key: string, quantity: number): CartLine[] {
  const q = clamp(quantity);
  return lines.flatMap((l) => (lineKey(l) !== key ? [l] : q === 0 ? [] : [{ ...l, quantity: q }]));
}

export const removeLine = (lines: readonly CartLine[], key: string): CartLine[] => lines.filter((l) => lineKey(l) !== key);

export const cartUnits = (lines: readonly CartLine[]): number => lines.reduce((n, l) => n + l.quantity, 0);

export const cartSubtotal = (lines: readonly CartLine[]): Centavos => lines.reduce((sum, l) => sum + l.unitPriceCentavos * l.quantity, 0);

export const deliveryFee = (fulfillment: Fulfillment, lines: readonly CartLine[]): Centavos =>
  fulfillment === "delivery" && lines.length > 0 ? DELIVERY_FEE_PLACEHOLDER : 0;

export const orderTotal = (lines: readonly CartLine[], fulfillment: Fulfillment): Centavos => cartSubtotal(lines) + deliveryFee(fulfillment, lines);
