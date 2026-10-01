import { lineKey } from "@cakeshop/domain";
import { peso } from "../format";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { Stepper } from "../components/Stepper";

export function Cart() {
  const { lines, units, subtotal, setQty, remove } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  if (lines.length === 0) {
    return (
      <main className="page-wrap narrow">
        <h1>Your cart</h1>
        <div className="empty"><p>Your cart is empty.</p><Link to="/shop" className="pill dark">Shop cakes</Link></div>
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
                <div className="cart-foot">
                  <strong>{peso(l.unitPriceCentavos * l.quantity)}</strong>
                  <Stepper value={l.quantity} onChange={(q) => setQty(key, q)} label={`Quantity for ${l.name}`} />
                </div>
              </div>
              <button className="icon-btn" aria-label={`Remove ${l.name}`} onClick={() => remove(key)}>🗑</button>
            </li>
          );
        })}
      </ul>

      <p className="note">Designing a custom cake? Custom cakes are reviewed and quoted by our bakers, then paid separately from your cart.</p>

      <form className="promo" onSubmit={(e) => { e.preventDefault(); setPromoMsg(promo.trim() ? "Promo codes aren’t available yet." : ""); }}>
        <label htmlFor="promo">Promo code</label>
        <div className="row tight"><input id="promo" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Enter code" /><button className="pill ghost" type="submit">Apply</button></div>
        <p role="status" className="muted small">{promoMsg}</p>
      </form>

      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{peso(subtotal)}</dd></div>
        <div><dt>Delivery</dt><dd className="muted">Calculated at checkout</dd></div>
        <div className="grand"><dt>Total</dt><dd>{peso(subtotal)}</dd></div>
      </dl>
      <Link to="/checkout" className="pill dark block">Checkout</Link>
    </main>
  );
}
