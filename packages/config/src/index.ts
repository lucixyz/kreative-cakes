/**
 * Locale / regional defaults. Single source of truth: change here, not in screens.
 * Money is always stored as integer centavos (minor units).
 */
export const LOCALE_CONFIG = {
  currency: "PHP",
  currencySymbol: "₱",
  /** Minor units per major unit (centavos per peso). */
  minorUnitsPerMajor: 100,
  locale: "en-PH",
  timezone: "Asia/Manila",
  /** Display + storage unit for cake diameter/height. */
  dimensionUnit: "in",
} as const;

export type LocaleConfig = typeof LOCALE_CONFIG;
