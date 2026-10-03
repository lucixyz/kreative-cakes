// PROTOTYPE data for the signed-in customer screens. Replaced by the API later.
import type { StatusTone } from "../components/kit";

export type AccountOrder = { id: string; kind: string; name: string; when: string; status: string; tone: StatusTone; total: string; active: boolean; tint: string };

export const ORDERS: AccountOrder[] = [
  { id: "CK-1042", kind: "Custom cake", name: "Butterfly 18th Birthday Cake", when: "Pickup Sat, Oct 17", status: "Scheduled", tone: "scheduled", total: "₱6,200 · ₱3,100 due", active: true, tint: "#EEE6F4" },
  { id: "CK-1047", kind: "Custom cake", name: "Rustic Wedding Cake", when: "Event Sat, Nov 14", status: "Quotation ready", tone: "review", total: "₱14,800", active: true, tint: "#ECE7DA" },
  { id: "OR-2210", kind: "Ready-made", name: "Strawberry Chiffon Dream + 1 more", when: "Pickup today, 4:00–6:00 PM", status: "Ready for pickup", tone: "ready", total: "₱2,090 · paid", active: true, tint: "#EFE3E3" },
  { id: "OR-2175", kind: "Ready-made", name: "Dark Chocolate Ganache", when: "Delivered Sep 21", status: "Completed", tone: "done", total: "₱1,600", active: false, tint: "#E6DED2" },
  { id: "OR-2102", kind: "Ready-made", name: "Matcha Bento Cake", when: "Sep 2", status: "Cancelled · refunded", tone: "cancelled", total: "₱480", active: false, tint: "#E4E6DC" },
];

export const STEPS: { title: string; when: string; state: "done" | "now" | "next" }[] = [
  { title: "Design submitted", when: "Oct 2, 3:10 PM", state: "done" },
  { title: "Bakery review", when: "Oct 3, 9:05 AM", state: "done" },
  { title: "Quotation accepted · ₱6,200", when: "Oct 3, 11:24 AM", state: "done" },
  { title: "Deposit verified · ₱3,100", when: "Oct 3, 11:40 AM", state: "done" },
  { title: "Scheduled for production", when: "Baking starts Fri, Oct 16", state: "now" },
  { title: "Decorating", when: "Fri, Oct 16 – Sat, Oct 17", state: "next" },
  { title: "Ready for pickup", when: "Sat, Oct 17, 2:00–4:00 PM", state: "next" },
];

export type Msg = { mine: boolean; text: string; when: string };
export const THREAD: Msg[] = [
  { mine: false, text: "Hi! We adjusted the butterflies to wafer paper so they hold their shape. Quote is ready for you.", when: "Oct 3, 9:05 AM" },
  { mine: true, text: "Looks perfect, accepted! Paid the deposit via GCash.", when: "Oct 3, 11:24 AM" },
  { mine: false, text: "Deposit verified. See you on the 17th!", when: "Oct 3, 2:05 PM" },
];

export const ACCOUNT_LINKS: { label: string; badge?: number; to: string }[] = [
  { label: "My orders", to: "/orders" }, { label: "Quotations", badge: 1, to: "/orders" },
  { label: "Messages", badge: 1, to: "/messages" }, { label: "Saved designs", to: "/ai-designer" },
];
export const LEGAL_LINKS = ["Help & FAQs", "Terms & Conditions", "Privacy Policy", "Cancellation & refunds"];
