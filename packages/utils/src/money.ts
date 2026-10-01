import { LOCALE_CONFIG } from "@cakeshop/config";

/** All money is integer centavos. These helpers are the only place conversion happens. */
export type Centavos = number;

export function assertCentavos(value: number): Centavos {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Money must be an integer number of centavos, got ${value}`);
  }
  return value;
}

/** Converts a major-unit decimal (e.g. from a form field) to integer centavos. */
export function pesosToCentavos(pesos: number): Centavos {
  return Math.round(pesos * LOCALE_CONFIG.minorUnitsPerMajor);
}

/** Applies a basis-points rate (10000 = 100%) with a single rounding step. */
export function applyBps(amount: Centavos, bps: number): Centavos {
  return Math.round((amount * bps) / 10_000);
}

export function formatMoney(
  amount: Centavos,
  options: { currency?: string; locale?: string } = {},
): string {
  const { currency = LOCALE_CONFIG.currency, locale = LOCALE_CONFIG.locale } = options;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount / LOCALE_CONFIG.minorUnitsPerMajor,
  );
}
