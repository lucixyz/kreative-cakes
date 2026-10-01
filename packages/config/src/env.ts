import { z } from "zod";

/**
 * Environment schemas. Client env may only contain EXPO_PUBLIC_* values.
 * Server secrets (service role key, AI keys, payment keys) must never be
 * imported into client bundles: only import `parseClientEnv` from apps.
 */

export const clientEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default("http://localhost:8787"),
  EXPO_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(""),
});

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(8787),
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  /** "mock" accepts the dev-only demo tokens and is REFUSED in production (see refine below). */
  AUTH_MODE: z.enum(["mock", "supabase"]).default("mock"),
  AI_PROVIDER: z.enum(["mock"]).default("mock"),
  AI_API_KEY: z.string().optional().default(""),
  AI_DAILY_LIMIT_GUEST: z.coerce.number().int().nonnegative().default(3),
  AI_DAILY_LIMIT_CUSTOMER: z.coerce.number().int().nonnegative().default(20),
}).refine((env) => !(env.NODE_ENV === "production" && env.AUTH_MODE === "mock"), {
  path: ["AUTH_MODE"],
  message: "AUTH_MODE=mock is not allowed when NODE_ENV=production.",
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseClientEnv(source: Record<string, string | undefined>): ClientEnv {
  return clientEnvSchema.parse(source);
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  return serverEnvSchema.parse(source);
}
