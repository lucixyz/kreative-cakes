import { MockAuthService } from "@cakeshop/auth";

// PROTOTYPE: swap for the Supabase-backed AuthService (with MFA) in the RLS phase.
// This instance is separate from the customer app's, so the two portals never share a session.
export const authService = new MockAuthService({ enabled: __DEV__ });
