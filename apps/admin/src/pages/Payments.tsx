import { DeviceMobile, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { PageHead, Pill, peso, type Tone } from "../components/ui";

type Status = "pending" | "verified" | "rejected";
const PROOFS = [
  { order: "CK-1046", type: "Deposit", customer: "Mika Tan", method: "Maya", ago: "20 min ago", amount: 4250, entered: 4250, ref: "MY-88213904", paidOn: "Oct 2, 9:41 AM" },
  { order: "OR-2213", type: "Full payment", customer: "Rina Uy", method: "GCash", ago: "35 min ago", amount: 840, entered: 800, ref: "GC-5531 2207", paidOn: "Oct 2, 9:26 AM" },
  { order: "CK-1039", type: "Balance", customer: "Leo Garcia", method: "Bank transfer", ago: "1 h ago", amount: 2800, entered: 2800, ref: "BT-20261002-117", paidOn: "Oct 2, 8:50 AM" },
  { order: "CK-1049", type: "Deposit", customer: "Ana Lim", method: "GCash", ago: "2 h ago", amount: 3600, entered: 3600, ref: "GC-5528 9914", paidOn: "Oct 2, 7:58 AM" },
];
const LABEL: Record<Status, [string, Tone]> = { pending: ["Pending", "amber"], verified: ["Verified", "green"], rejected: ["Rejected", "red"] };
const REASONS = ["Amount does not match", "Screenshot unclear", "Reference not found", "Duplicate submission"];

export function Payments() {
  const [sel, setSel] = useState(0);
  const [status, setStatus] = useState<Status[]>(PROOFS.map(() => "pending"));
  const [reason, setReason] = useState(REASONS[0]!);
  const cur = PROOFS[sel]!;
  const st = status[sel]!;
  const set = (v: Status) => setStatus(status.map((s, i) => (i === sel ? v : s)));
  const mismatch = cur.amount !== cur.entered;

  return (
    <>
      <PageHead title="Payment verification" subtitle="Check each proof against the bank or e-wallet record before confirming. Gateway payments verify automatically." />
      <div className="split">
        <section className="side stack" style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-label="Queue">
          {PROOFS.map((p, i) => (
            <button key={p.order} type="button" className="queue-item" aria-pressed={i === sel} onClick={() => setSel(i)}>
              <span><strong>{p.order} · {p.type}</strong><small>{p.customer} · {p.method} · {p.ago}</small></span>
              <span><strong>{peso(p.amount)}</strong><Pill tone={LABEL[status[i]!][1]}>{LABEL[status[i]!][0]}</Pill></span>
            </button>
          ))}
        </section>

        <section className="card grow stack" aria-label="Proof details">
          <div className="proof">
            <DeviceMobile size={40} aria-hidden="true" />
            Uploaded proof: {cur.method} receipt screenshot
            <a href="#proof" onClick={(e) => e.preventDefault()}>Open full size</a>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div><div className="crumb">{cur.order} · {cur.type}</div><h2 style={{ margin: 0 }}>{cur.customer}</h2></div>
            <Pill tone={LABEL[st][1]}>{LABEL[st][0]}</Pill>
          </div>
          <dl className="dl" style={{ margin: 0 }}>
            <div><dt>Amount expected</dt><dd>{peso(cur.amount)}</dd></div>
            <div><dt>Amount entered by customer</dt><dd>{peso(cur.entered)}</dd></div>
            <div><dt>Reference no.</dt><dd>{cur.ref}</dd></div>
            <div><dt>Paid on</dt><dd>{cur.paidOn}</dd></div>
          </dl>
          {mismatch ? (
            <div className="warn" role="alert">
              <Warning size={18} aria-hidden="true" />
              Amount does not match. Ask the customer or reject with a reason.
            </div>
          ) : null}
          {st === "pending" ? (
            <>
              <div className="fld">
                <label htmlFor="rr">Reason if rejecting</label>
                <select id="rr" value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select>
              </div>
              <div className="actions">
                <button type="button" className="btn-pill dark" onClick={() => set("verified")}>Verify payment</button>
                <button type="button" className="btn-pill danger" onClick={() => set("rejected")}>Reject</button>
              </div>
            </>
          ) : (
            <div className="notice" role="status">
              {st === "verified" ? "Verified. The order moved forward and the customer was notified." : `Rejected (${reason.toLowerCase()}). The customer was asked to re-upload.`}
              <button type="button" className="btn-pill sm" onClick={() => set("pending")}>Undo</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
