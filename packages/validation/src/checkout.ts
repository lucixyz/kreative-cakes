import { z } from "zod";
import { emailSchema } from "./auth";

/** Checkout form shared by the website and the mobile app. The API re-validates and re-prices. */
export const CHECKOUT_PAYMENT_METHODS = ["gcash", "maya", "card", "online_banking"] as const;
export const TIME_SLOTS = ["10 AM – 12 PM", "12 PM – 2 PM", "2 PM – 4 PM", "4 PM – 6 PM"] as const;

export const checkoutSchema = z
  .object({
    fulfillment: z.enum(["delivery", "pickup"]),
    fullName: z.string().trim().min(1, "Enter your name.").max(80),
    mobile: z.string().trim().regex(/^(09|\+639)\d{9}$/, "Enter a mobile number like 09123456789."),
    email: emailSchema,
    street: z.string().trim().max(160),
    barangay: z.string().trim().max(80),
    city: z.string().trim().max(80),
    notes: z.string().trim().max(200),
    date: z.string().min(1, "Choose a date."),
    timeSlot: z.enum(TIME_SLOTS),
    paymentMethod: z.enum(CHECKOUT_PAYMENT_METHODS),
  })
  .superRefine((v, ctx) => {
    if (v.fulfillment !== "delivery") return;
    for (const [field, message] of [["street", "Enter your street address."], ["barangay", "Enter your barangay."], ["city", "Enter your city."]] as const) {
      if (v[field].length === 0) ctx.addIssue({ code: "custom", path: [field], message });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
