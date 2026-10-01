import { MockAuthService } from "@cakeshop/auth";

// PROTOTYPE: swap for the Supabase-backed AuthService in the RLS phase. The mock only runs in dev
// builds, or in a deployment that explicitly sets VITE_ALLOW_MOCK_AUTH=true (demo preview). When it
// is off the app shows a notice instead of crashing.
const mockEnabled = import.meta.env.DEV || import.meta.env.VITE_ALLOW_MOCK_AUTH === "true";
export const authService = mockEnabled ? new MockAuthService({ enabled: true }) : null;
