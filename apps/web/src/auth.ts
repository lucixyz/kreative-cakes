import { MockAuthService } from "@cakeshop/auth";

// PROTOTYPE: swap for the Supabase-backed AuthService in the RLS phase. The mock only runs in dev
// builds, or in a deployment that explicitly sets VITE_ALLOW_MOCK_AUTH=true (e.g. a demo preview).
export const authService = new MockAuthService({
  enabled: import.meta.env.DEV || import.meta.env.VITE_ALLOW_MOCK_AUTH === "true",
});
