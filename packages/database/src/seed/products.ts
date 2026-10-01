// PROTOTYPE mock ready-made products. Replaced by the `products` tables + ProductRepository later.
export interface MockProduct {
  id: string;
  name: string;
  category: string;
  /** Integer centavos. */
  startingPriceCentavos: number;
  description: string;
  dietaryTags: string[];
  madeToOrder: boolean;
}

export const mockProducts: MockProduct[] = [
  { id: "prod_choco_fudge", name: "Classic Chocolate Fudge", category: "Signature Cakes", startingPriceCentavos: 85_000, description: "Moist chocolate layers with rich fudge frosting.", dietaryTags: [], madeToOrder: false },
  { id: "prod_ube_cheese", name: "Ube Cheese Cake", category: "Signature Cakes", startingPriceCentavos: 95_000, description: "Ube sponge with cream cheese frosting.", dietaryTags: [], madeToOrder: false },
  { id: "prod_red_velvet", name: "Red Velvet Dream", category: "Signature Cakes", startingPriceCentavos: 110_000, description: "Red velvet with cream cheese filling.", dietaryTags: [], madeToOrder: true },
  { id: "prod_cupcakes_6", name: "Assorted Cupcakes (6)", category: "Cupcakes", startingPriceCentavos: 48_000, description: "Six cupcakes in assorted flavors.", dietaryTags: [], madeToOrder: false },
];
