import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/ui";

type Stage = "bake" | "deco" | "ready";
const STAGE: Record<Stage, { bg: string; fg: string; label: string }> = {
  bake: { bg: "#e3ecf5", fg: "#23466b", label: "Baking" },
  deco: { bg: "#eee6f4", fg: "#4e3270", label: "Decorating" },
  ready: { bg: "#e5ebdf", fg: "#3e5233", label: "Ready · handover" },
};
type Item = { id: string; name: string; stage: Stage; href?: string };
const it = (id: string, name: string, stage: Stage, href?: string): Item => (href ? { id, name, stage, href } : { id, name, stage });
const PAY = "/dashboard/payments";

const WEEKS: { label: string; days: [string, Item[]][] }[] = [
  { label: "Oct 2 – Oct 8", days: [["Fri 2", [it("CK-1039", "Corporate logo", "ready"), it("CK-1036", "Baby shower", "ready")]], ["Sat 3", [it("CK-1040", "Debut 2-tier", "deco"), it("CK-1041", "Anniversary", "bake")]], ["Sun 4", [it("CK-1043", "Christening", "bake")]], ["Mon 5", []], ["Tue 6", [it("CK-1045", "Retirement", "bake")]], ["Wed 7", []], ["Thu 8", [it("CK-1048", "Kids party", "bake")]]] },
  { label: "Oct 9 – Oct 15", days: [["Fri 9", [it("CK-1046", "Baptism 2-tier", "deco", PAY)]], ["Sat 10", [it("CK-1046", "Baptism 2-tier", "ready", PAY)]], ["Sun 11", []], ["Mon 12", []], ["Tue 13", [it("CK-1050", "Graduation", "bake")]], ["Wed 14", []], ["Thu 15", []]] },
  { label: "Oct 16 – Oct 22", days: [["Fri 16", [it("CK-1042", "Butterfly 18th", "bake")]], ["Sat 17", [it("CK-1042", "Butterfly 18th", "deco"), it("CK-1042", "Pickup 2–4 PM", "ready")]], ["Sun 18", []], ["Mon 19", []], ["Tue 20", []], ["Wed 21", []], ["Thu 22", []]] },
];

export function Calendar() {
  const [week, setWeek] = useState(0);
  const w = WEEKS[week]!;
  return (
    <>
      <PageHead title="Production calendar" subtitle="Custom cakes by production day · capacity 8 per day">
        <div className="adm-tools">
          <button type="button" className="btn-pill sm" aria-label="Previous week" disabled={week === 0} onClick={() => setWeek(week - 1)}><CaretLeft size={16} aria-hidden="true" /></button>
          <span style={{ fontWeight: 600, minWidth: 130, textAlign: "center" }} aria-live="polite">{w.label}</span>
          <button type="button" className="btn-pill sm" aria-label="Next week" disabled={week === WEEKS.length - 1} onClick={() => setWeek(week + 1)}><CaretRight size={16} aria-hidden="true" /></button>
        </div>
      </PageHead>
      <div className="cal">
        {w.days.map(([label, items]) => (
          <section key={label} className="cal-day" aria-label={label}>
            <header><span>{label}</span><span style={{ color: items.length >= 6 ? "var(--red-fg)" : "var(--muted)" }}>{items.length} / 8</span></header>
            {items.length === 0 ? <span style={{ fontSize: 12, color: "var(--muted)" }}>Nothing scheduled</span> : null}
            {items.map((i, n) => (
              <Link key={`${i.id}-${n}`} to={i.href ?? "/dashboard/orders"} className="cal-item" style={{ background: STAGE[i.stage].bg, color: STAGE[i.stage].fg }}>
                <strong>{i.id}</strong><span>{i.name}</span><span>{STAGE[i.stage].label}</span>
              </Link>
            ))}
          </section>
        ))}
      </div>
      <div className="legend">
        {(Object.keys(STAGE) as Stage[]).map((s) => <span key={s}><i style={{ background: STAGE[s].bg }} />{STAGE[s].label}</span>)}
      </div>
    </>
  );
}
