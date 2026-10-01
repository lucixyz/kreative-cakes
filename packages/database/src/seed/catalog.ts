import type { Catalog } from "@cakeshop/types";

// PROTOTYPE mock catalog. Prices are integer centavos (₱1 = 100).
const base = { active: true, available: true };

export const mockCatalog: Catalog = {
  shapes: [
    { ...base, id: "shape_round", name: "Round", kind: "round", priceMultiplierBps: 10_000, sortOrder: 1 },
    { ...base, id: "shape_square", name: "Square", kind: "square", priceMultiplierBps: 10_500, sortOrder: 2 },
    { ...base, id: "shape_heart", name: "Heart", kind: "heart", priceMultiplierBps: 12_500, sortOrder: 3 },
  ],
  flavors: [
    { ...base, id: "flavor_vanilla", name: "Vanilla", priceCentavos: 0, sortOrder: 1 },
    { ...base, id: "flavor_chocolate", name: "Chocolate", priceCentavos: 0, sortOrder: 2 },
    { ...base, id: "flavor_red_velvet", name: "Red Velvet", priceCentavos: 15_000, sortOrder: 3 },
    { ...base, id: "flavor_ube", name: "Ube", priceCentavos: 15_000, sortOrder: 4 },
    { ...base, id: "flavor_mocha", name: "Mocha", priceCentavos: 10_000, sortOrder: 5 },
  ],
  fillings: [
    { ...base, id: "filling_buttercream", name: "Buttercream", priceCentavos: 0, sortOrder: 1 },
    { ...base, id: "filling_ganache", name: "Chocolate Ganache", priceCentavos: 20_000, sortOrder: 2 },
    { ...base, id: "filling_strawberry", name: "Strawberry Jam", priceCentavos: 10_000, sortOrder: 3 },
    { ...base, id: "filling_custard", name: "Custard", priceCentavos: 10_000, sortOrder: 4 },
    { ...base, id: "filling_caramel", name: "Salted Caramel", priceCentavos: 15_000, sortOrder: 5 },
  ],
  frostings: [
    { ...base, id: "frosting_buttercream", name: "Buttercream", priceCentavos: 0, sortOrder: 1 },
    { ...base, id: "frosting_fondant", name: "Fondant", priceCentavos: 40_000, sortOrder: 2 },
    { ...base, id: "frosting_ganache", name: "Ganache", priceCentavos: 30_000, sortOrder: 3 },
    { ...base, id: "frosting_whipped", name: "Whipped Cream", priceCentavos: 0, sortOrder: 4 },
  ],
  decorations: [
    { ...base, id: "deco_butterfly", name: "Sugar Butterfly", priceCentavos: 6_000, allowedZones: ["side", "top"], assetKey: "butterfly", sortOrder: 1 },
    { ...base, id: "deco_flower", name: "Sugar Flower", priceCentavos: 8_000, allowedZones: ["side", "top", "border", "base"], assetKey: "flower", sortOrder: 2 },
    { ...base, id: "deco_pearl", name: "Edible Pearls", priceCentavos: 1_500, allowedZones: ["border", "side", "base"], assetKey: "pearl", sortOrder: 3 },
    { ...base, id: "deco_star", name: "Star", priceCentavos: 2_500, allowedZones: ["top", "side"], assetKey: "star", sortOrder: 4 },
    { ...base, id: "deco_heart", name: "Heart", priceCentavos: 2_500, allowedZones: ["top", "side"], assetKey: "heart", sortOrder: 5 },
    { ...base, id: "deco_fruit", name: "Fresh Fruit", priceCentavos: 5_000, allowedZones: ["top", "base"], assetKey: "fruit", sortOrder: 6 },
    { ...base, id: "deco_chocolate", name: "Chocolate Pieces", priceCentavos: 3_000, allowedZones: ["top", "side", "base"], assetKey: "chocolate", sortOrder: 7 },
    // Deliberately unavailable: exercises the "no longer available" UI state.
    { ...base, available: false, id: "deco_gold_leaf", name: "Gold Leaf", priceCentavos: 20_000, allowedZones: ["top", "side"], sortOrder: 8 },
  ],
  toppers: [
    { ...base, id: "topper_text", name: "Text Topper", priceCentavos: 25_000, allowsText: true, sortOrder: 1 },
    { ...base, id: "topper_figurine", name: "Figurine Topper", priceCentavos: 60_000, allowsText: false, sortOrder: 2 },
  ],
  borders: [
    { ...base, id: "border_shell", name: "Shell Border", priceCentavos: 15_000, sortOrder: 1 },
    { ...base, id: "border_beaded", name: "Beaded Border", priceCentavos: 20_000, sortOrder: 2 },
    { ...base, id: "border_rope", name: "Rope Border", priceCentavos: 15_000, sortOrder: 3 },
  ],
  candles: [
    { ...base, id: "candle_stick", name: "Stick Candle", priceCentavos: 1_000, sortOrder: 1 },
    { ...base, id: "candle_number", name: "Number Candle", priceCentavos: 6_000, sortOrder: 2 },
  ],
  themes: [
    { ...base, id: "theme_butterfly_garden", name: "Butterfly Garden", priceCentavos: 0, sortOrder: 1 },
    { ...base, id: "theme_enchanted_forest", name: "Enchanted Forest", priceCentavos: 0, sortOrder: 2 },
    { ...base, id: "theme_floral_wedding", name: "Floral Wedding", priceCentavos: 0, sortOrder: 3 },
    { ...base, id: "theme_minimalist", name: "Minimalist", priceCentavos: 0, sortOrder: 4 },
  ],
  dietary: [
    { ...base, id: "diet_eggless", name: "Eggless", priceCentavos: 20_000, incompatibleFlavorIds: [], incompatibleFillingIds: ["filling_custard"], incompatibleFrostingIds: [], sortOrder: 1 },
    { ...base, id: "diet_sugar_free", name: "Sugar-free", priceCentavos: 50_000, incompatibleFlavorIds: [], incompatibleFillingIds: ["filling_caramel", "filling_strawberry"], incompatibleFrostingIds: ["frosting_fondant"], sortOrder: 2 },
    { ...base, id: "diet_gluten_free", name: "Gluten-free", priceCentavos: 60_000, incompatibleFlavorIds: ["flavor_red_velvet"], incompatibleFillingIds: [], incompatibleFrostingIds: [], sortOrder: 3 },
    { ...base, id: "diet_nut_free", name: "Nut-free", priceCentavos: 0, incompatibleFlavorIds: [], incompatibleFillingIds: [], incompatibleFrostingIds: [], sortOrder: 4 },
  ],
  defaults: {
    shapeId: "shape_round",
    flavorId: "flavor_vanilla",
    fillingId: "filling_buttercream",
    frostingId: "frosting_buttercream",
  },
};
