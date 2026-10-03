import { useState } from "react";
import { PageHead, Segmented, peso, useToast } from "../components/ui";

type Range = "week" | "month" | "quarter";
const DATA: Record<Range, { kpis: [string, string, string, string]; bars: [string, number][]; conv: string }> = {
  week: { kpis: ["₱38,450", "29", "₱1,326", "7"], bars: [["Fri", 4200], ["Sat", 9800], ["Sun", 7100], ["Mon", 3300], ["Tue", 4100], ["Wed", 3950], ["Thu", 6000]], conv: "24%" },
  month: { kpis: ["₱162,900", "118", "₱1,380", "26"], bars: [["Wk 1", 35200], ["Wk 2", 41800], ["Wk 3", 38450], ["Wk 4", 47450]], conv: "21%" },
  quarter: { kpis: ["₱455,300", "342", "₱1,331", "71"], bars: [["Jul", 139800], ["Aug", 152600], ["Sep", 162900]], conv: "19%" },
};
const TOP: [string, number][] = [["Strawberry Chiffon Dream", 64], ["Ube Macapuno Layer", 51], ["Custom 2-tier", 33], ["Matcha Bento", 29], ["Cupcakes (6)", 25]];
const LABELS = ["Revenue", "Orders", "Average order", "Custom cakes"];

export function Reports() {
  const [range, setRange] = useState<Range>("week");
  const toast = useToast();
  const r = DATA[range];
  const max = Math.max(...r.bars.map((b) => b[1]));
  return (
    <>
      <PageHead title="Reports" subtitle="Sales and order performance (sample data)">
        <button type="button" className="btn-pill" onClick={() => toast.show("Report exported as PDF and CSV")}>Export</button>
      </PageHead>
      <Segmented label="Date range" value={range} onChange={setRange} options={[{ id: "week", label: "Last 7 days" }, { id: "month", label: "This month" }, { id: "quarter", label: "This quarter" }]} />
      <div className="kpis">
        {LABELS.map((l, i) => <div key={l} className="kpi"><span>{l}</span><strong>{r.kpis[i]}</strong></div>)}
      </div>
      <div className="split">
        <section className="card grow" aria-label="Revenue">
          <h2>Revenue</h2>
          <div className="chart" role="img" aria-label={`Revenue by period: ${r.bars.map((b) => `${b[0]} ${peso(b[1])}`).join(", ")}`}>
            {r.bars.map(([label, v]) => (
              <div key={label} className="col"><span>₱{Math.round(v / 1000)}k</span><i style={{ height: `${Math.round((v / max) * 160)}px` }} /><span>{label}</span></div>
            ))}
          </div>
        </section>
        <section className="card side stack" aria-label="Top sellers">
          <h2>Top sellers</h2>
          {TOP.map(([name, n]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>{name}</span><b>{n}</b></div>
              <span className="track" style={{ height: 8, borderRadius: 4, background: "var(--line-soft)", overflow: "hidden", display: "block" }}>
                <i style={{ display: "block", height: "100%", width: `${Math.round((n / 64) * 100)}%`, background: "var(--accent)" }} />
              </span>
            </div>
          ))}
          <div className="note">AI Designer submitted: <strong>{r.conv}</strong> of generated designs</div>
        </section>
      </div>
      {toast.node}
    </>
  );
}
