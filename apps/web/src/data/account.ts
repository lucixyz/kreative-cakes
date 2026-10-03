// PROTOTYPE data for the signed-in customer area. Replaced by the API/Supabase later; amounts are whole pesos here.
export type Tone = "scheduled" | "review" | "ready" | "done" | "cancelled";

export type AccountOrder = {
  id: string;
  kind: "Custom cake" | "Ready-made";
  name: string;
  when: string;
  status: string;
  tone: Tone;
  total: string;
  action: string;
  to: string;
  tint: string;
  active: boolean;
};

export const ORDERS: AccountOrder[] = [
  { id: "CK-1042", kind: "Custom cake", name: "Butterfly 18th Birthday Cake", when: "Pickup Sat, Oct 17", status: "Scheduled", tone: "scheduled", total: "₱6,200 · ₱3,100 due", action: "Track order", to: "/orders/CK-1042", tint: "#eee6f4", active: true },
  { id: "CK-1047", kind: "Custom cake", name: "Rustic Wedding Cake", when: "Event Sat, Nov 14", status: "Quotation ready", tone: "review", total: "₱14,800", action: "Review quote", to: "/quotation", tint: "#ece7da", active: true },
  { id: "OR-2210", kind: "Ready-made", name: "Strawberry Chiffon Dream + 1 more", when: "Pickup today, 4:00–6:00 PM", status: "Ready for pickup", tone: "ready", total: "₱2,090 · paid", action: "View order", to: "/messages", tint: "#efe3e3", active: true },
  { id: "OR-2175", kind: "Ready-made", name: "Dark Chocolate Ganache", when: "Delivered Sep 21", status: "Completed", tone: "done", total: "₱1,600", action: "Leave a review", to: "/messages", tint: "#e6ded2", active: false },
  { id: "OR-2102", kind: "Ready-made", name: "Matcha Bento Cake", when: "Sep 2", status: "Cancelled · refunded", tone: "cancelled", total: "₱480", action: "Order again", to: "/shop", tint: "#e4e6dc", active: false },
];

export const SAVED_DESIGNS = [
  { name: "Garden Baptism Cake", meta: "2 tiers · est. ₱3,900", tint: "#eee6f4" },
  { name: "Office Anniversary Sheet", meta: "1 tier · est. ₱2,450", tint: "#e4e6dc" },
];

export type Msg = { mine: boolean; text: string; when: string };
export type Thread = { id: string; title: string; when: string; status: string; to: string; messages: Msg[] };

export const THREADS: Thread[] = [
  { id: "ck-1042", title: "CK-1042 · Butterfly 18th Cake", when: "Oct 3", status: "Scheduled", to: "/orders/CK-1042", messages: [
    { mine: false, text: "Hi! We adjusted the butterflies to wafer paper so they hold their shape. Quote is ready for you.", when: "Oct 3, 9:05 AM" },
    { mine: true, text: "Looks perfect, accepted! Paid the deposit via GCash.", when: "Oct 3, 11:24 AM" },
  ] },
  { id: "ck-1047", title: "CK-1047 · Rustic Wedding Cake", when: "Oct 1", status: "Quotation ready", to: "/quotation", messages: [
    { mine: false, text: "Thanks for your wedding design! Could you confirm the venue address for delivery?", when: "Oct 1, 4:12 PM" },
  ] },
  { id: "or-2210", title: "OR-2210 · Strawberry Chiffon + 1", when: "Today", status: "Ready for pickup", to: "/orders", messages: [
    { mine: false, text: "Your cupcakes are ready for pickup. See you soon!", when: "Today, 1:30 PM" },
  ] },
];

export const TRACKING_STEPS: { title: string; tag: string; when: string; state: "done" | "now" | "next" }[] = [
  { title: "Design submitted", tag: "", when: "Oct 2, 3:10 PM", state: "done" },
  { title: "Bakery review", tag: "Approved with small changes", when: "Oct 3, 9:05 AM", state: "done" },
  { title: "Quotation accepted", tag: "₱6,200", when: "Oct 3, 11:24 AM", state: "done" },
  { title: "Deposit verified", tag: "₱3,100 via GCash", when: "Oct 3, 11:40 AM", state: "done" },
  { title: "Scheduled for production", tag: "Baking starts Fri, Oct 16", when: "Now", state: "now" },
  { title: "Decorating", tag: "", when: "Fri, Oct 16 – Sat, Oct 17", state: "next" },
  { title: "Ready for pickup", tag: "Pay the balance first", when: "Sat, Oct 17, 2:00–4:00 PM", state: "next" },
];

