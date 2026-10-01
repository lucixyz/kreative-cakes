import { addLine, cartSubtotal, cartUnits, removeLine, setQuantity, type CartLine } from "@cakeshop/domain";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "kreative.cart.v1";

type CartApi = {
  lines: CartLine[];
  units: number;
  subtotal: number;
  add: (line: CartLine) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);

function isLine(v: unknown): v is CartLine {
  const l = v as CartLine;
  return !!l && typeof l.productId === "string" && typeof l.sizeId === "string" && typeof l.flavor === "string" && typeof l.name === "string" && typeof l.sizeLabel === "string" && typeof l.tone === "string" && Number.isSafeInteger(l.unitPriceCentavos) && Number.isSafeInteger(l.quantity);
}

function load(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: the cart still works for this visit */
    }
  }, [lines]);

  const add = useCallback((line: CartLine) => setLines((l) => addLine(l, line)), []);
  const setQty = useCallback((key: string, q: number) => setLines((l) => setQuantity(l, key, q)), []);
  const remove = useCallback((key: string) => setLines((l) => removeLine(l, key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => ({ lines, units: cartUnits(lines), subtotal: cartSubtotal(lines), add, setQty, remove, clear }), [lines, add, setQty, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
