import { formatMoney } from "@cakeshop/utils";

/** Storefront price: ₱1,250 for whole pesos, ₱1,250.50 otherwise. */
export const peso = (centavos: number): string => formatMoney(centavos, { hideZeroCents: true });
