import type { FulfillmentMethod, OrderStatus, OrderType, PaymentMethod, PaymentStatus, UserRole } from "@cakeshop/types";

/** Facts the guards read. Assembled by the API from the database; never trusted from clients. */
export interface TransitionContext {
  orderType: OrderType;
  fulfillment: FulfillmentMethod;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  /** A deposit (or full) transaction has been VERIFIED. */
  depositVerified?: boolean;
  quotationIssued?: boolean;
  /** ISO timestamps; comparable as strings when in the same format. */
  now: string;
  quoteValidUntil?: string;
  unpaidExpiresAt?: string;
  policyAcknowledged?: boolean;
  capacityAvailable?: boolean;
  leadTimeSatisfied?: boolean;
  reason?: string;
}

/** Declarative side effects, executed by the API after a successful transition. */
export type SideEffect =
  | "write_status_history"
  | "notify_customer"
  | "notify_staff"
  | "commit_stock"
  | "release_stock"
  | "lock_design_version"
  | "reserve_production_slot"
  | "release_production_slot"
  | "supersede_quotation"
  | "system_message";

export type Actor = UserRole | "system";

export type GuardId =
  | "leadTimeSatisfied"
  | "quotationIssued"
  | "quoteNotExpired"
  | "quoteExpired"
  | "policyAcknowledged"
  | "depositVerified"
  | "capacityAvailable"
  | "fullyPaid"
  | "paidOrCashOnPickup"
  | "unpaidWindowElapsed"
  | "isPickup"
  | "isDelivery"
  | "reasonProvided";

export interface Transition {
  from: OrderStatus;
  to: OrderStatus;
  orderTypes: readonly OrderType[];
  allowedRoles: readonly Actor[];
  guards: readonly GuardId[];
  sideEffects: readonly SideEffect[];
}

/** Returns an error message when the guard fails, or null when it passes. */
export type Guard = (ctx: TransitionContext) => string | null;
