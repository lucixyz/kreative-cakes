import { GENERIC_SIGN_IN_ERROR, isAllowedInPortal } from "./policy";
import { MOCK_TOKEN_PREFIX, MOCK_USERS, type MockUserRecord } from "./mock-users";
import type { AuthService, Credentials, CustomerSignUp, SignInResult } from "./service";
import type { AuthSession, Portal } from "./types";

const SESSION_MS = 8 * 60 * 60 * 1000;

/**
 * PROTOTYPE ONLY: in-memory auth with seeded demo users. There is no real security here; it exists
 * so the routing/guard flow can be built and tested before Supabase is connected.
 * - Sessions are memory-only (a page reload signs out), so nothing sensitive sits in localStorage.
 * - Refuses to run unless `enabled` (apps pass `__DEV__`).
 */
export class MockAuthService implements AuthService {
  private session: AuthSession | null = null;
  private token: string | null = null;
  private listeners = new Set<(s: AuthSession | null) => void>();
  private users: MockUserRecord[] = MOCK_USERS.map((u) => ({ ...u }));

  constructor(options: { enabled: boolean }) {
    if (!options.enabled) throw new Error("MockAuthService is disabled outside development.");
  }

  getSession = () => this.session;
  getAccessToken = () => this.token;

  subscribe = (listener: (s: AuthSession | null) => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  async signIn(portal: Portal, { email, password }: Credentials): Promise<SignInResult> {
    const found = this.users.find((u) => u.email === email.trim().toLowerCase());
    // Same error for unknown email, wrong password and wrong portal: no account/role enumeration.
    if (!found || found.password !== password || !isAllowedInPortal(portal, found.role)) {
      return { status: "error", message: GENERIC_SIGN_IN_ERROR };
    }
    return { status: "ok", session: this.start(found) };
  }

  /** Always creates a `customer`. The input type has no role field, so a role cannot be requested. */
  async signUpCustomer({ email, password, fullName }: CustomerSignUp): Promise<SignInResult> {
    const normalized = email.trim().toLowerCase();
    if (this.users.some((u) => u.email === normalized)) {
      return { status: "error", message: "We couldn't create an account with those details." };
    }
    const record: MockUserRecord = {
      id: `u_customer_${this.users.length + 1}`,
      email: normalized,
      displayName: fullName.trim(),
      role: "customer",
      password,
    };
    this.users.push(record);
    return { status: "ok", session: this.start(record) };
  }

  async signOut(): Promise<void> {
    this.token = null;
    this.set(null);
  }

  private start(record: MockUserRecord): AuthSession {
    const { password: _password, ...user } = record;
    const session: AuthSession = {
      user,
      mfaVerified: false,
      expiresAt: new Date(Date.now() + SESSION_MS).toISOString(),
    };
    this.token = `${MOCK_TOKEN_PREFIX}${user.id}`;
    this.set(session);
    return session;
  }

  private set(session: AuthSession | null) {
    this.session = session;
    this.listeners.forEach((l) => l(session));
  }
}
