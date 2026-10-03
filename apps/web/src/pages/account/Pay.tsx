import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckIcon } from "../../components/Icons";
import { Spinner } from "../../components/States";
import { peso } from "../../format";

// PROTOTYPE: stands in for the PayMongo hosted checkout. Amounts are fixed per purpose here and are
// never read from the URL; the real flow takes the amount from the server-side order.
const PURPOSES = {
  deposit: { label: "Deposit", amount: 310000, text: "50% deposit for CK-1042", next: ["/orders/CK-1042", "Track your order"] },
  full: { label: "Full payment", amount: 620000, text: "Full payment for CK-1042", next: ["/orders/CK-1042", "Track your order"] },
  balance: { label: "Balance", amount: 310000, text: "Remaining balance for CK-1042", next: ["/orders/CK-1042", "Track your order"] },
  order: { label: "Cart order", amount: 209000, text: "Order OR-2214", next: ["/orders", "My orders"] },
} as const;
type Purpose = keyof typeof PURPOSES;
const METHODS = ["GCash", "Maya", "Card", "Online banking"] as const;

export function Pay() {
  const [params] = useSearchParams();
  const requested = params.get("for") as Purpose | null;
  const [purpose, setPurpose] = useState<Purpose>(requested && requested in PURPOSES ? requested : "balance");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GCash");
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const p = PURPOSES[purpose];

  useEffect(() => {
    if (phase !== "processing") return;
    const t = window.setTimeout(() => setPhase("done"), 1600);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <main className="page-wrap narrow pay">
      <p className="proto-banner">Prototype · stands in for the PayMongo checkout page</p>
      <div className="card stack">
        {phase === "done" ? (
          <div className="state" role="status">
            <span className="check-badge" aria-hidden="true"><CheckIcon size={28} /></span>
            <h1>Payment received</h1>
            <p className="muted">{p.text}. The bakery has been notified and we’ll verify it shortly.</p>
            <dl className="totals plain wide">
              <div><dt>Amount</dt><dd>{peso(p.amount)}</dd></div><div><dt>Method</dt><dd>{method}</dd></div><div><dt>Reference</dt><dd>PM-7R4K-2210</dd></div>
            </dl>
            <Link to={p.next[0]} className="pill dark">{p.next[1]}</Link>
            <Link to="/shop" className="text-link small">Continue shopping</Link>
            <button type="button" className="link-btn muted small" onClick={() => setPhase("form")}>Reset (prototype)</button>
          </div>
        ) : phase === "processing" ? (
          <>
            <Spinner title="Processing payment" text="Waiting for confirmation from your e-wallet or bank. Don’t close this page." />
            <Link to="/orders" className="text-link center">Cancel and go back</Link>
          </>
        ) : (
          <>
            <div><span className="muted small">Paying Kreative Cakes</span><p className="pay-amount">{peso(p.amount)}</p><p className="muted">{p.text}</p></div>
            <div role="group" aria-label="What are you paying for" className="tabs">
              {(Object.keys(PURPOSES) as Purpose[]).map((k) => <button key={k} type="button" aria-pressed={purpose === k} onClick={() => setPurpose(k)}>{PURPOSES[k].label}</button>)}
            </div>
            <div role="group" aria-label="Payment method" className="method-grid">
              {METHODS.map((m) => <button key={m} type="button" aria-pressed={method === m} onClick={() => setMethod(m)}>{m}</button>)}
            </div>
            <button type="button" className="pill dark block" onClick={() => setPhase("processing")}>Pay {peso(p.amount)} with {method}</button>
            <Link to="/orders" className="text-link center small">Cancel and go back</Link>
          </>
        )}
      </div>
    </main>
  );
}
