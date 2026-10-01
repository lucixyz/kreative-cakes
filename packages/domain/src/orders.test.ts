import { describe, expect, it } from "vitest";
import { ORDER_STATUSES } from "@cakeshop/validation";
import { mockDepositRules } from "@cakeshop/database";
import {
  ORDER_TRANSITIONS,
  availableTransitions,
  calculatePaymentSchedule,
  canTransitionPaymentTransaction,
  derivePaymentStatus,
  evaluateTransition,
  type TransitionContext,
} from "./index";

const ctx = (patch: Partial<TransitionContext> = {}): TransitionContext => ({
  orderType: "custom",
  fulfillment: "pickup",
  paymentStatus: "UNPAID",
  now: "2026-10-01T10:00:00Z",
  ...patch,
});
const tx = (type: "DEPOSIT" | "BALANCE" | "FULL" | "REFUND", status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED", amount: number) => ({ type, status, amount });

describe("payment status derivation", () => {
  it("ignores unverified and rejected transactions", () => {
    expect(derivePaymentStatus([tx("DEPOSIT", "SUBMITTED", 500), tx("DEPOSIT", "REJECTED", 500)], 1000)).toBe("UNPAID");
  });
  it("goes unpaid -> partial -> full from verified transactions", () => {
    expect(derivePaymentStatus([tx("DEPOSIT", "VERIFIED", 500)], 1000)).toBe("PARTIALLY_PAID");
    expect(derivePaymentStatus([tx("DEPOSIT", "VERIFIED", 500), tx("BALANCE", "VERIFIED", 500)], 1000)).toBe("FULLY_PAID");
  });
  it("handles refunds", () => {
    expect(derivePaymentStatus([tx("FULL", "VERIFIED", 1000), tx("REFUND", "VERIFIED", 300)], 1000)).toBe("PARTIALLY_REFUNDED");
    expect(derivePaymentStatus([tx("FULL", "VERIFIED", 1000), tx("REFUND", "VERIFIED", 1000)], 1000)).toBe("REFUNDED");
  });
  it("only allows PENDING -> SUBMITTED -> VERIFIED|REJECTED", () => {
    expect(canTransitionPaymentTransaction("PENDING", "SUBMITTED")).toBe(true);
    expect(canTransitionPaymentTransaction("PENDING", "VERIFIED")).toBe(false);
    expect(canTransitionPaymentTransaction("REJECTED", "VERIFIED")).toBe(false);
  });
});

describe("deposit & balance", () => {
  it("splits 50/50 with balance due 2 days before the event", () => {
    const s = calculatePaymentSchedule({ total: 100_001, rules: mockDepositRules, eventDate: "2026-10-20", today: "2026-10-01" });
    expect(s.fullPaymentRequired).toBe(false);
    expect(s.depositAmount + s.balanceAmount).toBe(100_001);
    expect(s.depositAmount).toBe(50_001);
    expect(s.balanceDueDate).toBe("2026-10-18");
  });
  it("requires full payment when the event is within 3 days", () => {
    const s = calculatePaymentSchedule({ total: 100_000, rules: mockDepositRules, eventDate: "2026-10-04", today: "2026-10-01" });
    expect(s).toMatchObject({ fullPaymentRequired: true, depositAmount: 100_000, balanceAmount: 0 });
  });
  it("supports a fixed deposit capped at the total", () => {
    const s = calculatePaymentSchedule({ total: 30_000, rules: { ...mockDepositRules, mode: "fixed", value: 50_000 }, eventDate: "2026-12-01", today: "2026-10-01" });
    expect(s.depositAmount).toBe(30_000);
  });
});

describe("order state machine", () => {
  it("only references known statuses and has no duplicate transitions", () => {
    const seen = new Set<string>();
    for (const tr of ORDER_TRANSITIONS) {
      expect(ORDER_STATUSES).toContain(tr.from);
      expect(ORDER_STATUSES).toContain(tr.to);
      const key = `${tr.from}>${tr.to}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      expect(tr.sideEffects).toContain("write_status_history");
    }
  });

  it("walks the happy custom path with the right actors", () => {
    const steps = [
      ["DRAFT", "SUBMITTED_FOR_REVIEW", "customer", {}],
      ["SUBMITTED_FOR_REVIEW", "BAKERY_REVIEW", "staff", {}],
      ["BAKERY_REVIEW", "QUOTED", "staff", { quotationIssued: true }],
      ["QUOTED", "ACCEPTED", "customer", { policyAcknowledged: true, quoteValidUntil: "2026-10-10T00:00:00Z" }],
      ["ACCEPTED", "AWAITING_DEPOSIT", "system", {}],
      ["AWAITING_DEPOSIT", "SCHEDULED", "staff", { depositVerified: true, capacityAvailable: true }],
      ["SCHEDULED", "BAKING", "staff", {}],
      ["BAKING", "DECORATING", "staff", {}],
      ["DECORATING", "QUALITY_CHECK", "staff", {}],
      ["QUALITY_CHECK", "READY", "staff", {}],
      ["READY", "READY_FOR_PICKUP", "staff", { paymentStatus: "FULLY_PAID" }],
      ["READY_FOR_PICKUP", "COMPLETED", "staff", { paymentStatus: "FULLY_PAID" }],
    ] as const;
    for (const [from, to, actor, patch] of steps) {
      const res = evaluateTransition(from, to, actor, ctx(patch as Partial<TransitionContext>));
      expect(res.ok, `${from} -> ${to}`).toBe(true);
    }
  });

  it("blocks handover until FULLY_PAID", () => {
    const res = evaluateTransition("READY", "READY_FOR_PICKUP", "staff", ctx({ paymentStatus: "PARTIALLY_PAID" }));
    expect(res).toMatchObject({ ok: false });
  });
  it("never offers OUT_FOR_DELIVERY for pickup orders", () => {
    const res = evaluateTransition("READY", "OUT_FOR_DELIVERY", "staff", ctx({ paymentStatus: "FULLY_PAID", fulfillment: "pickup" }));
    expect(res.ok).toBe(false);
  });
  it("blocks role violations and skipped steps", () => {
    expect(evaluateTransition("BAKERY_REVIEW", "QUOTED", "customer", ctx({ quotationIssued: true })).ok).toBe(false);
    expect(evaluateTransition("DRAFT", "SCHEDULED", "admin", ctx()).ok).toBe(false);
  });
  it("blocks accepting an expired quote, or without policy acknowledgment", () => {
    const base = { policyAcknowledged: true, quoteValidUntil: "2026-09-30T00:00:00Z" };
    expect(evaluateTransition("QUOTED", "ACCEPTED", "customer", ctx(base)).ok).toBe(false);
    expect(evaluateTransition("QUOTED", "ACCEPTED", "customer", ctx({ quoteValidUntil: "2026-12-01T00:00:00Z" })).ok).toBe(false);
  });
  it("lets only the system expire quotes, and only after validUntil", () => {
    const expired = ctx({ quoteValidUntil: "2026-09-30T00:00:00Z" });
    expect(evaluateTransition("QUOTED", "QUOTE_EXPIRED", "system", expired).ok).toBe(true);
    expect(evaluateTransition("QUOTED", "QUOTE_EXPIRED", "admin", expired).ok).toBe(false);
  });
  it("blocks scheduling without a verified deposit or capacity", () => {
    expect(evaluateTransition("AWAITING_DEPOSIT", "SCHEDULED", "staff", ctx()).ok).toBe(false);
    expect(evaluateTransition("AWAITING_DEPOSIT", "SCHEDULED", "staff", ctx({ depositVerified: true, capacityAvailable: false })).ok).toBe(false);
  });
  it("blocks customer changes once baking, allows staff override with a reason", () => {
    expect(evaluateTransition("BAKING", "BAKERY_REVIEW", "customer", ctx({ reason: "x" })).ok).toBe(false);
    expect(evaluateTransition("BAKING", "BAKERY_REVIEW", "staff", ctx()).ok).toBe(false);
    expect(evaluateTransition("BAKING", "BAKERY_REVIEW", "staff", ctx({ reason: "customer call" })).ok).toBe(true);
  });
  it("runs the ready-made path incl. cash on pickup and expiry", () => {
    const rm = (patch: Partial<TransitionContext>) => ctx({ orderType: "ready_made", ...patch });
    expect(evaluateTransition("PENDING_PAYMENT", "CONFIRMED", "staff", rm({})).ok).toBe(false);
    expect(evaluateTransition("PENDING_PAYMENT", "CONFIRMED", "staff", rm({ paymentStatus: "FULLY_PAID" })).ok).toBe(true);
    expect(evaluateTransition("PENDING_PAYMENT", "CONFIRMED", "staff", rm({ paymentMethod: "cash_on_pickup" })).ok).toBe(true);
    expect(evaluateTransition("PENDING_PAYMENT", "EXPIRED", "system", rm({ unpaidExpiresAt: "2026-10-01T04:00:00Z" })).ok).toBe(true);
    expect(evaluateTransition("PENDING_PAYMENT", "EXPIRED", "system", rm({ unpaidExpiresAt: "2026-10-01T16:00:00Z" })).ok).toBe(false);
  });
  it("does not expose custom transitions to ready-made orders", () => {
    expect(availableTransitions("DRAFT", "ready_made")).toEqual([]);
    expect(availableTransitions("PREPARING", "ready_made").map((t) => t.to).sort()).toEqual(["OUT_FOR_DELIVERY", "READY_FOR_PICKUP"]);
  });
});
