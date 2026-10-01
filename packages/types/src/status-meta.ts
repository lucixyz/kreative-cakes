import type { OrderStatus, PaymentStatus, PaymentTransactionStatus } from "./inferred";

/**
 * Centralized status presentation. Screens must read labels/tones/icons from here.
 * `tone` is a semantic token (mapped to colors in packages/ui); `icon` is a neutral icon
 * name so status is never conveyed by color alone.
 */
export type StatusTone = "neutral" | "info" | "progress" | "success" | "warning" | "danger";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
  icon: string;
  customerDescription: string;
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "warning", icon: "wallet", customerDescription: "Upload your payment proof to confirm this order." },
  CONFIRMED: { label: "Confirmed", tone: "success", icon: "check-circle", customerDescription: "Payment verified. We'll start preparing soon." },
  PREPARING: { label: "Preparing", tone: "progress", icon: "chef-hat", customerDescription: "Your order is being prepared." },
  DRAFT: { label: "Draft", tone: "neutral", icon: "pencil", customerDescription: "Your design is saved but not yet submitted." },
  SUBMITTED_FOR_REVIEW: { label: "Submitted", tone: "info", icon: "send", customerDescription: "Your design was sent to the bakery." },
  BAKERY_REVIEW: { label: "Design review", tone: "progress", icon: "search", customerDescription: "The bakery is reviewing your design." },
  CHANGES_REQUESTED: { label: "Changes requested", tone: "warning", icon: "edit", customerDescription: "The bakery suggested changes. Please update your design." },
  QUOTED: { label: "Quote ready", tone: "info", icon: "file-text", customerDescription: "Your quotation is ready to review." },
  ACCEPTED: { label: "Quote accepted", tone: "success", icon: "thumbs-up", customerDescription: "You accepted the quotation." },
  AWAITING_DEPOSIT: { label: "Awaiting deposit", tone: "warning", icon: "wallet", customerDescription: "Pay the deposit to lock your production slot." },
  SCHEDULED: { label: "Scheduled", tone: "success", icon: "calendar-check", customerDescription: "Deposit verified. Your cake is on the production schedule." },
  BAKING: { label: "Baking", tone: "progress", icon: "flame", customerDescription: "Your cake is in the oven." },
  DECORATING: { label: "Decorating", tone: "progress", icon: "sparkles", customerDescription: "Your cake is being decorated." },
  QUALITY_CHECK: { label: "Quality check", tone: "progress", icon: "shield-check", customerDescription: "Final quality check in progress." },
  READY: { label: "Ready", tone: "success", icon: "gift", customerDescription: "Your cake is ready. Any remaining balance must be settled before handover." },
  READY_FOR_PICKUP: { label: "Ready for pickup", tone: "success", icon: "store", customerDescription: "Come pick up your order." },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "progress", icon: "truck", customerDescription: "Your order is on its way." },
  COMPLETED: { label: "Completed", tone: "success", icon: "party-popper", customerDescription: "Enjoy your celebration!" },
  CANCELLED: { label: "Cancelled", tone: "danger", icon: "x-circle", customerDescription: "This order was cancelled." },
  EXPIRED: { label: "Expired", tone: "danger", icon: "clock", customerDescription: "This order expired because payment wasn't received in time." },
  QUOTE_REJECTED: { label: "Quote declined", tone: "danger", icon: "thumbs-down", customerDescription: "You declined this quotation." },
  QUOTE_EXPIRED: { label: "Quote expired", tone: "danger", icon: "clock", customerDescription: "This quotation expired. You can request a new one." },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, StatusMeta> = {
  UNPAID: { label: "Unpaid", tone: "warning", icon: "circle", customerDescription: "No verified payment yet." },
  PARTIALLY_PAID: { label: "Partially paid", tone: "info", icon: "circle-dot", customerDescription: "Deposit received. Balance remaining." },
  FULLY_PAID: { label: "Fully paid", tone: "success", icon: "check-circle", customerDescription: "Paid in full." },
  REFUNDED: { label: "Refunded", tone: "neutral", icon: "undo", customerDescription: "Your payment was refunded." },
  PARTIALLY_REFUNDED: { label: "Partially refunded", tone: "neutral", icon: "undo", customerDescription: "Part of your payment was refunded." },
};

export const PAYMENT_TRANSACTION_STATUS_META: Record<PaymentTransactionStatus, StatusMeta> = {
  PENDING: { label: "Awaiting proof", tone: "warning", icon: "upload", customerDescription: "Upload your proof of payment." },
  SUBMITTED: { label: "Under review", tone: "info", icon: "hourglass", customerDescription: "The bakery is verifying your payment." },
  VERIFIED: { label: "Verified", tone: "success", icon: "check-circle", customerDescription: "Payment verified." },
  REJECTED: { label: "Rejected", tone: "danger", icon: "x-circle", customerDescription: "Payment proof was rejected. Please upload a new one." },
};

/** Customer-facing tracker stages for custom orders (§23), mapped from the raw status. */
export const CUSTOM_TRACKER_STAGES = [
  { key: "submitted", label: "Order submitted", statuses: ["DRAFT", "SUBMITTED_FOR_REVIEW"] },
  { key: "review", label: "Design review", statuses: ["BAKERY_REVIEW", "CHANGES_REQUESTED"] },
  { key: "quoted", label: "Quoted", statuses: ["QUOTED"] },
  { key: "accepted", label: "Accepted", statuses: ["ACCEPTED", "AWAITING_DEPOSIT"] },
  { key: "scheduled", label: "Deposit verified", statuses: ["SCHEDULED"] },
  { key: "baking", label: "Baking", statuses: ["BAKING"] },
  { key: "decorating", label: "Decorating", statuses: ["DECORATING"] },
  { key: "quality", label: "Quality check", statuses: ["QUALITY_CHECK"] },
  { key: "ready", label: "Ready", statuses: ["READY"] },
  { key: "handover", label: "Delivered / picked up", statuses: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] },
  { key: "completed", label: "Completed", statuses: ["COMPLETED"] },
] as const satisfies ReadonlyArray<{ key: string; label: string; statuses: readonly OrderStatus[] }>;

export const READY_MADE_TRACKER_STAGES = [
  { key: "payment", label: "Payment", statuses: ["PENDING_PAYMENT"] },
  { key: "confirmed", label: "Confirmed", statuses: ["CONFIRMED"] },
  { key: "preparing", label: "Preparing", statuses: ["PREPARING"] },
  { key: "handover", label: "Ready / on the way", statuses: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] },
  { key: "completed", label: "Completed", statuses: ["COMPLETED"] },
] as const satisfies ReadonlyArray<{ key: string; label: string; statuses: readonly OrderStatus[] }>;
