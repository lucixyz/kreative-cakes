import type { DepositRules, PaymentStatus, PaymentTransaction, PaymentTransactionStatus } from "@cakeshop/types";
import { addDays, applyBps, diffInDays, type Centavos, type IsoDate } from "@cakeshop/utils";

/** Payment status is DERIVED from verified transactions; it is never set by hand. */
export function derivePaymentStatus(
  transactions: ReadonlyArray<Pick<PaymentTransaction, "type" | "status" | "amount">>,
  orderTotal: Centavos,
): PaymentStatus {
  const verified = transactions.filter((t) => t.status === "VERIFIED");
  const paid = verified.filter((t) => t.type !== "REFUND").reduce((s, t) => s + t.amount, 0);
  const refunded = verified.filter((t) => t.type === "REFUND").reduce((s, t) => s + t.amount, 0);

  if (refunded > 0) return refunded >= paid ? "REFUNDED" : "PARTIALLY_REFUNDED";
  if (paid <= 0) return "UNPAID";
  return paid >= orderTotal ? "FULLY_PAID" : "PARTIALLY_PAID";
}

export function amountPaid(transactions: ReadonlyArray<Pick<PaymentTransaction, "type" | "status" | "amount">>): Centavos {
  return transactions
    .filter((t) => t.status === "VERIFIED")
    .reduce((s, t) => s + (t.type === "REFUND" ? -t.amount : t.amount), 0);
}

export interface PaymentSchedule {
  fullPaymentRequired: boolean;
  depositAmount: Centavos;
  balanceAmount: Centavos;
  balanceDueDate: IsoDate;
}

/** Deposit / balance split for an accepted quotation (§17.2). */
export function calculatePaymentSchedule(input: {
  total: Centavos;
  rules: DepositRules;
  eventDate: IsoDate;
  today: IsoDate;
}): PaymentSchedule {
  const { total, rules, eventDate, today } = input;
  const fullPaymentRequired = diffInDays(today, eventDate) <= rules.fullPaymentWithinDays;
  const rawDeposit = rules.mode === "percent" ? applyBps(total, rules.value) : rules.value;
  const depositAmount = fullPaymentRequired ? total : Math.min(rawDeposit, total);
  return {
    fullPaymentRequired,
    depositAmount,
    balanceAmount: total - depositAmount,
    balanceDueDate: addDays(eventDate, -rules.balanceDueDaysBefore),
  };
}

/** Allowed proof-review transitions. Rejected proofs are terminal; customers upload a new transaction. */
export const PAYMENT_TRANSACTION_TRANSITIONS: Readonly<Record<PaymentTransactionStatus, readonly PaymentTransactionStatus[]>> = {
  PENDING: ["SUBMITTED"],
  SUBMITTED: ["VERIFIED", "REJECTED"],
  VERIFIED: [],
  REJECTED: [],
};

export const canTransitionPaymentTransaction = (from: PaymentTransactionStatus, to: PaymentTransactionStatus): boolean =>
  PAYMENT_TRANSACTION_TRANSITIONS[from].includes(to);