export const QUOTE = {
  id: "CK-1042",
  title: "Butterfly 18th Birthday Cake",
  validUntil: "Fri, Oct 9",
  note: "We switched the butterflies to wafer paper so they hold their shape, and added a sturdier base board for the 3 tiers. Everything else is exactly as you designed it.",
  by: "Ana, head baker",
  lines: [
    ["3-tier base cake (12″, 9″, 6″)", 4200], ["Fondant finish", 600], ["Wafer-paper butterflies × 8", 480],
    ["Sugar flowers × 6", 360], ["“Happy 18th” topper", 250], ["Base board and supports", 310],
  ] as [string, number][],
  total: 6200,
};

export const POLICIES = {
  terms: { label: "Terms & Conditions", sections: [
    ["Orders", "Ready-made orders are confirmed once payment is verified. Unpaid orders expire after [X hours]."],
    ["Custom cakes and AI designs", "AI-generated designs are concepts. The finished cake may differ in color and detail from the preview. Final design and price come from the bakery quotation."],
    ["Deposits and balance", "Custom cakes require a [50%] deposit to reserve a production slot. The balance is due by [X days] before the event and before handover."],
    ["Uploaded images", "You confirm you have the right to upload them. We may decline copyrighted characters or logos."],
    ["Liability and governing law", "[To be completed with legal counsel.] These terms are governed by Philippine law."],
  ] },
  privacy: { label: "Privacy Policy", sections: [
    ["What we collect", "Account details, addresses, orders, messages, inspiration images and payment references. Card details are handled by our payment partner and never stored by us."],
    ["Why we use it", "To process orders, prepare quotations, deliver cakes, and contact you about your orders."],
    ["Who we share it with", "Our payment partner, delivery couriers, our hosting provider, and our AI provider for design analysis."],
    ["How long we keep it", "Unused inspiration images are deleted after [30 days]. Order records are kept for [X years] for tax purposes."],
    ["Your rights", "You can access, correct or delete your data, and contact our Data Protection Officer at [email]."],
  ] },
  refunds: { label: "Cancellation & refunds", sections: [
    ["Ready-made cakes", "Cakes are perishable, so we can’t accept returns. Report quality issues within [X hours] with photos."],
    ["Custom cake deposits", "Refundable minus a [₱300] fee until production is scheduled. Non-refundable once baking starts."],
    ["Changes after acceptance", "Changes create a revised quotation and may affect your balance. Changes are closed once baking starts."],
  ] },
  allergens: { label: "Allergen information", sections: [
    ["Common allergens", "Our cakes may contain eggs, milk, wheat, soy and nuts."],
    ["Cross-contamination", "All products are made in a kitchen that handles nuts and gluten. We can’t guarantee allergen-free cakes."],
    ["Tell us early", "Add allergies in your order notes or message the bakery before you pay. We’ll tell you what we can and can’t do."],
  ] },
  delivery: { label: "Delivery & pickup", sections: [
    ["Pickup", "Pick up at [store address] during opening hours. Bring your order number."],
    ["Delivery", "We deliver in zones with a fee that depends on your area. Delivery slots are confirmed after payment."],
    ["Handover", "Custom cakes are released once the balance is paid in full."],
  ] },
  faq: { label: "FAQs", sections: [
    ["How far ahead should I order?", "Ready-made cakes can be pre-ordered 1–3 days ahead. Custom cakes need at least 3 days, and 5 or more for 3+ tiers."],
    ["Can I change my design after paying the deposit?", "Yes, until production is scheduled. Changes create a revised quotation."],
    ["How do I pay?", "GCash, Maya, cards and online banking through our payment partner, or a bank transfer with proof."],
  ] },
} as const;
export type PolicyKey = keyof typeof POLICIES;
