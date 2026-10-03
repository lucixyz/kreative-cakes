import { describe, expect, it } from "vitest";
import { DELIVERY_FEE_PLACEHOLDER, MAX_LINE_QUANTITY, MAX_MESSAGE_LENGTH, addLine, setMessage, cartSubtotal, cartUnits, lineKey, orderTotal, removeLine, setQuantity, type CartLine } from "./cart";

const chiffon: CartLine = { productId: "p1", sizeId: "8in", flavor: "Strawberry", name: "Chiffon", sizeLabel: "8-inch", tone: "#fff", unitPriceCentavos: 125_000, quantity: 1 };
const cupcakes: CartLine = { productId: "p2", sizeId: "box6", flavor: "Lemon", name: "Cupcakes", sizeLabel: "Box of 6", tone: "#fff", unitPriceCentavos: 42_000, quantity: 2 };

describe("cart", () => {
  it("merges the same product, size and flavor", () => {
    const lines = addLine(addLine([], chiffon), chiffon);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.quantity).toBe(2);
  });

  it("keeps different flavors as separate lines", () => {
    expect(addLine([chiffon], { ...chiffon, flavor: "Ube" })).toHaveLength(2);
  });

  it("keeps different messages as separate lines and trims them", () => {
    const lines = addLine(addLine([], { ...chiffon, message: "  Happy 18th  " }), { ...chiffon, message: "Happy 21st" });
    expect(lines).toHaveLength(2);
    expect(lines[0]?.message).toBe("Happy 18th");
    expect(addLine(lines, { ...chiffon, message: "Happy 18th" })[0]?.quantity).toBe(2);
    expect(addLine([], { ...chiffon, message: "x".repeat(99) })[0]?.message).toHaveLength(MAX_MESSAGE_LENGTH);
  });

  it("edits a message, merging with an identical line", () => {
    const a = addLine([], { ...chiffon, message: "Hello" });
    const edited = setMessage(a, lineKey({ ...chiffon, message: "Hello" }), "Hi");
    expect(edited[0]?.message).toBe("Hi");
    const two = addLine(a, { ...chiffon, message: "Hi" });
    expect(setMessage(two, lineKey({ ...chiffon, message: "Hello" }), "Hi")).toHaveLength(1);
    expect(setMessage(a, lineKey({ ...chiffon, message: "Hello" }), "")[0]?.message).toBeUndefined();
  });

  it("caps quantity and removes at zero", () => {
    expect(setQuantity([chiffon], lineKey(chiffon), 999)[0]?.quantity).toBe(MAX_LINE_QUANTITY);
    expect(setQuantity([chiffon], lineKey(chiffon), 0)).toEqual([]);
    expect(removeLine([chiffon, cupcakes], lineKey(chiffon))).toEqual([cupcakes]);
  });

  it("totals in integer centavos, adding delivery only for delivery orders", () => {
    const lines = [chiffon, cupcakes];
    expect(cartUnits(lines)).toBe(3);
    expect(cartSubtotal(lines)).toBe(209_000);
    expect(orderTotal(lines, "pickup")).toBe(209_000);
    expect(orderTotal(lines, "delivery")).toBe(209_000 + DELIVERY_FEE_PLACEHOLDER);
    expect(orderTotal([], "delivery")).toBe(0);
  });
});
