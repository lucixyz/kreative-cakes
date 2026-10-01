import { MockAuthService } from "@cakeshop/auth";

// PROTOTYPE: swap for the Supabase-backed AuthService in the RLS phase. `__DEV__` makes the mock
// throw in production builds, so it can never silently ship.
export const authService = new MockAuthService({ enabled: __DEV__ });
