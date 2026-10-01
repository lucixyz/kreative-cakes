import { MockAuthService } from "@cakeshop/auth";

// PROTOTYPE: swap for the Supabase-backed AuthService (with MFA) in the RLS phase. This instance is
// separate from the customer site's, so the two portals never share a session. The mock only runs
// in dev builds, or when a deployment explicitly sets VITE_ALLOW_MOCK_AUTH=true (demo preview).
export const authService = new MockAuthService({
  enabled: import.meta.env.DEV || import.meta.env.VITE_ALLOW_MOCK_AUTH === "true",
});
