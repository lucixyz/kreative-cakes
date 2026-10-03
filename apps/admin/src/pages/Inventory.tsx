import { useState } from "react";
import { Dialog, Field, PageHead, Pill, useToast } from "../components/ui";

const ITEMS: [name: string, group: string, qty: number, unit: string, reorder: number][] = [
  ["All-purpose flour", "Dry goods", 42, "kg", 20], ["Cake flour", "Dry goods", 8, "kg", 15], ["Unsalted butter", "Dairy", 18, "kg", 10],
  ["Fresh eggs", "Dairy", 6, "trays", 8], ["Ube halaya", "Fillings", 0, "kg", 4], ["Fondant, white", "Decorating", 12, "kg", 6],
  ["Gold wafer butterflies", "Decorations", 40, "pcs", 60], ["Sugar pearls", "Decorations", 1.5, "kg", 1], ["Cake boards 12″", "Packaging", 0, "pcs", 20],
];
const STATE = {
  ok: { label: "In stock", tone: "green", color: "#6e8b5e" },
  low: { label: "Low", tone: "amber", color: "#c98f4a" },
  out: { label: "Out", tone: "red", color: "#9c4257" },
} as const;
const round = (n: number) => Math.round(n * 10) / 10;

export function Inventory() {
  const [adj, setAdj] = useState<Record<string, number>>({});
  const [moves, setMoves] = useState<{ item: string; note: string; qty: string }[]>([
    { item: "Unsalted butter", note: "Supplier delivery", qty: "+10 kg" }, { item: "Fresh eggs", note: "Used in production", qty: "−4 trays" },
  ]);
  const [lowOnly, setLowOnly] = useState(false);
  const [recording, setRecording] = useState(false);
  const [item, setItem] = useState(ITEMS[1]![0]);
  const [dir, setDir] = useState<"in" | "out">("in");
  const [qty, setQty] = useState("5");
  const [note, setNote] = useState("Supplier delivery");
  const toast = useToast();

  const all = ITEMS.map(([name, group, base, unit, reorder]) => {
    const on = Math.max(0, round(base + (adj[name] ?? 0)));
    const s = on === 0 ? "out" : on < reorder ? "low" : "ok";
    return { name, group, on, unit, reorder, s } as const;
  });
  const shown = lowOnly ? all.filter((r) => r.s !== "ok") : all;
  const save = () => {
    const q = Number(qty) || 0;
    if (!q) return;
    const unit = ITEMS.find((i) => i[0] === item)?.[3] ?? "";
    setAdj({ ...adj, [item]: (adj[item] ?? 0) + (dir === "in" ? q : -q) });
    setMoves([{ item, note, qty: `${dir === "in" ? "+" : "−"}${q} ${unit}` }, ...moves]);
    setRecording(false); toast.show(`Recorded: ${item} ${dir === "in" ? "+" : "−"}${q} ${unit}`);
  };

  return (
    <>
      <PageHead title="Inventory" subtitle="Ingredients and decoration supplies">
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, minHeight: 44 }}>
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />Low and out of stock only
        </label>
        <button type="button" className="btn-pill dark" onClick={() => setRecording(true)}>Record stock movement</button>
      </PageHead>

      <div className="kpis">
        <div className="kpi"><span>Items tracked</span><strong>{all.length}</strong></div>
        <div className="kpi amber"><span>Below reorder level</span><strong>{all.filter((r) => r.s === "low").length}</strong></div>
        <div className="kpi red"><span>Out of stock</span><strong>{all.filter((r) => r.s === "out").length}</strong></div>
      </div>

      <div className="split">
        <section className="card flush grow" aria-label="Stock levels">
          <table style={{ minWidth: 560 }}>
            <thead><tr><th scope="col">Item</th><th scope="col" className="num">On hand</th><th scope="col">Level</th><th scope="col" className="num">Reorder at</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.name}>
                  <td><span style={{ fontWeight: 600 }}>{r.name}</span><span className="sub">{r.group}</span></td>
                  <td className="num">{r.on} {r.unit}</td>
                  <td><span className="stockbar" aria-hidden="true"><i style={{ width: `${Math.min(100, (r.on / (r.reorder * 2)) * 100)}%`, background: STATE[r.s].color }} /></span></td>
                  <td className="num" style={{ color: "var(--muted)" }}>{r.reorder} {r.unit}</td>
                  <td><Pill tone={STATE[r.s].tone}>{STATE[r.s].label}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card side stack" aria-label="Recent movements">
          <h2>Recent movements</h2>
          {moves.map((m, i) => (
            <div key={i} className="qrow"><div className="txt"><strong>{m.item}</strong><span>{m.note}</span></div><b>{m.qty}</b></div>
          ))}
        </section>
      </div>

      {recording ? (
        <Dialog title="Record stock movement" onClose={() => setRecording(false)}>
          <Field id="rm-i" label="Item"><select id="rm-i" value={item} onChange={(e) => setItem(e.target.value)}>{ITEMS.map((i) => <option key={i[0]}>{i[0]}</option>)}</select></Field>
          <div role="group" aria-label="Direction" className="segmented" style={{ alignSelf: "flex-start" }}>
            <button type="button" aria-pressed={dir === "in"} onClick={() => setDir("in")}>Stock in</button>
            <button type="button" aria-pressed={dir === "out"} onClick={() => setDir("out")}>Stock out</button>
          </div>
          <Field id="rm-q" label="Quantity"><input id="rm-q" type="number" min={0} value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
          <Field id="rm-n" label="Reason"><input id="rm-n" type="text" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn-pill" onClick={() => setRecording(false)}>Cancel</button>
            <button type="button" className="btn-pill dark" onClick={save}>Save movement</button>
          </div>
        </Dialog>
      ) : null}
      {toast.node}
    </>
  );
}
