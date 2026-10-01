import { describe, expect, it, vi } from "vitest";
import {
  GENERIC_SIGN_IN_ERROR,
  MOCK_PASSWORD,
  MockAuthService,
  decideAccess,
  findMockUserByToken,
  safeRedirectPath,
  type AuthSession,
} from "./index";

const session = (role: AuthSession["user"]["role"], patch: Partial<AuthSession> = {}): AuthSession => ({
  user: { id: "u1", email: "x@y.test", displayName: "X", role },
  mfaVerified: false,
  expiresAt: new Date(Date.now() + 60_000).toISOString(),
  ...patch,
});

describe("decideAccess: admin portal", () => {
  it("sends unauthenticated visitors to /login", () => {
    expect(decideAccess("admin", null)).toEqual({ allowed: false, reason: "unauthenticated", redirectTo: "/login" });
  });
  it("denies a logged-in CUSTOMER and sends them to the admin login", () => {
    expect(decideAccess("admin", session("customer"))).toEqual({ allowed: false, reason: "forbidden", redirectTo: "/login?denied=1" });
  });
  it("allows staff, admin and super_admin", () => {
    for (const role of ["staff", "admin", "super_admin"] as const) {
      expect(decideAccess("admin", session(role)).allowed).toBe(true);
    }
  });
  it("requires MFA when policy says so", () => {
    expect(decideAccess("admin", session("admin"), { requireMfa: true })).toMatchObject({ allowed: false, reason: "mfa_required" });
    expect(decideAccess("admin", session("admin", { mfaVerified: true }), { requireMfa: true }).allowed).toBe(true);
  });
  it("rejects expired sessions", () => {
    const expired = session("admin", { expiresAt: new Date(Date.now() - 1000).toISOString() });
    expect(decideAccess("admin", expired)).toMatchObject({ allowed: false, reason: "unauthenticated" });
  });
});

describe("decideAccess: customer portal", () => {
  it("allows customers only", () => {
    expect(decideAccess("customer", session("customer")).allowed).toBe(true);
    expect(decideAccess("customer", session("admin"))).toMatchObject({ allowed: false, reason: "forbidden" });
    expect(decideAccess("customer", null)).toMatchObject({ allowed: false, redirectTo: "/login" });
  });
});

describe("safeRedirectPath", () => {
  it("accepts same-app paths", () => {
    expect(safeRedirectPath("/orders")).toBe("/orders");
    expect(safeRedirectPath("/orders?tab=1")).toBe("/orders?tab=1");
  });
  it("blocks open redirects", () => {
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "evil", "", "/a\nb"]) {
      expect(safeRedirectPath(bad), bad).toBeUndefined();
    }
    expect(safeRedirectPath(undefined)).toBeUndefined();
  });
});

describe("MockAuthService", () => {
  const make = () => new MockAuthService({ enabled: true });
  const creds = (email: string, password = MOCK_PASSWORD) => ({ email, password });

  it("refuses to be constructed when disabled (production)", () => {
    expect(() => new MockAuthService({ enabled: false })).toThrow();
  });
  it("keeps the customer and admin portals separate", async () => {
    const svc = make();
    expect(await svc.signIn("admin", creds("customer@kreative.test"))).toEqual({ status: "error", message: GENERIC_SIGN_IN_ERROR });
    expect(await svc.signIn("customer", creds("admin@kreative.test"))).toEqual({ status: "error", message: GENERIC_SIGN_IN_ERROR });
    expect(svc.getSession()).toBeNull();
    expect((await svc.signIn("admin", creds("admin@kreative.test"))).status).toBe("ok");
    expect(svc.getSession()?.user.role).toBe("admin");
  });
  it("uses one identical error for wrong password and unknown email", async () => {
    const svc = make();
    const wrongPw = await svc.signIn("customer", creds("customer@kreative.test", "nope"));
    const unknown = await svc.signIn("customer", creds("nobody@kreative.test"));
    expect(wrongPw).toEqual(unknown);
  });
  it("signup always creates a customer and can't create a duplicate", async () => {
    const svc = make();
    const res = await svc.signUpCustomer({ email: "New@Example.test", password: "a-long-password", fullName: "New" });
    expect(res.status === "ok" && res.session.user.role).toBe("customer");
    expect(res.status === "ok" && res.session.user.email).toBe("new@example.test");
    // a smuggled role field has no effect
    const smuggled = { email: "evil@example.test", password: "a-long-password", fullName: "E", role: "super_admin" };
    const res2 = await svc.signUpCustomer(smuggled);
    expect(res2.status === "ok" && res2.session.user.role).toBe("customer");
    expect(await svc.signUpCustomer({ email: "customer@kreative.test", password: "a-long-password", fullName: "D" })).toMatchObject({ status: "error" });
  });
  it("notifies subscribers and clears session + token on sign-out", async () => {
    const svc = make();
    const listener = vi.fn();
    svc.subscribe(listener);
    await svc.signIn("customer", creds("customer@kreative.test"));
    expect(svc.getAccessToken()).toBe("mock.u_customer_1");
    await svc.signOut();
    expect(svc.getSession()).toBeNull();
    expect(svc.getAccessToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
  });
  it("resolves tokens only for seeded users", () => {
    expect(findMockUserByToken("mock.u_admin_1")?.role).toBe("admin");
    expect(findMockUserByToken("mock.u_admin_1")).not.toHaveProperty("password");
    expect(findMockUserByToken("mock.u_unknown")).toBeNull();
    expect(findMockUserByToken("Bearer admin")).toBeNull();
  });
});
