import { useRef, useState } from "react";
import { Field, PageHead, Switch, peso, useToast } from "../components/ui";

type Product = { name: string; cat: string; price: number; stock: number; on: boolean; tint: string };
const INITIAL: Product[] = [
  { name: "Strawberry Chiffon Dream", cat: "Birthday", price: 950, stock: 6, on: true, tint: "#efe3e3" },
  { name: "Dark Chocolate Ganache", cat: "Chocolate", price: 1480, stock: 4, on: true, tint: "#e6ded2" },
  { name: "Ube Macapuno Layer Cake", cat: "Filipino favorites", price: 1350, stock: 0, on: true, tint: "#e7e1ec" },
  { name: "Mango Cream Torte", cat: "Filipino favorites", price: 1180, stock: 3, on: true, tint: "#f1e6d0" },
  { name: "Red Velvet Classic", cat: "Anniversary", price: 1320, stock: 0, on: false, tint: "#efe3e3" },
  { name: "Matcha Bento Cake", cat: "Bento cakes", price: 480, stock: 12, on: true, tint: "#e4e6dc" },
  { name: "Lemon Blueberry Cupcakes (6)", cat: "Cupcakes", price: 420, stock: 8, on: true, tint: "#e6e8ee" },
];
const CATS = ["Birthday", "Chocolate", "Filipino favorites", "Anniversary", "Bento cakes", "Cupcakes"];

export function Products() {
  const [items, setItems] = useState(INITIAL);
  const saved = useRef(INITIAL);
  const [sel, setSel] = useState(0);
  const toast = useToast();
  const cur = items[sel]!;
  const update = (patch: Partial<Product>) => setItems(items.map((x, j) => (j === sel ? { ...x, ...patch } : x)));

  return (
    <>
      <PageHead title="Products" subtitle="Ready-made cakes and pastries shown in the shop">
        <button type="button" className="btn-pill dark" onClick={() => {
          const next = [...items, { name: "New product", cat: "Birthday", price: 0, stock: 0, on: false, tint: "#eeeae4" }];
          setItems(next); setSel(next.length - 1); toast.show("Draft product added. Fill in the details and save.");
        }}>+ Add product</button>
      </PageHead>

      <div className="split">
        <section className="card flush grow" aria-label="Product list">
          <table style={{ minWidth: 520 }}>
            <thead><tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col" className="num">From</th><th scope="col">Today</th><th scope="col">In shop</th></tr></thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={i} className={i === sel ? "sel" : ""}>
                  <td>
                    <button type="button" className="row-btn" aria-label={`Edit ${p.name}`} onClick={() => setSel(i)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 36, height: 36, borderRadius: 10, background: p.tint, flex: "none" }} />{p.name}
                    </button>
                  </td>
                  <td>{p.cat}</td><td className="num">{peso(p.price)}</td>
                  <td style={{ color: p.stock > 0 ? "var(--green-fg)" : "var(--muted)" }}>{p.stock > 0 ? `${p.stock} left` : "Pre-order only"}</td>
                  <td><Switch checked={p.on} label={`Show ${p.name} in shop`} onChange={() => setItems(items.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card side stack" aria-label="Edit product">
          <h2>Edit product</h2>
          <div className="preview-art" style={{ height: 120, background: cur.tint }}>Product photos · drag to add</div>
          <Field id="pn" label="Name"><input id="pn" type="text" value={cur.name} onChange={(e) => update({ name: e.target.value })} /></Field>
          <div className="adm-grid2">
            <Field id="pc" label="Category">
              <select id="pc" value={cur.cat} onChange={(e) => update({ cat: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field id="pp" label="Base price (₱)"><input id="pp" type="number" min={0} value={cur.price} onChange={(e) => update({ price: Number(e.target.value) })} /></Field>
          </div>
          <fieldset className="fld" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend>Sizes offered</legend>
            <div className="checks"><label><input type="checkbox" defaultChecked />6″</label><label><input type="checkbox" defaultChecked />8″</label><label><input type="checkbox" />10″</label></div>
          </fieldset>
          <Field id="pa" label="Allergens"><input id="pa" type="text" defaultValue="Eggs, milk, wheat" /></Field>
          <Field id="pl" label="Lead time">
            <select id="pl"><option>Available same day</option><option>1 day pre-order</option><option>2 days pre-order</option></select>
          </Field>
          <div className="actions">
            <button type="button" className="btn-pill dark" onClick={() => { saved.current = items; toast.show("Saved. Changes are live in the shop."); }}>Save changes</button>
            <button type="button" className="btn-pill" onClick={() => { setItems(saved.current); setSel(Math.min(sel, saved.current.length - 1)); toast.show("Unsaved changes discarded"); }}>Discard</button>
          </div>
        </section>
      </div>
      {toast.node}
    </>
  );
}
