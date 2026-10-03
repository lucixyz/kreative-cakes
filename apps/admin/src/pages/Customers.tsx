import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Pill, type Tone } from "../components/ui";

const CUSTOMERS: { name: string; initials: string; email: string; phone: string; orders: number; spent: string; last: string; notes: string; chip: string; tone: Tone }[] = [
  { name: "Juana Dela Cruz", initials: "JD", email: "juana@example.com", phone: "0917 XXX XXXX", orders: 4, spent: "₱10,370", last: "Oct 3", notes: "Prefers pickup", chip: "Repeat", tone: "green" },
  { name: "Bea Santos", initials: "BS", email: "bea@example.com", phone: "0918 XXX XXXX", orders: 1, spent: "₱0", last: "Oct 2", notes: "Debut on Oct 24", chip: "New", tone: "blue" },
  { name: "Paolo Reyes", initials: "PR", email: "paolo@example.com", phone: "0920 XXX XXXX", orders: 1, spent: "₱0", last: "Oct 1", notes: "Wedding, venue TBC", chip: "Quote open", tone: "violet" },
  { name: "Mika Tan", initials: "MT", email: "mika@example.com", phone: "0917 XXX XXXX", orders: 3, spent: "₱6,140", last: "Sep 30", notes: "Nut allergy in family", chip: "Repeat", tone: "green" },
  { name: "Leo Garcia", initials: "LG", email: "leo@company.ph", phone: "0921 XXX XXXX", orders: 6, spent: "₱22,800", last: "Sep 28", notes: "Corporate account, invoice needed", chip: "Business", tone: "amber" },
  { name: "Rina Uy", initials: "RU", email: "rina@example.com", phone: "0915 XXX XXXX", orders: 2, spent: "₱1,320", last: "Oct 2", notes: "", chip: "Repeat", tone: "green" },
];

export function Customers() {
  const [sel, setSel] = useState(0);
  const cur = CUSTOMERS[sel]!;
  return (
    <>
      <PageHead title="Customers" subtitle="People who have ordered or created an account" />
      <div className="split">
        <section className="card flush grow" aria-label="Customers">
          <table style={{ minWidth: 520 }}>
            <thead><tr><th scope="col">Customer</th><th scope="col" className="num">Orders</th><th scope="col" className="num">Total spent</th><th scope="col">Last order</th><th scope="col"><span className="sr">Segment</span></th></tr></thead>
            <tbody>
              {CUSTOMERS.map((r, i) => (
                <tr key={r.email} className={i === sel ? "sel" : ""}>
                  <td><button type="button" className="row-btn" aria-pressed={i === sel} onClick={() => setSel(i)}>{r.name}</button></td>
                  <td className="num">{r.orders}</td><td className="num">{r.spent}</td><td>{r.last}</td><td><Pill tone={r.tone}>{r.chip}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card side stack" aria-label="Customer detail">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="avatar" aria-hidden="true">{cur.initials}</span>
            <div><h2>{cur.name}</h2><span className="crumb">{cur.email}</span></div>
          </div>
          <dl className="dl" style={{ margin: 0 }}>
            <div><dt>Mobile</dt><dd>{cur.phone}</dd></div>
            <div><dt>Orders</dt><dd>{cur.orders} · {cur.spent}</dd></div>
            <div><dt>Notes</dt><dd>{cur.notes || "—"}</dd></div>
          </dl>
          <div className="actions">
            <Link to="/dashboard/messages" className="btn-pill dark">Message</Link>
            <Link to="/dashboard/orders" className="btn-pill">View orders</Link>
          </div>
        </section>
      </div>
    </>
  );
}
