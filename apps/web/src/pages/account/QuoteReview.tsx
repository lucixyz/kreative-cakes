import { useState } from "react";
import { Link } from "react-router-dom";
import { QUOTE } from "../../data/account";
import { peso } from "../../format";

const STEPS = ["Design", "Event details", "Bakery review", "Quotation", "Deposit", "Production"];
const money = (pesos: number) => peso(pesos * 100);

export function QuoteReview() {
  const [plan, setPlan] = useState<"deposit" | "full">("deposit");
  const [agree, setAgree] = useState(false);
  const [declined, setDeclined] = useState(false);
  const deposit = Math.round(QUOTE.total / 2);
  const payNow = plan === "deposit" ? deposit : QUOTE.total;

  return (
    <main className="page-wrap">
      <ol className="stepper-bar" aria-label="Steps">
        {STEPS.map((s, i) => <li key={s} className={i < 3 ? "done" : i === 3 ? "now" : ""} aria-current={i === 3 ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      <div className="shop-head">
        <div><h1>Your quotation is ready</h1><p className="muted">{QUOTE.id} · {QUOTE.title} · valid until {QUOTE.validUntil}</p></div>
        <span className={`status ${declined ? "cancelled" : "review"}`}><i aria-hidden="true" />{declined ? "Declined" : "Awaiting your response"}</span>
      </div>

      <div className="tracking">
        <div className="stack">
          <section className="card stack"><h2>Bakery’s note</h2><p className="quote-note">“{QUOTE.note}” <span className="muted">{QUOTE.by}</span></p></section>
          <section className="card stack">
            <h2>Price breakdown</h2>
            <dl className="totals plain">
              {QUOTE.lines.map(([label, amount]) => <div key={label}><dt>{label}</dt><dd>{money(amount)}</dd></div>)}
              <div className="grand"><dt>Final price</dt><dd>{money(QUOTE.total)}</dd></div>
            </dl>
          </section>
          <section className="card stack">
            <h2>Cancellation policy</h2>
            <p className="muted">Deposit is refundable, minus a ₱300 processing fee, until production is scheduled. Once baking starts the deposit is non-refundable. Design changes after acceptance create a revised quotation.</p>
            <Link to="/refunds" className="text-link">Read the full policy</Link>
          </section>
        </div>

        <aside className="card stack summary-card" aria-label="Respond to quotation">
          <h2>How would you like to pay?</h2>
          <div role="group" aria-label="Payment plan" className="plan-grid">
            <button type="button" aria-pressed={plan === "deposit"} onClick={() => setPlan("deposit")} disabled={declined}>
              <strong>Pay now</strong><span>{money(deposit)}</span><small>50% deposit · balance due by Oct 15</small>
            </button>
            <button type="button" aria-pressed={plan === "full"} onClick={() => setPlan("full")} disabled={declined}>
              <strong>Pay in full</strong><span>{money(QUOTE.total)}</span><small>Nothing left to pay later</small>
            </button>
          </div>
          {declined ? (
            <div className="note" role="status">Quotation declined. Your design stays saved, so you can edit and resubmit anytime. <button type="button" className="link-btn" onClick={() => setDeclined(false)}>Undo</button></div>
          ) : (
            <>
              <label className="check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I accept the quotation and the cancellation policy.</label>
              {agree ? <Link to={`/pay?for=${plan === "deposit" ? "deposit" : "full"}`} className="pill dark block">Accept &amp; pay {money(payNow)}</Link> : <button type="button" className="pill dark block" disabled>Accept the policy to continue</button>}
              <Link to="/messages" className="pill outline-dark block">Ask for changes</Link>
              <button type="button" className="link-btn muted" onClick={() => setDeclined(true)}>Decline quotation</button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
