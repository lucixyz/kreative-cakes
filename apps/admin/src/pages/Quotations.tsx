import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Pill, Segmented, type Tone } from "../components/ui";

type Group = "open" | "accepted" | "closed";
const QUOTES: { id: string; cust: string; cake: string; amt: string; sent: string; valid: string; group: Group; chip: string; tone: Tone; action: string; href: string }[] = [
  { id: "Q-1047", cust: "Paolo Reyes", cake: "Rustic Wedding · 3 tiers", amt: "₱14,800", sent: "Oct 1", valid: "Oct 9", group: "open", chip: "Awaiting customer", tone: "violet", action: "Remind", href: "/dashboard/messages" },
  { id: "Q-1044", cust: "Ella Cruz", cake: "Floral Anniversary · 2 tiers", amt: "₱7,400", sent: "Sep 27", valid: "Oct 3", group: "open", chip: "Expires tomorrow", tone: "amber", action: "Follow up", href: "/dashboard/messages" },
  { id: "Q-1046", cust: "Mika Tan", cake: "Baptism · 2 tiers", amt: "₱8,500", sent: "Sep 30", valid: "Oct 8", group: "accepted", chip: "Accepted · deposit pending", tone: "blue", action: "Verify deposit", href: "/dashboard/payments" },
  { id: "Q-1042", cust: "Juana Dela Cruz", cake: "Butterfly 18th · 3 tiers", amt: "₱6,200", sent: "Oct 3", valid: "Oct 9", group: "accepted", chip: "Accepted · deposit paid", tone: "green", action: "View order", href: "/dashboard/orders" },
  { id: "Q-1038", cust: "Ryan Lim", cake: "Corporate sheet cake", amt: "₱3,900", sent: "Sep 20", valid: "Sep 27", group: "closed", chip: "Expired", tone: "grey", action: "Re-send", href: "/dashboard/messages" },
  { id: "Q-1035", cust: "Kim Navarro", cake: "Gender reveal · 1 tier", amt: "₱2,600", sent: "Sep 18", valid: "Sep 25", group: "closed", chip: "Declined", tone: "red", action: "View", href: "/dashboard/messages" },
];

export function Quotations() {
  const [tab, setTab] = useState<"all" | Group>("all");
  const rows = QUOTES.filter((r) => tab === "all" || r.group === tab);
  return (
    <>
      <PageHead title="Quotations" subtitle="Quotes sent to customers for custom cakes">
        <Link to="/dashboard/design-reviews" className="btn-pill dark">Review next design</Link>
      </PageHead>
      <Segmented label="Quotation status" value={tab} onChange={setTab} options={[{ id: "all", label: "All" }, { id: "open", label: "Awaiting customer" }, { id: "accepted", label: "Accepted" }, { id: "closed", label: "Expired & declined" }]} />
      <section className="card flush" aria-label="Quotations">
        <table style={{ minWidth: 860 }}>
          <thead><tr>
            <th scope="col">Quote</th><th scope="col">Customer</th><th scope="col">Cake</th><th scope="col" className="num">Amount</th>
            <th scope="col">Sent</th><th scope="col">Valid until</th><th scope="col">Status</th><th scope="col"><span className="sr">Action</span></th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.id}</td><td>{r.cust}</td><td style={{ color: "#4a3f38" }}>{r.cake}</td>
                <td className="num" style={{ fontWeight: 600 }}>{r.amt}</td><td>{r.sent}</td><td>{r.valid}</td>
                <td><Pill tone={r.tone}>{r.chip}</Pill></td>
                <td><Link to={r.href} style={{ fontWeight: 500 }}>{r.action}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
