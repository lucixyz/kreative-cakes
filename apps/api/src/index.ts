import { serve } from "@hono/node-server";
import { parseServerEnv } from "@cakeshop/config/env";
import { createApp } from "./app";
import { denyAllVerifier, mockTokenVerifier } from "./middleware/auth";

const env = parseServerEnv(process.env);
// Supabase-backed verifier replaces the mock in Phase 3; until then non-mock modes deny everything.
const verifier = env.AUTH_MODE === "mock" ? mockTokenVerifier : denyAllVerifier;
serve({ fetch: createApp({ verifier }).fetch, port: env.API_PORT }, (info) => {
  console.log(`[api] listening on http://localhost:${info.port}`);
});
