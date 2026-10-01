import { describe, expect, it } from "vitest";
import { parseServerEnv } from "@cakeshop/config/env";
import { createApp } from "./app";
import { mockTokenVerifier } from "./middleware/auth";

describe("api", () => {
  it("GET /health returns ok", async () => {
    const res = await createApp().request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: "ok" });
  });
  it("returns a JSON 404 for unknown routes", async () => {
    const res = await createApp().request("/nope");
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: { code: "NOT_FOUND" } });
  });
  it("env schema applies defaults", () => {
    expect(parseServerEnv({}).API_PORT).toBe(8787);
  });
});

describe("admin routes (server-side authorization)", () => {
  const app = createApp({ verifier: mockTokenVerifier });
  const call = (token?: string) =>
    app.request("/admin/session", { headers: token ? { authorization: `Bearer ${token}` } : {} });

  it("401 without a token or with a garbage token", async () => {
    expect((await call()).status).toBe(401);
    expect((await call("garbage")).status).toBe(401);
    expect((await call("mock.u_nobody")).status).toBe(401);
  });
  it("403 for a signed-in customer", async () => {
    expect((await call("mock.u_customer_1")).status).toBe(403);
  });
  it("200 for staff, admin and super admin", async () => {
    for (const id of ["u_staff_1", "u_admin_1", "u_super_1"]) {
      const res = await call(`mock.${id}`);
      expect(res.status).toBe(200);
      expect(JSON.stringify(await res.json())).not.toContain("password");
    }
  });
  it("denies everything by default (no verifier configured)", async () => {
    const res = await createApp().request("/admin/session", { headers: { authorization: "Bearer mock.u_admin_1" } });
    expect(res.status).toBe(401);
  });
  it("refuses mock auth in production", () => {
    expect(() => parseServerEnv({ NODE_ENV: "production", AUTH_MODE: "mock" })).toThrow();
    expect(() => parseServerEnv({ NODE_ENV: "production", AUTH_MODE: "supabase" })).not.toThrow();
  });
});
