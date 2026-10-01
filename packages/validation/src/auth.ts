import { z } from "zod";

/**
 * Auth form schemas, shared by the customer app, admin app and API.
 * Note: there is intentionally NO `role` field on any input. Roles are assigned server-side only.
 */
export const emailSchema = z.email("Enter a valid email address.").max(254);

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(128, "Use 128 characters or fewer.");

/** Login does not re-check strength (older passwords must still work) and never reveals which field was wrong. */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(128),
});

export const customerSignupSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your name.").max(80),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { error: "Please accept the Terms and Privacy Policy." }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
