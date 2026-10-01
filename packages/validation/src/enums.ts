import { z } from "zod";

/**
 * Enum source of truth: `as const` tuples feed both Zod schemas and TS unions.
 * Display labels/colors/icons live in @cakeshop/types (status maps), never in screens.
 */

export const COLOR_ROLES = ["primary", "secondary", "accent"] as const;
export const colorRoleSchema = z.enum(COLOR_ROLES);

export const ACCENT_FINISHES = ["matte", "metallic"] as const;
export const accentFinishSchema = z.enum(ACCENT_FINISHES);

export const DESIGN_SOURCES = ["manual", "ai_text", "ai_image", "template"] as const;
export const designSourceSchema = z.enum(DESIGN_SOURCES);

export const COMPLEXITIES = ["low", "medium", "high"] as const;
export const complexitySchema = z.enum(COMPLEXITIES);

export const SHAPE_KINDS = ["round", "square", "heart"] as const;
export const shapeKindSchema = z.enum(SHAPE_KINDS);

export const PLACEMENT_ZONES = ["top", "side", "border", "base"] as const;
export const placementZoneSchema = z.enum(PLACEMENT_ZONES);

export const PLACEMENT_DISTRIBUTIONS = ["even", "cluster", "cascade", "random-seeded"] as const;
export const placementDistributionSchema = z.enum(PLACEMENT_DISTRIBUTIONS);

export const MESSAGE_PLACEMENTS = ["top", "front", "side"] as const;
export const messagePlacementSchema = z.enum(MESSAGE_PLACEMENTS);

// ---- Orders & payments --------------------------------------------------

export const ORDER_TYPES = ["ready_made", "custom"] as const;
export const orderTypeSchema = z.enum(ORDER_TYPES);

export const FULFILLMENT_METHODS = ["pickup", "delivery"] as const;
export const fulfillmentMethodSchema = z.enum(FULFILLMENT_METHODS);

export const ORDER_STATUSES = [
  // ready-made
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PREPARING",
  // custom
  "DRAFT",
  "SUBMITTED_FOR_REVIEW",
  "BAKERY_REVIEW",
  "CHANGES_REQUESTED",
  "QUOTED",
  "ACCEPTED",
  "AWAITING_DEPOSIT",
  "SCHEDULED",
  "BAKING",
  "DECORATING",
  "QUALITY_CHECK",
  "READY",
  // shared handover / terminal
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
  "QUOTE_REJECTED",
  "QUOTE_EXPIRED",
] as const;
export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PARTIALLY_PAID",
  "FULLY_PAID",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

export const PAYMENT_TRANSACTION_TYPES = ["DEPOSIT", "BALANCE", "FULL", "REFUND"] as const;
export const paymentTransactionTypeSchema = z.enum(PAYMENT_TRANSACTION_TYPES);

export const PAYMENT_TRANSACTION_STATUSES = ["PENDING", "SUBMITTED", "VERIFIED", "REJECTED"] as const;
export const paymentTransactionStatusSchema = z.enum(PAYMENT_TRANSACTION_STATUSES);

export const PAYMENT_METHODS = ["gcash", "maya", "bank_transfer", "cash_on_pickup"] as const;
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);

export const QUOTATION_STATUSES = ["DRAFT", "ISSUED", "ACCEPTED", "REJECTED", "EXPIRED", "SUPERSEDED"] as const;
export const quotationStatusSchema = z.enum(QUOTATION_STATUSES);

// ---- Roles --------------------------------------------------------------

export const USER_ROLES = ["guest", "customer", "staff", "admin", "super_admin"] as const;
export const userRoleSchema = z.enum(USER_ROLES);
