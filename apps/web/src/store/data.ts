import type { CakeArtProps } from "./CakeArt";

// PROTOTYPE storefront content. Products come from @cakeshop/database; the rest is static copy
// until the CMS / catalog tables exist.

export const PROMO = "Free delivery on orders over ₱2,500 · Order custom cakes at least 3 days in advance";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cake-builder", label: "Custom Cakes" },
  { to: "/ai-designer", label: "AI Cake Designer" },
  { to: "/#about", label: "About" },
] as const;

export const OCCASIONS: { name: string; cake: CakeArtProps; tone: string }[] = [
  { name: "Birthday", cake: { tiers: 2, color: "#f2a7bd", topper: "candles", sprinkles: true }, tone: "#f9d9e2" },
  { name: "Wedding", cake: { tiers: 3, color: "#fbf3ee", topper: "flowers", drip: false }, tone: "#efe6df" },
  { name: "Anniversary", cake: { tiers: 2, color: "#c0405f", topper: "flowers" }, tone: "#f4cfd6" },
  { name: "Graduation", cake: { tiers: 1, color: "#3a4a8c", topper: "none", message: "Congrats!" }, tone: "#d5dbf0" },
  { name: "Baby Shower", cake: { tiers: 2, color: "#a9d6f0", topper: "butterfly" }, tone: "#dcedf8" },
  { name: "Corporate", cake: { tiers: 1, color: "#2f3b4c", shape: "square", drip: false }, tone: "#dde2ea" },
  { name: "Other Celebrations", cake: { tiers: 1, color: "#f6c445", sprinkles: true }, tone: "#fbeab8" },
];

/** Static display data layered on top of mockProducts by id. */
export const PRODUCT_DISPLAY: Record<string, { rating: number; reviews: number; cake: CakeArtProps; customizable: boolean }> = {
  prod_choco_fudge: { rating: 4.9, reviews: 212, cake: { tiers: 2, color: "#6b4033" }, customizable: true },
  prod_ube_cheese: { rating: 4.8, reviews: 174, cake: { tiers: 2, color: "#a98bd6", topper: "flowers" }, customizable: true },
  prod_red_velvet: { rating: 4.9, reviews: 138, cake: { tiers: 3, color: "#b3263e", drip: false }, customizable: true },
  prod_cupcakes_6: { rating: 4.7, reviews: 96, cake: { tiers: 1, color: "#f2a7bd", sprinkles: true, topper: "candles" }, customizable: false },
};

export const FLAVORS: { name: string; color: string }[] = [
  { name: "Chocolate", color: "#6b4033" },
  { name: "Vanilla", color: "#f3e3b3" },
  { name: "Red Velvet", color: "#b3263e" },
  { name: "Ube", color: "#a98bd6" },
  { name: "Strawberry", color: "#f08aa5" },
  { name: "Mocha", color: "#a47b5e" },
  { name: "Matcha", color: "#9bc27a" },
  { name: "Caramel", color: "#d99a4a" },
];

export const AI_STEPS = [
  { title: "Describe or Upload", text: "Tell us your idea or share an inspiration photo." },
  { title: "AI Creates a Concept", text: "Get a design concept in seconds." },
  { title: "Customize in 3D", text: "Adjust tiers, colors, flavors and decorations." },
  { title: "Submit to Bakery", text: "Our bakers review feasibility and your final price." },
  { title: "Order Your Cake", text: "Pay securely, then pick up or get it delivered." },
];

export const STYLES: { name: string; cake: CakeArtProps }[] = [
  { name: "Minimalist", cake: { tiers: 1, color: "#f6efe8", drip: false } },
  { name: "Floral", cake: { tiers: 2, color: "#f6c9d6", topper: "flowers", drip: false } },
  { name: "Butterfly", cake: { tiers: 2, color: "#d9c7f5", topper: "butterfly" } },
  { name: "Princess", cake: { tiers: 3, color: "#f7a8c8", topper: "candles", sprinkles: true } },
  { name: "Vintage", cake: { tiers: 2, color: "#f3e3d0", topper: "flowers", message: "Happy Day" } },
  { name: "Elegant Luxury", cake: { tiers: 3, color: "#22262e", topper: "none", drip: true } },
];

export const WHY = [
  { title: "Freshly Baked", text: "Baked the day it is picked up or delivered." },
  { title: "Made to Order", text: "Every cake is prepared for your date and details." },
  { title: "AI-Powered Design", text: "Turn an idea into a concept in seconds." },
  { title: "Interactive 3D Preview", text: "See your cake before the bakers start." },
  { title: "Secure Payments", text: "Pay with the methods you already use." },
  { title: "Pickup & Delivery", text: "Collect from the shop or have it delivered." },
];

export const REVIEWS = [
  { name: "Maria S.", rating: 5, cake: "Red Velvet Dream", text: "Moist, not too sweet, and exactly what we ordered for my mom's birthday." },
  { name: "Joshua D.", rating: 5, cake: "Custom 3-tier cake", text: "I described the design and the bakery matched it perfectly. Guests kept asking where we got it." },
  { name: "Aira P.", rating: 4, cake: "Ube Cheese Cake", text: "The ube flavor is the real thing. Delivery was on time and the cake arrived intact." },
];

export const OFFERS = [
  { title: "Birthday Bundle", text: "Cake + 6 cupcakes at a bundle price.", cta: "See bundle" },
  { title: "New customer? 10% off", text: "Create an account and get 10% off your first cake.", cta: "Create account" },
  { title: "Loyalty rewards", text: "Earn points on every order. Coming soon.", cta: "Learn more" },
];

export const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  { title: "Shop", links: [{ label: "All Cakes", to: "/shop" }, { label: "Custom Cakes", to: "/cake-builder" }, { label: "AI Designer", to: "/ai-designer" }, { label: "Cart", to: "/cart" }] },
  { title: "Help", links: [{ label: "Order Tracking", to: "/orders" }, { label: "FAQs", to: "/faq" }, { label: "Delivery Information", to: "/delivery" }, { label: "Contact", to: "/contact" }] },
  { title: "Policies", links: [{ label: "Refund / Cancellation", to: "/refunds" }, { label: "Privacy Policy", to: "/privacy" }, { label: "Terms", to: "/terms" }] },
];
