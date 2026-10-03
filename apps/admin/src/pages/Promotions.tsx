import { useState } from "react";
import { Field, PageHead, Switch, useToast } from "../components/ui";

type Promo = { name: string; disc: string; scope: string; used: number; ends: string; on: boolean };
const INITIAL: Promo[] = [
  { name: "SWEET10", disc: "10%", scope: "Ready-made cakes", used: 48, ends: "Oct 31", on: true },
  { name: "DEBUT500", disc: "₱500", scope: "Custom cakes over ₱5,000", used: 7, ends: "Dec 31", on: true },
  { name: "BENTO2", disc: "Buy 2, ₱100 off", scope: "Bento cakes", used: 22, ends: "Oct 15", on: true },
  { name: "SUMMER15", disc: "15%", scope: "Everything", used: 131, ends: "Ended Aug 31", on: false },
];
const SCOPES = ["Ready-made cakes", "Custom cakes", "Everything"];

export function Promotions() {
  const [rows, setRows] = useState(INITIAL);
  const [code, setCode] = useState("");
  const [pct, setPct] = useState(10);
  const [scope, setScope] = useState(SCOPES[0]!);
  const toast = useToast();
  const add = () => {
    const c = code.trim();
    if (!c) return;
    setRows([{ name: c, disc: `${pct || 0}%`, scope, used: 0, ends: "No end date", on: true }, ...rows]);
    setCode(""); toast.show(`${c} created`);
  };
  return (
    <>
      <PageHead title="Promotions" subtitle="Discount codes customers can use at checkout" />
      <div className="split">
        <section className="card flush grow" aria-label="Promo codes">
          <table style={{ minWidth: 640 }}>
            <thead><tr><th scope="col">Code</th><th scope="col">Discount</th><th scope="col">Applies to</th><th scope="col" className="num">Used</th><th scope="col">Ends</th><th scope="col">Active</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{r.name}</td><td>{r.disc}</td><td style={{ color: "#4a3f38" }}>{r.scope}</td>
                  <td className="num">{r.used}</td><td>{r.ends}</td>
                  <td><Switch checked={r.on} label={`${r.name} active`} onChange={() => setRows(rows.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <form className="card side stack" onSubmit={(e) => { e.preventDefault(); add(); }}>
          <h2>New promo code</h2>
          <Field id="pc" label="Code"><input id="pc" type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. DEBUT15" /></Field>
          <Field id="pd" label="Discount (%)"><input id="pd" type="number" min={1} max={100} value={pct} onChange={(e) => setPct(Number(e.target.value))} /></Field>
          <Field id="ps" label="Applies to"><select id="ps" value={scope} onChange={(e) => setScope(e.target.value)}>{SCOPES.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <button type="submit" className="btn-pill dark" style={{ alignSelf: "flex-start" }}>Create code</button>
        </form>
      </div>
      {toast.node}
    </>
  );
}
