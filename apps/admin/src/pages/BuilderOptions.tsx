import { useState } from "react";
import { Dialog, Field, PageHead, Segmented, Switch, peso, useToast } from "../components/ui";

type Opt = { name: string; price: number; note: string; on: boolean };
type Tab = "tiers" | "flavors" | "fillings" | "frostings" | "toppers";
const o = (name: string, price: number, note = ""): Opt => ({ name, price, note, on: true });
const INITIAL: Record<Tab, Opt[]> = {
  tiers: [o("Tier 12″", 1800, "Bottom tier"), o("Tier 9″", 1400), o("Tier 6″", 1000), o("Tier 4″", 800, "Top tier only")],
  flavors: [o("Vanilla chiffon", 0, "Default"), o("Dark chocolate", 150, "Per tier"), o("Ube", 150, "Per tier"), o("Red velvet", 200, "Per tier"), o("Pistachio", 350, "Seasonal")],
  fillings: [o("Strawberry cream", 0), o("Chocolate ganache", 120), o("Macapuno", 120), o("Salted caramel", 150)],
  frostings: [o("Buttercream", 0, "Default"), o("Fondant", 600, "3+ day notice"), o("Chocolate ganache", 400)],
  toppers: [o("Text topper", 250, "Up to 20 characters"), o("Number candles", 80), o("Gold sparkler set", 180)],
};
const TABS: { id: Tab; label: string }[] = [
  { id: "tiers", label: "Tiers & sizes" }, { id: "flavors", label: "Flavors" }, { id: "fillings", label: "Fillings" },
  { id: "frostings", label: "Frostings" }, { id: "toppers", label: "Toppers" },
];

export function BuilderOptions() {
  const [data, setData] = useState(INITIAL);
  const [tab, setTab] = useState<Tab>("tiers");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const toast = useToast();
  const rows = data[tab];
  const patch = (i: number, p: Partial<Opt>) => setData({ ...data, [tab]: rows.map((r, j) => (j === i ? { ...r, ...p } : r)) });
  const close = () => { setAdding(false); setName(""); setPrice(""); };

  return (
    <>
      <PageHead title="Cake builder options" subtitle="Everything customers can pick in the Cake Builder and AI Designer. The AI can only choose from active items.">
        <button type="button" className="btn-pill dark" onClick={() => setAdding(true)}>+ Add option</button>
      </PageHead>
      <Segmented label="Option type" value={tab} onChange={setTab} options={TABS} />
      <section className="card flush" aria-label="Options">
        <table style={{ minWidth: 560 }}>
          <thead><tr><th scope="col">Option</th><th scope="col">Price</th><th scope="col">Notes</th><th scope="col">Active</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>
                  <div className="fld" style={{ width: 130 }}>
                    <label htmlFor={`${tab}-${i}`} className="sr">Price for {r.name}</label>
                    <div className="pre"><span>₱</span><input id={`${tab}-${i}`} type="number" min={0} value={r.price} onChange={(e) => patch(i, { price: Number(e.target.value) })} /></div>
                  </div>
                </td>
                <td style={{ color: "var(--muted)" }}>{r.note || "—"}</td>
                <td><Switch checked={r.on} label={`${r.name} active`} onChange={() => patch(i, { on: !r.on })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="crumb">Prices are in pesos and feed the customer’s live estimate ({peso(rows[0]?.price ?? 0)} for the first row). Final prices come from each quotation.</p>

      {adding ? (
        <Dialog title="Add option" onClose={close}>
          <p className="crumb" style={{ margin: 0 }}>Adds to the “{TABS.find((t) => t.id === tab)?.label}” tab.</p>
          <Field id="ao-n" label="Name"><input id="ao-n" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coffee mocha" /></Field>
          <Field id="ao-p" label="Price (₱)"><input id="ao-p" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn-pill" onClick={close}>Cancel</button>
            <button type="button" className="btn-pill dark" onClick={() => {
              const n = name.trim();
              if (!n) return;
              setData({ ...data, [tab]: [...rows, { name: n, price: Number(price) || 0, note: "New", on: true }] });
              close(); toast.show(`${n} added. Customers and the AI can now pick it.`);
            }}>Add option</button>
          </div>
        </Dialog>
      ) : null}
      {toast.node}
    </>
  );
}
