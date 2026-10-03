import { useState } from "react";
import { Field, PageHead, Switch, useToast } from "../components/ui";

type Row = { name: string; count: number; home: boolean; on: boolean };
const INITIAL: Row[] = [
  { name: "Birthday", count: 14, home: true, on: true }, { name: "Wedding", count: 6, home: true, on: true },
  { name: "Anniversary", count: 5, home: true, on: true }, { name: "Filipino favorites", count: 8, home: false, on: true },
  { name: "Bento cakes", count: 9, home: true, on: true }, { name: "Cupcakes & pastries", count: 12, home: true, on: true },
  { name: "Holiday specials", count: 0, home: false, on: false },
];

export function Categories() {
  const [rows, setRows] = useState(INITIAL);
  const [draft, setDraft] = useState("");
  const toast = useToast();
  const add = () => {
    const n = draft.trim();
    if (!n) return;
    setRows([...rows, { name: n, count: 0, home: false, on: true }]);
    setDraft(""); toast.show(`${n} added`);
  };
  return (
    <>
      <PageHead title="Categories" subtitle="How products are grouped in the shop" />
      <div className="split">
        <section className="card flush grow" aria-label="Categories">
          <table style={{ minWidth: 480 }}>
            <thead><tr><th scope="col">Category</th><th scope="col" className="num">Products</th><th scope="col">Shown on home</th><th scope="col">Visible</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td><td className="num">{r.count}</td>
                  <td><Switch checked={r.home} label={`${r.name} shown on home`} onChange={() => setRows(rows.map((x, j) => (j === i ? { ...x, home: !x.home } : x)))} /></td>
                  <td><Switch checked={r.on} label={`${r.name} visible`} onChange={() => setRows(rows.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <form className="card side stack" onSubmit={(e) => { e.preventDefault(); add(); }}>
          <h2>Add category</h2>
          <Field id="cn" label="Name"><input id="cn" type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Christmas cakes" /></Field>
          <button type="submit" className="btn-pill dark" style={{ alignSelf: "flex-start" }}>Add category</button>
        </form>
      </div>
      {toast.node}
    </>
  );
}
