import type { AuthSession, Portal } from "./types";

export type SignInResult =
  | { status: "ok"; session: AuthSession }
  /** Admin only. Prepared for MFA; no implementation emits this yet. */
  | { status: "mfa_required"; challengeId: string }
  | { status: "error"; message: string };

export type Credentials = { email: string; password: string };
export type CustomerSignUp = { email: string; password: string; fullName: string };

/**
 * Auth boundary the apps depend on. Implementations: MockAuthService (dev only) now,
 * a Supabase-backed service later (roles read from the database, never from client input).
 *
 * There is deliberately no admin sign-up method: administrator accounts are created through a
 * controlled process (super admin invite / provisioning script), never public registration.
 */
export interface AuthService {
  getSession(): AuthSession | null;
  /** Subscribe to session changes (sign-in, sign-out, expiry). Returns an unsubscribe function. */
  subscribe(listener: (session: AuthSession | null) => void): () => void;
  /** The portal restricts which roles may sign in; a mismatch fails with the generic error. */
  signIn(portal: Portal, credentials: Credentials): Promise<SignInResult>;
  signUpCustomer(input: CustomerSignUp): Promise<SignInResult>;
  signOut(): Promise<void>;
  /** Bearer token for API calls. The API verifies it; the client never decides authorization. */
  getAccessToken(): string | null;
}
