import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../../components/States";
import { QUOTE, TRACKING_STEPS, THREADS, type Msg } from "../../data/account";
import { peso } from "../../format";

// PROTOTYPE: only CK-1042 has tracking data until the API provides orders.
export function OrderTracking() {
  const { id } = useParams();
  const [msgs, setMsgs] = useState<Msg[]>(THREADS[0]!.messages);
  const [draft, setDraft] = useState("");

  if (id !== QUOTE.id) {
    return (
      <main className="page-wrap narrow">
        <ErrorState title="We couldn’t find that order" text="Check the order number, or open it from your orders list."><Link to="/orders" className="pill outline-dark">My orders</Link></ErrorState>
      </main>
    );
  }
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs([...msgs, { mine: true, text, when: "Just now" }]);
    setDraft("");
  };

  return (
    <main className="page-wrap">
      <p className="crumbs"><Link to="/orders">My orders</Link> / {QUOTE.id}</p>
      <div className="shop-head">
        <div><h1>{QUOTE.title}</h1><p className="muted">Custom order {QUOTE.id} · Pickup on Sat, Oct 17, 2:00–4:00 PM</p></div>
        <span className="status scheduled"><i aria-hidden="true" />Scheduled for production</span>
      </div>

      <div className="tracking">
        <div className="stack">
          <section className="card" aria-label="Order progress">
            <h2>Order progress</h2>
            <ol className="timeline">
              {TRACKING_STEPS.map((s) => (
                <li key={s.title} className={s.state} aria-current={s.state === "now" ? "step" : undefined}>
                  <span className="dot-mark" aria-hidden="true" />
                  <div><strong>{s.title}</strong>{s.tag ? <span className="tag-chip">{s.tag}</span> : null}<span className="muted small">{s.when}</span></div>
                </li>
              ))}
            </ol>
          </section>
          <section className="card stack" aria-label="Design">
            <h2>Approved design <span className="muted small">· Version 2 · locked</span></h2>
            <dl className="info-rows plain">
              <div><dt>Structure</dt><dd>3 round tiers (12″, 9″, 6″), fondant</dd></div>
              <div><dt>Flavor</dt><dd>Vanilla chiffon with strawberry cream</dd></div>
              <div><dt>Colors</dt><dd>Purple, white, gold accents</dd></div>
              <div><dt>Decorations</dt><dd>8 butterflies, 6 sugar flowers, “Happy 18th” topper</dd></div>
              <div><dt>Serves</dt><dd>About 60–70</dd></div>
            </dl>
          </section>
        </div>

        <div className="stack">
          <section className="card stack" aria-label="Payment">
            <h2>Payment <span className="status review small-tag"><i aria-hidden="true" />Partially paid</span></h2>
            <dl className="totals plain">
              <div><dt>Final quotation</dt><dd>{peso(QUOTE.total * 100)}</dd></div>
              <div><dt>Deposit (50%) · GCash · verified</dt><dd>− {peso(310000)}</dd></div>
              <div className="grand"><dt>Balance due</dt><dd>{peso(310000)}</dd></div>
            </dl>
            <p className="muted small">Due by Thu, Oct 15. Pay before pickup so we can release your cake.</p>
            <Link to="/pay?for=balance" className="pill dark block">Pay balance · {peso(310000)}</Link>
            <Link to="/quotation" className="text-link small">View quotation &amp; cancellation policy</Link>
          </section>

          <section className="card chat" aria-label="Messages with the bakery">
            <h2>Messages</h2>
            <div className="bubbles" aria-live="polite">
              <div className="system-msg">Quotation sent · {peso(QUOTE.total * 100)}</div>
              {msgs.map((m, i) => <div key={i} className={`bubble${m.mine ? " mine" : ""}`}>{m.text}<span className="small">{m.mine ? m.when : `Bakery · ${m.when}`}</span></div>)}
            </div>
            <form className="row tight composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <label htmlFor="reply" className="sr">Write a message</label>
              <input id="reply" type="text" placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className="pill dark">Send</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
