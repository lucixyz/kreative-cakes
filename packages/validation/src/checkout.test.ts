import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkout";

const base = {
  fulfillment: "pickup", fullName: "Ana Cruz", mobile: "09123456789", email: "ana@example.com",
  street: "", barangay: "", city: "", notes: "", date: "2026-12-01", timeSlot: "10 AM – 12 PM", paymentMethod: "gcash",
};

describe("checkoutSchema", () => {
  it("accepts a pickup order without an address", () => {
    expect(checkoutSchema.safeParse(base).success).toBe(true);
  });

  it("requires an address for delivery", () => {
    const r = checkoutSchema.safeParse({ ...base, fulfillment: "delivery" });
    expect(r.success).toBe(false);
    expect(r.error?.issues.map((i) => i.path[0])).toEqual(["street", "barangay", "city"]);
  });

  it("rejects a bad mobile number and unknown payment method", () => {
    expect(checkoutSchema.safeParse({ ...base, mobile: "12345" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, paymentMethod: "bitcoin" }).success).toBe(false);
  });
});
