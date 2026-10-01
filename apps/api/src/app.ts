import { Hono } from "hono";
import { adminRoutes } from "./modules/admin/routes";
import { healthRoutes } from "./modules/health/routes";
import { denyAllVerifier, type TokenVerifier } from "./middleware/auth";

/**
 * Builds the Hono app. Kept separate from `serve()` so tests can call `app.request()`.
 * Future modules (catalog, orders, quotes, payments, ai, uploads) mount here, each with its
 * own routes/service/repository, behind auth + role middleware.
 */
export function createApp(deps: { verifier?: TokenVerifier } = {}) {
  const verifier = deps.verifier ?? denyAllVerifier;
  const app = new Hono();

  app.route("/health", healthRoutes);
  app.route("/admin", adminRoutes(verifier));

  app.notFound((c) => c.json({ error: { code: "NOT_FOUND", message: "Route not found." } }, 404));
  app.onError((err, c) => {
    console.error("[api] unhandled error", err);
    return c.json({ error: { code: "INTERNAL", message: "Something went wrong." } }, 500);
  });

  return app;
}
