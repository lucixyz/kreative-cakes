// PROTOTYPE storefront catalog (ready-made cakes). Prices, availability, dietary tags and allergen
// text are placeholders to be confirmed by the bakery; replaced by catalog tables later.
// Money is integer centavos.

export type ProductType = "whole" | "bento" | "cupcakes" | "pastries";
export type ProductOccasion = "birthday" | "wedding" | "anniversary" | "corporate";
export type DietaryTag = "eggless" | "sugar-free" | "nut-free";
export type Availability = { kind: "today" } | { kind: "preorder"; days: number } | { kind: "soldout" };

export interface ProductSize {
  id: string;
  label: string;
  serves: string;
  priceCentavos: number;
}

export interface StorefrontProduct {
  id: string;
  slug: string;
  name: string;
  /** Small caps label above the name, e.g. "BIRTHDAY". */
  label: string;
  /** Cake style shown after the label on the product page, e.g. "CHIFFON". */
  style: string;
  type: ProductType;
  occasion: ProductOccasion | null;
  description: string;
  availability: Availability;
  sizes: ProductSize[];
  flavors: string[];
  dietary: DietaryTag[];
  allergens: string;
  /** Drives the placeholder illustration until real photos exist. */
  look: { tiers: 1 | 2 | 3; color: string; tone: string };
}

const ALLERGENS = "Contains eggs, milk and wheat. Made in a kitchen that also handles nuts.";

/** Three sizes scaled from the listed (8-inch, default) price, rounded to whole ₱10. */
function sizes(basePesos: number): ProductSize[] {
  const price = (m: number) => Math.round((basePesos * m) / 10) * 10 * 100;
  return [
    { id: "6in", label: "6-inch", serves: "Serves 8–10", priceCentavos: price(0.78) },
    { id: "8in", label: "8-inch", serves: "Serves 14–18", priceCentavos: price(1) },
    { id: "10in", label: "10-inch", serves: "Serves 24–30", priceCentavos: price(1.4) },
  ];
}

export const storefrontProducts: StorefrontProduct[] = [
  {
    id: "sf_strawberry_chiffon", style: "CHIFFON", slug: "strawberry-chiffon-dream", name: "Strawberry Chiffon Dream", label: "BIRTHDAY", type: "whole", occasion: "birthday",
    description: "Light chiffon layers with fresh strawberries and whipped cream, finished with a soft pink buttercream and hand-piped rosettes.",
    availability: { kind: "today" }, sizes: sizes(1250), flavors: ["Strawberry", "Chocolate", "Ube"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 2, color: "#f4b6c6", tone: "#efe3e1" },
  },
  {
    id: "sf_dark_choco_ganache", style: "GANACHE", slug: "dark-chocolate-ganache", name: "Dark Chocolate Ganache", label: "CHOCOLATE", type: "whole", occasion: "birthday",
    description: "Dense dark chocolate sponge layered and covered with glossy ganache.",
    availability: { kind: "today" }, sizes: sizes(1480), flavors: ["Chocolate", "Mocha"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 2, color: "#4a2e26", tone: "#e6dfd3" },
  },
  {
    id: "sf_ube_macapuno", style: "UBE", slug: "ube-macapuno-layer-cake", name: "Ube Macapuno Layer Cake", label: "FILIPINO FAVORITES", type: "whole", occasion: "birthday",
    description: "Ube sponge layered with sweet macapuno strings and cream.",
    availability: { kind: "preorder", days: 2 }, sizes: sizes(1350), flavors: ["Ube"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 2, color: "#a98bd6", tone: "#e6e0ec" },
  },
  {
    id: "sf_two_tier_vanilla", style: "VANILLA", slug: "classic-two-tier-vanilla", name: "Classic Two-Tier Vanilla", label: "CELEBRATION", type: "whole", occasion: "wedding",
    description: "A classic vanilla celebration cake in two tiers, finished in smooth white buttercream.",
    availability: { kind: "preorder", days: 3 },
    sizes: [
      { id: "6-8in", label: "6 + 8-inch", serves: "Serves 24–30", priceCentavos: 390_000 },
      { id: "8-10in", label: "8 + 10-inch", serves: "Serves 40–50", priceCentavos: 520_000 },
    ],
    flavors: ["Vanilla", "Strawberry"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 3, color: "#fbf3ee", tone: "#ece4d8" },
  },
  {
    id: "sf_mango_torte", style: "TORTE", slug: "mango-cream-torte", name: "Mango Cream Torte", label: "FILIPINO FAVORITES", type: "whole", occasion: "anniversary",
    description: "Chiffon layers with sweet mango and whipped cream.",
    availability: { kind: "today" }, sizes: sizes(1180), flavors: ["Mango"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 1, color: "#f6c445", tone: "#f1e6cc" },
  },
  {
    id: "sf_red_velvet", style: "RED VELVET", slug: "red-velvet-classic", name: "Red Velvet Classic", label: "ANNIVERSARY", type: "whole", occasion: "anniversary",
    description: "Red velvet layers with cream cheese frosting.",
    availability: { kind: "soldout" }, sizes: sizes(1320), flavors: ["Red Velvet"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 2, color: "#b3263e", tone: "#efe1e0" },
  },
  {
    id: "sf_matcha_bento", style: "MATCHA", slug: "matcha-bento-cake", name: "Matcha Bento Cake", label: "BENTO CAKES", type: "bento", occasion: "birthday",
    description: "A small matcha cake for one or two, in a takeaway box.",
    availability: { kind: "today" }, sizes: [{ id: "bento", label: "Bento (4-inch)", serves: "Serves 1–2", priceCentavos: 48_000 }],
    flavors: ["Matcha"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 1, color: "#9bc27a", tone: "#e3e5db" },
  },
  {
    id: "sf_salted_caramel", style: "CARAMEL", slug: "salted-caramel-crunch", name: "Salted Caramel Crunch", label: "BIRTHDAY", type: "whole", occasion: "birthday",
    description: "Caramel sponge with salted caramel and a crunchy praline layer.",
    availability: { kind: "preorder", days: 1 }, sizes: sizes(1400), flavors: ["Caramel"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 2, color: "#d99a4a", tone: "#eadfd6" },
  },
  {
    id: "sf_lemon_blueberry_cupcakes", style: "LEMON", slug: "lemon-blueberry-cupcakes", name: "Lemon Blueberry Cupcakes (6)", label: "CUPCAKES", type: "cupcakes", occasion: "corporate",
    description: "Six lemon cupcakes with blueberry filling and cream cheese frosting.",
    availability: { kind: "today" }, sizes: [{ id: "box6", label: "Box of 6", serves: "6 cupcakes", priceCentavos: 42_000 }],
    flavors: ["Lemon Blueberry"], dietary: [], allergens: ALLERGENS,
    look: { tiers: 1, color: "#b9c6ec", tone: "#e5e5ea" },
  },
];

export function findStorefrontProduct(slug: string): StorefrontProduct | undefined {
  return storefrontProducts.find((p) => p.slug === slug);
}

/** The size shown first: the 8-inch where there is one, otherwise the first size. */
export function defaultProductSize(p: StorefrontProduct): ProductSize {
  return p.sizes.find((s) => s.id === "8in") ?? p.sizes[0]!;
}

/** The price shown on product cards: the default size. */
export function productListPrice(p: StorefrontProduct): number {
  return defaultProductSize(p).priceCentavos;
}

export function productStartingPrice(p: StorefrontProduct): number {
  return Math.min(...p.sizes.map((s) => s.priceCentavos));
}
