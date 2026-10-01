import { addLine, cartSubtotal, cartUnits, removeLine, setQuantity, type CartLine } from "@cakeshop/domain";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// PROTOTYPE: the cart lives in memory (lost when the app closes). Persistence arrives with accounts.
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const value = useMemo<CartApi>(
    () => ({
      lines,
      units: cartUnits(lines),
      subtotal: cartSubtotal(lines),
      add: (line) => setLines((l) => addLine(l, line)),
      setQty: (key, q) => setLines((l) => setQuantity(l, key, q)),
      remove: (key) => setLines((l) => removeLine(l, key)),
      clear: () => setLines([]),
    }),
    [lines],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
