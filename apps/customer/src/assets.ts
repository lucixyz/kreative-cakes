// Cake illustrations rendered to PNG by scripts/render-cake-png.mjs. Replace a file with a real photo
// (same name, 4:5 ratio) to swap it in. They are illustrations, not the bakery's own products.
import classicTwoTierVanilla from "../assets/images/classic-two-tier-vanilla.png";
import darkChocolateGanache from "../assets/images/dark-chocolate-ganache.png";
import lemonBlueberryCupcakes from "../assets/images/lemon-blueberry-cupcakes.png";
import mangoCreamTorte from "../assets/images/mango-cream-torte.png";
import matchaBentoCake from "../assets/images/matcha-bento-cake.png";
import redVelvetClassic from "../assets/images/red-velvet-classic.png";
import saltedCaramelCrunch from "../assets/images/salted-caramel-crunch.png";
import strawberryChiffonDream from "../assets/images/strawberry-chiffon-dream.png";
import ubeMacapunoLayerCake from "../assets/images/ube-macapuno-layer-cake.png";

const IMAGES: Record<string, number> = {
  "strawberry-chiffon-dream": strawberryChiffonDream,
  "dark-chocolate-ganache": darkChocolateGanache,
  "ube-macapuno-layer-cake": ubeMacapunoLayerCake,
  "classic-two-tier-vanilla": classicTwoTierVanilla,
  "mango-cream-torte": mangoCreamTorte,
  "red-velvet-classic": redVelvetClassic,
  "matcha-bento-cake": matchaBentoCake,
  "salted-caramel-crunch": saltedCaramelCrunch,
  "lemon-blueberry-cupcakes": lemonBlueberryCupcakes,
};

export const cakeImage = (slug: string): number | undefined => IMAGES[slug];
