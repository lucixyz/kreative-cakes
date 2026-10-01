import { z } from "zod";
import {
  paymentMethodSchema,
  paymentTransactionStatusSchema,
  paymentTransactionTypeSchema,
} from "./enums";

/** Minimal transaction shape the domain needs to derive payment status. */
export const paymentTransactionSchema = z.object({
  id: z.string().min(1),
  orderId: z.string().min(1),
  type: paymentTransactionTypeSchema,
  status: paymentTransactionStatusSchema,
  /** Integer centavos. */
  amount: z.number().int().positive(),
  method: paymentMethodSchema,
  proofPath: z.string().optional(),
  rejectionReason: z.string().optional(),
});
