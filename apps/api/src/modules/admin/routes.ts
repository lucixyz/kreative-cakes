import { Hono } from "hono";
import { requireAdminPortal, type AppEnv, type TokenVerifier } from "../../middleware/auth";

/**
 * Everything under /admin requires an administrator-portal role. New admin modules mount on this
 * router so the guard cannot be forgotten. Per-action permissions arrive with RBAC (Phase 2).
 */
export function adminRoutes(verifier: TokenVerifier) {
  const router = new Hono<AppEnv>();
  router.use("*", ...requireAdminPortal(verifier));
  router.get("/session", (c) => c.json({ user: c.get("user") }));
  return router;
}
