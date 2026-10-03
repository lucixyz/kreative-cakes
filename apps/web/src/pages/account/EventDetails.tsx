import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon } from "../../components/Icons";
import { peso } from "../../format";

const STEPS = ["Design", "Event details", "Bakery review", "Quotation", "Deposit", "Production"];
const OCCASIONS = ["18th birthday (debut)", "Birthday", "Wedding", "Anniversary", "Corporate", "Other"];
const TIMES = ["10 AM – 12 PM", "12 PM – 2 PM", "2 PM – 4 PM", "4 PM – 6 PM"];

// PROTOTYPE: submit-for-review step of the custom cake flow. Nothing is sent anywhere yet.
export function EventDetails() {
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <main className="page-wrap narrow">
        <div className="state card">
          <span className="check-badge" aria-hidden="true"><CheckIcon size={28} /></span>
          <h1>Sent to our bakers</h1>
          <p className="muted">Order CK-1042 is in review. We usually reply within 24 hours with a quotation or suggested changes. You’ll get a notification and an email.</p>
          <div className="row tight center-row"><Link to="/quotation" className="pill dark">See the quotation (demo)</Link><Link to="/messages" className="pill outline-dark">Message the bakery</Link></div>
          <button type="button" className="link-btn muted small" onClick={() => setSent(false)}>Back to form (prototype)</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <ol className="stepper-bar" aria-label="Steps">
        {STEPS.map((s, i) => <li key={s} className={i < 1 ? "done" : i === 1 ? "now" : ""} aria-current={i === 1 ? "step" : undefined}>{i + 1}. {s}</li>)}
      </ol>
      <h1>Tell us about your event</h1>
      <p className="muted">Our bakers use this to check your design and prepare your quotation.</p>

      <form className="tracking" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <div className="stack">
          <section className="card two-col">
            <div className="field"><label htmlFor="ev">Occasion</label><select id="ev">{OCCASIONS.map((o) => <option key={o}>{o}</option>)}</select></div>
            <div className="field"><label htmlFor="gu">Number of guests</label><input id="gu" type="number" min={1} defaultValue={60} /></div>
            <div className="field"><label htmlFor="ed">Event date</label><input id="ed" type="date" defaultValue="2026-10-17" /></div>
            <div className="field"><label htmlFor="et">Preferred time</label><select id="et">{TIMES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <p className="note span-all" role="status">3-tier cakes need at least 5 days’ notice. Oct 17 is available.</p>
          </section>
          <section className="card stack">
            <h2>Pickup or delivery</h2>
            <div role="group" aria-label="Pickup or delivery" className="tabs">
              <button type="button" aria-pressed={mode === "pickup"} onClick={() => setMode("pickup")}>Pickup</button>
              <button type="button" aria-pressed={mode === "delivery"} onClick={() => setMode("delivery")}>Delivery</button>
            </div>
            {mode === "delivery" ? <div className="field"><label htmlFor="ad">Delivery address</label><input id="ad" type="text" /></div> : <p className="muted">Pick up at [store address] during opening hours.</p>}
          </section>
          <section className="card stack">
            <div className="field"><label htmlFor="nt">Notes for the bakery (optional)</label><textarea id="nt" rows={4} placeholder="Allergies, venue details, anything special…" /></div>
            {files.length > 0 ? (
              <ul className="file-list">{files.map((f) => <li key={f}>{f}<button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles(files.filter((x) => x !== f))}>×</button></li>)}</ul>
            ) : null}
            <label className="pill outline-dark small align-start">Attach inspiration images
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? []).map((f) => f.name)])} />
            </label>
          </section>
        </div>

        <aside className="card stack summary-card" aria-label="Design summary">
          <h2>Butterfly 18th Birthday Cake</h2>
          <p className="muted">3 tiers · purple, white, gold · 8 butterflies, 6 flowers · serves 60–70</p>
          <dl className="totals plain"><div className="grand"><dt>Estimated price</dt><dd>{peso(577000)}</dd></div></dl>
          <p className="muted small">The final price comes from the bakery’s quotation. You won’t pay anything until you accept it.</p>
          <button type="submit" className="pill dark block">Submit for bakery review</button>
          <Link to="/cake-builder" className="text-link center small">Back to editing</Link>
        </aside>
      </form>
    </main>
  );
}
