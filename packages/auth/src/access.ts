import { isAllowedInPortal } from "./policy";
import type { AuthSession, Portal } from "./types";

export type AccessDecision =
  | { allowed: true }
  | { allowed: false; reason: "unauthenticated" | "forbidden" | "mfa_required"; redirectTo: string };

/**
 * Route-level decision for a portal. Pure and shared by both apps.
 * This only decides UX redirects: the API and database must independently enforce the same rule,
 * because a client can bypass any routing check.
 * `redirectTo` is relative to the app's base URL (the admin app is served under /admin).
 */
export function decideAccess(
  portal: Portal,
  session: AuthSession | null,
  options: { requireMfa?: boolean } = {},
): AccessDecision {
  if (!session) return { allowed: false, reason: "unauthenticated", redirectTo: "/login" };
  if (!isAllowedInPortal(portal, session.user.role)) {
    return { allowed: false, reason: "forbidden", redirectTo: portal === "admin" ? "/login?denied=1" : "/login" };
  }
  if (portal === "admin" && options.requireMfa && !session.mfaVerified) {
    return { allowed: false, reason: "mfa_required", redirectTo: "/login?mfa=1" };
  }
  if (Date.parse(session.expiresAt) <= Date.now()) {
    return { allowed: false, reason: "unauthenticated", redirectTo: "/login" };
  }
  return { allowed: true };
}

/**
 * Validates a post-login `next` target. Only same-app absolute paths are accepted, which blocks
 * open redirects such as `//evil.com`, `https://evil.com` or `/\evil.com`.
 */
export function safeRedirectPath(next: string | string[] | undefined | null): string | undefined {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return undefined;
  if ([...value].some((ch) => ch.charCodeAt(0) < 32)) return undefined;
  return value;
}
