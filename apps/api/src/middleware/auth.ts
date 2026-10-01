import { AUTH_POLICY, PORTAL_ROLES, findMockUserByToken, type AuthUser } from "@cakeshop/auth";
import type { UserRole } from "@cakeshop/types";
import { createMiddleware } from "hono/factory";

export type AppEnv = { Variables: { user: AuthUser } };

/** Turns a bearer token into a user. The only place identity is established. */
export interface TokenVerifier {
  verify(token: string): Promise<AuthUser | null>;
}

/** Default: nobody is authenticated. Safe fallback until a real verifier is configured. */
export const denyAllVerifier: TokenVerifier = { verify: async () => null };

/** PROTOTYPE/dev only (AUTH_MODE=mock; the env schema forbids it in production). */
export const mockTokenVerifier: TokenVerifier = { verify: async (token) => findMockUserByToken(token) };

const unauthorized = { error: { code: "UNAUTHENTICATED", message: "Please sign in." } } as const;
const forbidden = { error: { code: "FORBIDDEN", message: "You don't have access to this." } } as const;

/** 401 unless a valid bearer token is presented. Attaches the verified user to the context. */
export const requireAuth = (verifier: TokenVerifier) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const header = c.req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : "";
    const user = token ? await verifier.verify(token) : null;
    if (!user) return c.json(unauthorized, 401);
    c.set("user", user);
    await next();
  });

/** 403 unless the verified user holds one of the roles. Must run after `requireAuth`. */
export const requireRoles = (...roles: readonly UserRole[]) =>
  createMiddleware<AppEnv>(async (c, next) => {
    if (!roles.includes(c.get("user").role)) return c.json(forbidden, 403);
    await next();
  });

/** Admin-portal guard: staff/admin/super_admin only. */
export const requireAdminPortal = (verifier: TokenVerifier) => [requireAuth(verifier), requireRoles(...PORTAL_ROLES.admin)] as const;

export { AUTH_POLICY };
