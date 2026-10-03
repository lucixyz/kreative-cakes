import { useState } from "react";
import { Link } from "react-router-dom";
import { Pill, peso, type Tone } from "../components/ui";

type Mode = "review" | "changes" | "quoted" | "changesSent" | "rejected";
const STATUS: Record<Mode, [string, Tone]> = {
  review: ["Awaiting review", "amber"],
  changes: ["Writing change request", "amber"],
  quoted: ["Quotation sent", "violet"],
  changesSent: ["Changes requested", "blue"],
  rejected: ["Rejected", "red"],
};
const LINES = [
  { key: "base", label: "3-tier ube base cake", amount: 4800 },
  { key: "flowers", label: "Sugar flowers × 18 (peony style)", amount: 2700 },
  { key: "pearls", label: "Pearl border", amount: 450 },
  { key: "topper", label: "Custom topper", amount: 350 },
  { key: "delivery", label: "Delivery (Zone 2)", amount: 250 },
];

export function DesignReview() {
  const [mode, setMode] = useState<Mode>("review");
  const [lines, setLines] = useState(LINES);
  const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const [label, tone] = STATUS[mode];
  const done = mode === "quoted" || mode === "changesSent" || mode === "rejected";
  const doneText = mode === "quoted" ? `Quotation of ${peso(total)} sent, valid until Oct 9.` : mode === "changesSent" ? "Change request sent to Bea." : "Design rejected and customer informed.";

  return (
    <>
      <nav aria-label="Breadcrumb" className="crumb"><Link to="/dashboard/custom-orders">Design reviews</Link> / 1 of 4</nav>
      <div className="adm-head"><h1>CK-1051 · Floral Debut Cake</h1><Pill tone={tone}>{label}</Pill></div>

      <div className="split">
        <div className="grow" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <section className="card stack" aria-label="Request details">
            <h2>Customer &amp; event</h2>
            <dl className="dl" style={{ margin: 0 }}>
              <div><dt>Customer</dt><dd>Bea Santos · 0917 XXX XXXX</dd></div>
              <div><dt>Event</dt><dd>18th birthday (debut)</dd></div>
              <div><dt>Requested</dt><dd>Sat, Oct 24 · delivery, 3–5 PM</dd></div>
              <div><dt>Guests</dt><dd>120</dd></div>
            </dl>
            <Pill tone="green">Oct 24 has capacity (3 of 8 booked)</Pill>
            <h2 style={{ marginTop: 8 }}>Configuration</h2>
            <dl className="dl" style={{ margin: 0 }}>
              <div><dt>Structure</dt><dd>3 round tiers 12″ / 9″ / 6″, 4″ high</dd></div>
              <div><dt>Flavor</dt><dd>Ube with macapuno filling</dd></div>
              <div><dt>Frosting</dt><dd>Buttercream</dd></div>
              <div><dt>Palette</dt><dd>Blush, ivory, gold accent</dd></div>
              <div><dt>Decorations</dt><dd>Sugar flowers × 18 (top edges), pearls border</dd></div>
              <div><dt>Topper</dt><dd>“Bea at 18”</dd></div>
              <div><dt>Customer note</dt><dd>“Please make the flowers look like peonies.”</dd></div>
            </dl>
            <div className="note">
              <strong>AI notes.</strong> Generated from text prompt. Serving estimate 60–70 is below 120 guests; consider a 4th tier or a side sheet cake. “Peony” requested; mapped to catalog item “Sugar flower, large”.
            </div>
          </section>

          <section className="card stack" aria-label="Design preview">
            <h2>Submitted design</h2>
            <div className="preview-art">Version 1 · from AI Designer</div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", color: "var(--muted)", fontSize: 14 }}>
              <span>Inspiration image attached</span><span>Customer estimate ₱8,900</span>
            </div>
          </section>
        </div>

        <section className="card side stack" aria-label="Quotation">
          <h2>Quotation</h2>
          {lines.map((l, i) => (
            <div key={l.key} className="fld">
              <label htmlFor={l.key}>{l.label}</label>
              <div className="pre">
                <span>₱</span>
                <input id={l.key} type="number" min={0} value={l.amount} disabled={mode !== "review"}
                  onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, amount: Math.max(0, Number(e.target.value)) } : x)))} />
              </div>
            </div>
          ))}
          <div className="total-row"><span>Final price</span><span>{peso(total)}</span></div>
          <div className="fld">
            <label htmlFor="dep">Deposit</label>
            <select id="dep"><option>50% · {peso(Math.round(total / 2))}</option><option>Full payment</option></select>
          </div>
          <div className="fld"><label htmlFor="valid">Valid until</label><input id="valid" type="date" defaultValue="2026-10-09" /></div>

          {mode === "review" ? (
            <div className="actions" style={{ flexDirection: "column" }}>
              <button type="button" className="btn-pill dark" onClick={() => setMode("quoted")}>Accept design &amp; send quotation</button>
              <button type="button" className="btn-pill" onClick={() => setMode("changes")}>Request changes</button>
              <button type="button" className="btn-pill danger" onClick={() => setMode("rejected")}>Reject</button>
            </div>
          ) : null}

          {mode === "changes" ? (
            <>
              <div className="fld">
                <label htmlFor="chg">What should the customer change?</label>
                <textarea id="chg" rows={4} defaultValue="For 120 guests we suggest adding a 4th tier (14″) or a matching sheet cake. Peony-style sugar flowers are available." />
              </div>
              <div className="actions">
                <button type="button" className="btn-pill dark" onClick={() => setMode("changesSent")}>Send to customer</button>
                <button type="button" className="btn-pill" onClick={() => setMode("review")}>Cancel</button>
              </div>
            </>
          ) : null}

          {done ? (
            <div className="notice" role="status">
              {doneText}
              <span style={{ fontSize: 13 }}>The customer was notified in the app and by email. The conversation is attached to CK-1051.</span>
              <button type="button" className="btn-pill sm" onClick={() => setMode("review")}>Undo (prototype)</button>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
