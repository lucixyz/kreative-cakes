import type { z } from "zod";
import type {
  aiDesignRequestSchema,
  aiDesignSuggestionSchema,
  cakeDecorationSchema,
  cakeDesignSchema,
  cakeTierSchema,
  catalogSchema,
  colorRoleSchema,
  complexitySchema,
  decorationOptionSchema,
  depositRulesSchema,
  designSourceSchema,
  dietaryOptionSchema,
  flavorOptionSchema,
  fulfillmentMethodSchema,
  orderStatusSchema,
  orderTypeSchema,
  paletteWithFinishSchema,
  paymentMethodSchema,
  paymentStatusSchema,
  paymentTransactionSchema,
  paymentTransactionStatusSchema,
  paymentTransactionTypeSchema,
  placementDistributionSchema,
  placementSchema,
  placementZoneSchema,
  priceRulesSchema,
  quotationStatusSchema,
  shapeKindSchema,
  shapeOptionSchema,
  userRoleSchema,
} from "@cakeshop/validation";

// All types are inferred from Zod schemas: there is exactly one definition of each contract.
export type ColorRole = z.infer<typeof colorRoleSchema>;
export type Complexity = z.infer<typeof complexitySchema>;
export type DesignSource = z.infer<typeof designSourceSchema>;
export type ShapeKind = z.infer<typeof shapeKindSchema>;
export type PlacementZone = z.infer<typeof placementZoneSchema>;
export type PlacementDistribution = z.infer<typeof placementDistributionSchema>;
export type Placement = z.infer<typeof placementSchema>;
export type Palette = z.infer<typeof paletteWithFinishSchema>;

export type CakeTier = z.infer<typeof cakeTierSchema>;
export type CakeDecoration = z.infer<typeof cakeDecorationSchema>;
export type CakeDesign = z.infer<typeof cakeDesignSchema>;

export type AIDesignSuggestion = z.infer<typeof aiDesignSuggestionSchema>;
export type AIDesignRequest = z.infer<typeof aiDesignRequestSchema>;

export type Catalog = z.infer<typeof catalogSchema>;
export type ShapeOption = z.infer<typeof shapeOptionSchema>;
export type FlavorOption = z.infer<typeof flavorOptionSchema>;
export type DecorationOption = z.infer<typeof decorationOptionSchema>;
export type DietaryOption = z.infer<typeof dietaryOptionSchema>;
export type PriceRules = z.infer<typeof priceRulesSchema>;
export type DepositRules = z.infer<typeof depositRulesSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;
export type FulfillmentMethod = z.infer<typeof fulfillmentMethodSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentTransactionType = z.infer<typeof paymentTransactionTypeSchema>;
export type PaymentTransactionStatus = z.infer<typeof paymentTransactionStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentTransaction = z.infer<typeof paymentTransactionSchema>;
export type QuotationStatus = z.infer<typeof quotationStatusSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
