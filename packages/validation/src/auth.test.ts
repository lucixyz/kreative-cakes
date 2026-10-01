import { describe, expect, it } from "vitest";
import { customerSignupSchema, loginSchema } from "./index";

const signup = { fullName: "Ana", email: "ana@example.com", password: "long-enough-pw", confirmPassword: "long-enough-pw", acceptTerms: true };

describe("auth schemas", () => {
  it("accepts a valid signup and strips any role field", () => {
    const res = customerSignupSchema.parse({ ...signup, role: "super_admin" });
    expect(res).not.toHaveProperty("role");
  });
  it("rejects weak/mismatched passwords, bad emails and missing consent", () => {
    expect(customerSignupSchema.safeParse({ ...signup, password: "short", confirmPassword: "short" }).success).toBe(false);
    expect(customerSignupSchema.safeParse({ ...signup, confirmPassword: "different-pw-123" }).success).toBe(false);
    expect(customerSignupSchema.safeParse({ ...signup, email: "nope" }).success).toBe(false);
    expect(customerSignupSchema.safeParse({ ...signup, acceptTerms: false }).success).toBe(false);
  });
  it("login requires both fields", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.co", password: "x" }).success).toBe(true);
  });
});
