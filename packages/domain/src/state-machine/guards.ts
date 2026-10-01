import type { Guard, GuardId } from "./context";

export const GUARDS: Readonly<Record<GuardId, Guard>> = {
  leadTimeSatisfied: (c) => (c.leadTimeSatisfied === false ? "The requested date doesn't meet the minimum lead time." : null),
  quotationIssued: (c) => (c.quotationIssued ? null : "A quotation must be issued first."),
  quoteNotExpired: (c) => (c.quoteValidUntil && c.now > c.quoteValidUntil ? "This quotation has expired." : null),
  quoteExpired: (c) => (c.quoteValidUntil && c.now > c.quoteValidUntil ? null : "The quotation is still valid."),
  policyAcknowledged: (c) => (c.policyAcknowledged ? null : "The cancellation policy must be acknowledged."),
  depositVerified: (c) => (c.depositVerified ? null : "A deposit payment must be verified first."),
  capacityAvailable: (c) => (c.capacityAvailable === false ? "No production capacity is available on the requested date." : null),
  fullyPaid: (c) => (c.paymentStatus === "FULLY_PAID" ? null : "The balance must be fully paid before handover."),
  paidOrCashOnPickup: (c) =>
    c.paymentStatus === "FULLY_PAID" || (c.paymentMethod === "cash_on_pickup" && c.fulfillment === "pickup")
      ? null
      : "Payment must be verified first.",
  unpaidWindowElapsed: (c) => (c.unpaidExpiresAt && c.now > c.unpaidExpiresAt ? null : "The payment window has not elapsed."),
  isPickup: (c) => (c.fulfillment === "pickup" ? null : "This is not a pickup order."),
  isDelivery: (c) => (c.fulfillment === "delivery" ? null : "This is not a delivery order."),
  reasonProvided: (c) => (c.reason?.trim() ? null : "A reason is required."),
};
