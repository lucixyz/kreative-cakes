import { Link } from "react-router-dom";
import { Linkify, Pill, SearchBox, type Tone } from "../components/ui";

const KPIS = [
  { label: "Orders today", value: "18", note: "11 ready-made · 7 custom", tone: "", href: "/dashboard/orders" },
  { label: "Designs awaiting review", value: "4", note: "Oldest waiting 5 h", tone: "amber", href: "/dashboard/design-reviews" },
  { label: "Payments to verify", value: "3", note: "2 deposits · 1 balance", tone: "blue", href: "/dashboard/payments" },
  { label: "Ready for handover", value: "5", note: "1 balance still unpaid", tone: "red", href: "/dashboard/orders" },
];

const QUEUE: { tone: Tone; type: string; title: string; meta: string; action: string; href: string }[] = [
  { tone: "amber", type: "Design", title: "CK-1051 · Floral Debut Cake", meta: "AI design · event Oct 24 · 120 guests", action: "Review", href: "/dashboard/design-reviews" },
  { tone: "blue", type: "Payment", title: "CK-1046 · Deposit ₱4,250 via Maya", meta: "Submitted 20 min ago", action: "Verify", href: "/dashboard/payments" },
  { tone: "red", type: "Balance", title: "CK-1039 · ₱2,800 unpaid", meta: "Pickup today 3:00 PM · handover blocked", action: "Remind", href: "/dashboard/messages" },
  { tone: "violet", type: "Message", title: "Paolo R. on CK-1047", meta: "“Can we move pickup to 10 AM?”", action: "Reply", href: "/dashboard/messages" },
  { tone: "amber", type: "Quote", title: "CK-1044 quote expires tomorrow", meta: "Customer has not responded", action: "Follow up", href: "/dashboard/quotations" },
];

const DAYS: [string, number][] = [["Fri 2", 6], ["Sat 3", 8], ["Sun 4", 3], ["Mon 5", 2], ["Tue 6", 4], ["Wed 7", 5], ["Thu 8", 7]];
const loadColor = (n: number) => (n >= 8 ? "#9c4257" : n >= 6 ? "#c98f4a" : "#6e8b5e");

const ROWS: { id: string; customer: string; date: string; source: string; status: string; tone: Tone; payment: string; amount: string }[] = [
  { id: "CK-1051", customer: "Bea Santos", date: "Oct 24", source: "AI · text", status: "Awaiting review", tone: "amber", payment: "Unpaid", amount: "Est. ₱8,900" },
  { id: "CK-1047", customer: "Paolo Reyes", date: "Nov 14", source: "Manual", status: "Quotation sent", tone: "violet", payment: "Unpaid", amount: "₱14,800" },
  { id: "CK-1046", customer: "Mika Tan", date: "Oct 10", source: "AI · image", status: "Awaiting deposit", tone: "blue", payment: "Proof submitted", amount: "₱8,500" },
  { id: "CK-1042", customer: "Juana Dela Cruz", date: "Oct 17", source: "AI · text", status: "Scheduled", tone: "green", payment: "Partially paid", amount: "₱6,200" },
  { id: "CK-1039", customer: "Leo Garcia", date: "Oct 2", source: "Template", status: "Ready", tone: "red", payment: "Balance due", amount: "₱5,600" },
];

export function Dashboard() {
  return (
    <>
      <div className="adm-head">
        <div><h1>Good morning, Ana</h1><p>Friday, October 2 · 6 cakes in production today</p></div>
        <div className="adm-tools"><SearchBox id="adm-search" label="Search orders and customers" placeholder="Search orders, customers…" /></div>
      </div>

      <div className="kpis">
        {KPIS.map((k) => (
          <Link key={k.label} to={k.href} className={`kpi ${k.tone}`}>
            <span>{k.label}</span><strong>{k.value}</strong><span>{k.note}</span>
          </Link>
        ))}
      </div>

      <div className="split">
        <section className="card grow" aria-label="Needs attention">
          <h2>Needs attention</h2>
          {QUEUE.map((q) => (
            <div key={q.title} className="qrow">
              <span className={`tag tone-${q.tone}`}>{q.type}</span>
              <div className="txt"><strong><Linkify text={q.title} /></strong><span><Linkify text={q.meta} /></span></div>
              <Link to={q.href} className="btn-pill sm">{q.action}</Link>
            </div>
          ))}
        </section>

        <section className="card side stack" aria-label="Production capacity">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <h2>Custom cake capacity</h2><span className="crumb" style={{ fontSize: 12 }}>Next 7 days · max 8/day</span>
          </div>
          {DAYS.map(([label, n]) => (
            <div key={label} className="bar-row">
              <span className="lbl">{label}</span>
              <span className="track"><i style={{ width: `${(n / 8) * 100}%`, background: loadColor(n) }} /></span>
              <b>{n} / 8</b>
            </div>
          ))}
        </section>
      </div>

      <section className="card flush" aria-label="Recent custom orders">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0" }}>
          <h2 style={{ margin: 0 }}>Custom cake orders</h2><Link to="/dashboard/custom-orders" style={{ fontSize: 14 }}>View all</Link>
        </div>
        <table style={{ minWidth: 720 }}>
          <thead><tr>
            <th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Event date</th><th scope="col">Source</th>
            <th scope="col">Status</th><th scope="col">Payment</th><th scope="col" className="num">Amount</th>
          </tr></thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id}>
                <td><Link to="/dashboard/design-reviews" style={{ fontWeight: 600 }}>{r.id}</Link></td>
                <td>{r.customer}</td><td>{r.date}</td><td style={{ color: "var(--muted)" }}>{r.source}</td>
                <td><Pill tone={r.tone}>{r.status}</Pill></td>
                <td style={{ color: "var(--muted)" }}>{r.payment}</td>
                <td className="num" style={{ fontWeight: 600 }}>{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
