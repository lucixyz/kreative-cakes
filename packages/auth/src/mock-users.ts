import type { UserRole } from "@cakeshop/types";
import type { AuthUser } from "./types";

/**
 * PROTOTYPE ONLY. Demo accounts for local development with MockAuthService / the mock token
 * verifier. Never enabled in production (see env schema and MockAuthService).
 */
export const MOCK_PASSWORD = "Prototype#12345";

export type MockUserRecord = AuthUser & { password: string };

const user = (id: string, email: string, displayName: string, role: UserRole): MockUserRecord => ({
  id,
  email,
  displayName,
  role,
  password: MOCK_PASSWORD,
});

export const MOCK_USERS: readonly MockUserRecord[] = [
  user("u_customer_1", "customer@kreative.test", "Demo Customer", "customer"),
  user("u_staff_1", "staff@kreative.test", "Demo Staff", "staff"),
  user("u_admin_1", "admin@kreative.test", "Demo Admin", "admin"),
  user("u_super_1", "super@kreative.test", "Demo Super Admin", "super_admin"),
];

export const MOCK_TOKEN_PREFIX = "mock.";

/** Resolves a token issued by MockAuthService for a SEEDED user (used by the API's mock verifier). */
export function findMockUserByToken(token: string): AuthUser | null {
  if (!token.startsWith(MOCK_TOKEN_PREFIX)) return null;
  const found = MOCK_USERS.find((u) => u.id === token.slice(MOCK_TOKEN_PREFIX.length));
  if (!found) return null;
  const { password: _password, ...publicUser } = found;
  return publicUser;
}
