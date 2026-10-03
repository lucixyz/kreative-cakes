import { useState } from "react";
import { Dialog, Field, PageHead, Switch, useToast } from "../components/ui";

type Deco = { name: string; price: string; stock: string; low: boolean; zones: string; asset: string; tint: string; on: boolean };
const INITIAL: Deco[] = [
  { name: "Butterflies (wafer)", price: "₱60", stock: "40 in stock", low: false, zones: "side, top", asset: "butterfly.glb", tint: "#f6eedb", on: true },
  { name: "Sugar flowers", price: "₱60", stock: "120 in stock", low: false, zones: "top, cascade", asset: "flower.glb", tint: "#f3e3e6", on: true },
  { name: "Sugar pearls", price: "₱150 / tier", stock: "Low · 1.5 kg", low: true, zones: "border", asset: "pearl.glb", tint: "#eeeae4", on: true },
  { name: "Stars", price: "₱40", stock: "80 in stock", low: false, zones: "side, top", asset: "star.glb", tint: "#f6eedb", on: true },
  { name: "Fresh fruit", price: "₱250 / tier", stock: "Daily supply", low: false, zones: "top", asset: "fruit.glb", tint: "#e5ebdf", on: true },
  { name: "Chocolate shards", price: "₱180 / tier", stock: "Out of stock", low: true, zones: "top, side", asset: "shard.glb", tint: "#e6ded2", on: false },
];

export function Decorations() {
  const [items, setItems] = useState(INITIAL);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const toast = useToast();
  const close = () => { setAdding(false); setName(""); setPrice(""); };

  return (
    <>
      <PageHead title="Decorations" subtitle="Decoration catalog used by the builder, the AI and the 3D renderer">
        <button type="button" className="btn-pill dark" onClick={() => setAdding(true)}>+ Add decoration</button>
      </PageHead>
      <div className="deco-grid">
        {items.map((d, i) => (
          <article key={d.name} className="deco">
            <div className="art" style={{ background: d.tint }}>3D model · {d.asset}</div>
            <div className="body">
              <div className="line">
                <h2 style={{ fontSize: 17, margin: 0 }}>{d.name}</h2>
                <Switch checked={d.on} label={`${d.name} active`} onChange={() => setItems(items.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} />
              </div>
              <div className="line"><span style={{ fontWeight: 600 }}>{d.price} each</span><span style={{ fontSize: 13, color: d.low ? "var(--red-fg)" : "var(--green-fg)" }}>{d.stock}</span></div>
              <span className="meta">Placement: {d.zones}</span>
            </div>
          </article>
        ))}
      </div>

      {adding ? (
        <Dialog title="Add decoration" onClose={close}>
          <Field id="ad-n" label="Name"><input id="ad-n" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gold leaf" /></Field>
          <Field id="ad-p" label="Price each (₱)"><input id="ad-p" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
          <div className="note">3D model (.glb) · upload after saving</div>
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn-pill" onClick={close}>Cancel</button>
            <button type="button" className="btn-pill dark" onClick={() => {
              const n = name.trim();
              if (!n) return;
              setItems([...items, { name: n, price: `₱${Number(price) || 0}`, stock: "Not tracked yet", low: false, zones: "side, top", asset: "upload pending", tint: "#eeeae4", on: false }]);
              close(); toast.show(`${n} added as inactive. Upload its 3D model, then switch it on.`);
            }}>Add decoration</button>
          </div>
        </Dialog>
      ) : null}
      {toast.node}
    </>
  );
}
