import type { OrderStatus } from "@cakeshop/types";
import type { Actor, GuardId, SideEffect, Transition } from "./context";

const STAFF: readonly Actor[] = ["staff", "admin", "super_admin"];
const CUSTOMER_OR_STAFF: readonly Actor[] = ["customer", ...STAFF];

function t(
  from: OrderStatus,
  to: OrderStatus,
  orderTypes: Transition["orderTypes"],
  allowedRoles: readonly Actor[],
  guards: readonly GuardId[] = [],
  sideEffects: readonly SideEffect[] = [],
): Transition {
  return { from, to, orderTypes, allowedRoles, guards, sideEffects: ["write_status_history", ...sideEffects] };
}

const RM = ["ready_made"] as const;
const CU = ["custom"] as const;
const BOTH = ["ready_made", "custom"] as const;

/** Every legal order status transition. Anything not listed is blocked. */
export const ORDER_TRANSITIONS: readonly Transition[] = [
  // ---- Ready-made ------------------------------------------------------
  t("PENDING_PAYMENT", "CONFIRMED", RM, [...STAFF, "system"], ["paidOrCashOnPickup"], ["commit_stock", "notify_customer", "system_message"]),
  t("PENDING_PAYMENT", "EXPIRED", RM, ["system"], ["unpaidWindowElapsed"], ["release_stock", "notify_customer"]),
  t("PENDING_PAYMENT", "CANCELLED", RM, CUSTOMER_OR_STAFF, [], ["release_stock"]),
  t("CONFIRMED", "PREPARING", RM, STAFF, [], ["notify_customer"]),
  t("CONFIRMED", "CANCELLED", RM, STAFF, ["reasonProvided"], ["release_stock", "notify_customer"]),
  t("PREPARING", "READY_FOR_PICKUP", RM, STAFF, ["isPickup", "paidOrCashOnPickup"], ["notify_customer"]),
  t("PREPARING", "OUT_FOR_DELIVERY", RM, STAFF, ["isDelivery", "paidOrCashOnPickup"], ["notify_customer"]),

  // ---- Custom: design & quotation -------------------------------------
  t("DRAFT", "SUBMITTED_FOR_REVIEW", CU, ["customer"], ["leadTimeSatisfied"], ["lock_design_version", "notify_staff"]),
  t("DRAFT", "CANCELLED", CU, ["customer"]),
  t("SUBMITTED_FOR_REVIEW", "BAKERY_REVIEW", CU, STAFF),
  t("BAKERY_REVIEW", "CHANGES_REQUESTED", CU, STAFF, ["reasonProvided"], ["notify_customer", "system_message"]),
  t("CHANGES_REQUESTED", "SUBMITTED_FOR_REVIEW", CU, ["customer"], ["leadTimeSatisfied"], ["lock_design_version", "notify_staff"]),
  t("BAKERY_REVIEW", "QUOTED", CU, STAFF, ["quotationIssued"], ["notify_customer", "system_message"]),
  t("BAKERY_REVIEW", "CANCELLED", CU, STAFF, ["reasonProvided"], ["notify_customer"]),
  t("QUOTED", "ACCEPTED", CU, ["customer"], ["quoteNotExpired", "policyAcknowledged"], ["notify_staff"]),
  t("QUOTED", "QUOTE_REJECTED", CU, ["customer"], [], ["notify_staff"]),
  t("QUOTED", "QUOTE_EXPIRED", CU, ["system"], ["quoteExpired"], ["notify_customer"]),
  t("ACCEPTED", "AWAITING_DEPOSIT", CU, ["system", ...CUSTOMER_OR_STAFF]),

  // ---- Custom: scheduling & production --------------------------------
  t("AWAITING_DEPOSIT", "SCHEDULED", CU, [...STAFF, "system"], ["depositVerified", "capacityAvailable"], ["reserve_production_slot", "notify_customer", "system_message"]),
  t("SCHEDULED", "BAKING", CU, STAFF, [], ["notify_customer"]),
  t("BAKING", "DECORATING", CU, STAFF, [], ["notify_customer"]),
  t("DECORATING", "QUALITY_CHECK", CU, STAFF),
  t("QUALITY_CHECK", "READY", CU, STAFF, [], ["notify_customer"]),

  // Changes after deposit -> revised quotation. Customers can only do this before BAKING;
  // staff may override once production has started.
  t("AWAITING_DEPOSIT", "BAKERY_REVIEW", CU, CUSTOMER_OR_STAFF, [], ["supersede_quotation"]),
  t("SCHEDULED", "BAKERY_REVIEW", CU, CUSTOMER_OR_STAFF, [], ["supersede_quotation", "release_production_slot"]),
  t("BAKING", "BAKERY_REVIEW", CU, STAFF, ["reasonProvided"], ["supersede_quotation"]),

  // ---- Custom: handover (balance must be FULLY_PAID) ------------------
  t("READY", "READY_FOR_PICKUP", CU, STAFF, ["isPickup", "fullyPaid"], ["notify_customer"]),
  t("READY", "OUT_FOR_DELIVERY", CU, STAFF, ["isDelivery", "fullyPaid"], ["notify_customer"]),

  // ---- Shared completion & cancellation --------------------------------
  t("READY_FOR_PICKUP", "COMPLETED", BOTH, STAFF, ["fullyPaid"], ["notify_customer"]),
  t("OUT_FOR_DELIVERY", "COMPLETED", BOTH, STAFF, ["fullyPaid"], ["notify_customer"]),
  t("AWAITING_DEPOSIT", "CANCELLED", CU, CUSTOMER_OR_STAFF),
  t("SCHEDULED", "CANCELLED", CU, STAFF, ["reasonProvided"], ["release_production_slot", "notify_customer"]),
];
