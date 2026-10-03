import { MAX_MESSAGE_LENGTH, lineKey } from "@cakeshop/domain";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { TrashIcon } from "../components/Icons";
import { EmptyState } from "../components/States";
import { Stepper } from "../components/Stepper";
import { peso } from "../format";

function MessageEditor({ initial, name, onSave }: { initial: string; name: string; onSave: (m: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  if (!editing) {
    return (
      <p className="small">
        {initial ? <>Message: “{initial}” </> : <span className="muted">No message on the cake. </span>}
        <button type="button" className="link-btn" onClick={() => { setDraft(initial); setEditing(true); }} aria-label={`${initial ? "Edit" : "Add"} message for ${name}`}>{initial ? "Edit" : "Add a message"}</button>
      </p>
    );
  }
  return (
    <form className="row tight" onSubmit={(e) => { e.preventDefault(); onSave(draft); setEditing(false); }}>
      <label className="sr" htmlFor={`msg-${name}`}>Message on {name}</label>
      <input id={`msg-${name}`} type="text" maxLength={MAX_MESSAGE_LENGTH} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message on the cake" autoFocus />
      <button type="submit" className="pill dark small">Save</button>
      <button type="button" className="pill ghost small" onClick={() => setEditing(false)}>Cancel</button>
    </form>
  );
}

export function Cart() {
  const { lines, units, subtotal, setQty, setNote, remove } = useCart();

  if (lines.length === 0) {
    return (
      <main className="page-wrap narrow">
        <h1>Your cart</h1>
        <EmptyState title="Your cart is empty" text="Add a ready-made cake, or design your own."><Link to="/shop" className="pill dark">Browse cakes</Link><Link to="/ai-designer" className="pill outline-dark">Design a cake</Link></EmptyState>
      </main>
    );
  }

  return (
    <main className="page-wrap narrow">
      <div className="shop-head"><h1>Your cart</h1><span className="muted">{units} {units === 1 ? "item" : "items"}</span></div>

      <ul className="cart-lines">
        {lines.map((l) => {
          const key = lineKey(l);
          return (
            <li key={key} className="cart-line">
              <div className="cart-thumb" style={{ background: l.tone }} aria-hidden="true" />
              <div className="cart-info">
                <strong>{l.name}</strong>
                <span className="muted">{l.sizeLabel} · {l.flavor}</span>
                <MessageEditor initial={l.message ?? ""} name={l.name} onSave={(m) => setNote(key, m)} />
                <div className="cart-foot">
                  <strong>{peso(l.unitPriceCentavos * l.quantity)}</strong>
                  <Stepper value={l.quantity} onChange={(q) => setQty(key, q)} label={`Quantity for ${l.name}`} />
                </div>
              </div>
              <button className="icon-btn" aria-label={`Remove ${l.name}`} onClick={() => remove(key)}><TrashIcon /></button>
            </li>
          );
        })}
      </ul>

      <p className="note">Designing a custom cake? Custom cakes are reviewed and quoted by our bakers, then paid separately from your cart.</p>

      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{peso(subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd className="muted">Shown at checkout. Pickup is free.</dd></div>
        <div className="grand"><dt>Total so far</dt><dd>{peso(subtotal)}</dd></div>
      </dl>
      <Link to="/checkout" className="pill dark block">Checkout</Link>
      <p className="center"><Link to="/shop" className="text-link small">Continue shopping</Link></p>
    </main>
  );
}
