import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHead, Pill, SearchBox, Segmented, useToast, type Tone } from "../components/ui";

type Order = { id: string; kind: "Ready-made" | "Custom"; customer: string; items: string; when: string; mode: string; status: string; tone: Tone; payment: string; total: string; href: string };
const o = (id: string, kind: Order["kind"], customer: string, items: string, when: string, mode: string, status: string, tone: Tone, payment: string, total: string, href?: string): Order =>
  ({ id, kind, customer, items, when, mode, status, tone, payment, total, href: href ?? (kind === "Custom" ? "/dashboard/design-reviews" : "/dashboard/payments") });

const ALL: Order[] = [
  o("OR-2214", "Ready-made", "Carlo Mendoza", "Mango Cream Torte ×1", "Today 5:00 PM", "Delivery · Zone 1", "Preparing", "green", "Paid · GCash", "₱1,300"),
  o("OR-2213", "Ready-made", "Rina Uy", "Cupcakes (6) ×2", "Today 4:00 PM", "Pickup", "Awaiting payment", "blue", "Unpaid · expires 1 h", "₱840"),
  o("CK-1051", "Custom", "Bea Santos", "3-tier Floral Debut", "Oct 24", "Delivery · Zone 2", "Awaiting review", "amber", "—", "Est. ₱8,900"),
  o("OR-2210", "Ready-made", "Juana Dela Cruz", "Strawberry Chiffon + 1", "Today 4:00 PM", "Pickup", "Ready for pickup", "green", "Paid · Card", "₱2,090"),
  o("CK-1047", "Custom", "Paolo Reyes", "3-tier Rustic Wedding", "Nov 14", "Delivery · Zone 3", "Quotation sent", "violet", "Unpaid", "₱14,800"),
  o("CK-1046", "Custom", "Mika Tan", "2-tier Baptism", "Oct 10", "Pickup", "Awaiting deposit", "blue", "Proof submitted", "₱8,500", "/dashboard/payments"),
  o("CK-1042", "Custom", "Juana Dela Cruz", "3-tier Butterfly 18th", "Oct 17", "Pickup", "Scheduled", "green", "Deposit paid", "₱6,200"),
  o("CK-1039", "Custom", "Leo Garcia", "1-tier Corporate logo", "Today 3:00 PM", "Pickup", "Ready · balance due", "red", "₱2,800 unpaid", "₱5,600"),
  o("OR-2175", "Ready-made", "Juana Dela Cruz", "Dark Chocolate Ganache", "Sep 21", "Delivery · Zone 1", "Completed", "grey", "Paid · Maya", "₱1,600"),
];
const PAGE = 6;
type Kind = "all" | "ready" | "custom";

const STATUS_GROUPS: Record<string, string[]> = {
  "Awaiting review": ["Awaiting review"],
  "Awaiting payment": ["Awaiting payment", "Awaiting deposit"],
  "In production": ["Preparing", "Scheduled"],
  Ready: ["Ready for pickup", "Ready · balance due"],
  Completed: ["Completed"],
};

export function Orders({ initialKind = "all" }: { initialKind?: Kind }) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [status, setStatus] = useState("All statuses");
  const [search] = useSearchParams();
  const [q, setQ] = useState(search.get("q") ?? "");
  const [page, setPage] = useState(1);
  const toast = useToast();

  const rows = ALL.filter((r) =>
    (kind === "all" || (kind === "custom" ? r.kind === "Custom" : r.kind === "Ready-made")) &&
    (status === "All statuses" || STATUS_GROUPS[status]?.includes(r.status)) &&
    (!q || `${r.id} ${r.customer}`.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pg = Math.min(page, pages);

  return (
    <>
      <PageHead title={initialKind === "custom" ? "Custom cake orders" : "Orders"} subtitle="All ready-made and custom cake orders">
        <SearchBox id="os" label="Search orders" placeholder="Order no. or customer" value={q} onChange={(v) => { setQ(v); setPage(1); }} />
        <button type="button" className="btn-pill" onClick={() => toast.show(`orders.csv exported · ${rows.length} orders`)}>Export CSV</button>
      </PageHead>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Segmented label="Order type" value={kind} onChange={(v) => { setKind(v); setPage(1); }} options={[{ id: "all", label: "All" }, { id: "ready", label: "Ready-made" }, { id: "custom", label: "Custom cakes" }]} />
        <div className="adm-tools">
          <label htmlFor="fs" className="crumb">Status</label>
          <select id="fs" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option>All statuses</option>{Object.keys(STATUS_GROUPS).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <section className="card flush" aria-label="Orders">
        <table style={{ minWidth: 860 }}>
          <thead><tr>
            <th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Items</th><th scope="col">Handover</th>
            <th scope="col">Status</th><th scope="col">Payment</th><th scope="col" className="num">Total</th>
          </tr></thead>
          <tbody>
            {rows.slice((pg - 1) * PAGE, pg * PAGE).map((r) => (
              <tr key={r.id}>
                <td><Link to={r.href} style={{ fontWeight: 600 }}>{r.id}</Link><span className="sub">{r.kind}</span></td>
                <td>{r.customer}</td><td style={{ color: "#4a3f38" }}>{r.items}</td>
                <td>{r.when}<span className="sub">{r.mode}</span></td>
                <td><Pill tone={r.tone}>{r.status}</Pill></td>
                <td style={{ color: "#4a3f38" }}>{r.payment}</td>
                <td className="num" style={{ fontWeight: 600 }}>{r.total}</td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>No orders match these filters.</td></tr> : null}
          </tbody>
        </table>
        <div className="tfoot">
          <span>{rows.length} orders · page {pg} of {pages}</span>
          <div className="actions">
            <button type="button" className="btn-pill sm" disabled={pg <= 1} onClick={() => setPage(pg - 1)}>Previous</button>
            <button type="button" className="btn-pill sm" disabled={pg >= pages} onClick={() => setPage(pg + 1)}>Next</button>
          </div>
        </div>
      </section>
      {toast.node}
    </>
  );
}
