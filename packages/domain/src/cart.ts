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
  /** Optional cake dedication (e.g. "Happy 18th, Bea"). Part of the line's identity. */
  message?: string | undefined;
}

export const MAX_LINE_QUANTITY = 20;
export const MAX_MESSAGE_LENGTH = 40;
/** PLACEHOLDER flat fee (₱120). Real fees depend on the delivery area. */
export const DELIVERY_FEE_PLACEHOLDER: Centavos = 12_000;

const cleanMessage = (m: string | undefined) => (m ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);

/** Same product, size, flavor and message merge into one line; a different message is its own line. */
export const lineKey = (l: Pick<CartLine, "productId" | "sizeId" | "flavor"> & { message?: string | undefined }) =>
  `${l.productId}|${l.sizeId}|${l.flavor}|${cleanMessage(l.message)}`;

const clamp = (q: number) => Math.min(Math.max(Math.trunc(q), 0), MAX_LINE_QUANTITY);

const normalize = (l: CartLine): CartLine => {
  const message = cleanMessage(l.message);
  const { message: _drop, ...rest } = l;
  return message ? { ...rest, message } : rest;
};

export function addLine(lines: readonly CartLine[], line: CartLine): CartLine[] {
  const next = normalize(line);
  const key = lineKey(next);
  const existing = lines.find((l) => lineKey(l) === key);
  if (!existing) return [...lines, { ...next, quantity: Math.max(clamp(next.quantity), 1) }];
  return lines.map((l) => (lineKey(l) === key ? { ...l, quantity: clamp(l.quantity + next.quantity) } : l));
}

/** A quantity of 0 (or less) removes the line. */
export function setQuantity(lines: readonly CartLine[], key: string, quantity: number): CartLine[] {
  const q = clamp(quantity);
  return lines.flatMap((l) => (lineKey(l) !== key ? [l] : q === 0 ? [] : [{ ...l, quantity: q }]));
}

/** Edit a line's message. If another line already has the new identity, the two merge. */
export function setMessage(lines: readonly CartLine[], key: string, message: string): CartLine[] {
  const target = lines.find((l) => lineKey(l) === key);
  if (!target) return [...lines];
  const edited = normalize({ ...target, message });
  const newKey = lineKey(edited);
  if (newKey === key) return lines.map((l) => (lineKey(l) === key ? edited : l));
  const others = lines.filter((l) => lineKey(l) !== key);
  const twin = others.find((l) => lineKey(l) === newKey);
  if (!twin) return lines.map((l) => (lineKey(l) === key ? edited : l));
  return others.map((l) => (lineKey(l) === newKey ? { ...l, quantity: clamp(l.quantity + target.quantity) } : l));
}

export const removeLine = (lines: readonly CartLine[], key: string): CartLine[] => lines.filter((l) => lineKey(l) !== key);

export const cartUnits = (lines: readonly CartLine[]): number => lines.reduce((n, l) => n + l.quantity, 0);

export const cartSubtotal = (lines: readonly CartLine[]): Centavos => lines.reduce((sum, l) => sum + l.unitPriceCentavos * l.quantity, 0);

export const deliveryFee = (fulfillment: Fulfillment, lines: readonly CartLine[]): Centavos =>
  fulfillment === "delivery" && lines.length > 0 ? DELIVERY_FEE_PLACEHOLDER : 0;

export const orderTotal = (lines: readonly CartLine[], fulfillment: Fulfillment): Centavos => cartSubtotal(lines) + deliveryFee(fulfillment, lines);
