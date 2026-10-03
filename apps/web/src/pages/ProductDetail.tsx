import { defaultProductSize, findStorefrontProduct } from "@cakeshop/database";
import { MAX_MESSAGE_LENGTH } from "@cakeshop/domain";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { Dialog } from "../components/Dialog";
import { InfoIcon, SparkIcon, StoreIcon } from "../components/Icons";
import { AvailabilityBadge, ProductArt } from "../components/ProductCard";
import { Stepper } from "../components/Stepper";
import { peso } from "../format";

const dateLabel = (d: Date) => new Intl.DateTimeFormat("en-PH", { weekday: "short", month: "short", day: "numeric" }).format(d);

export function ProductDetail() {
  const { slug = "" } = useParams();
  const product = findStorefrontProduct(slug);
  const { add } = useCart();
  const navigate = useNavigate();
  const [sizeId, setSizeId] = useState(product ? defaultProductSize(product).id : "");
  const [flavor, setFlavor] = useState(product?.flavors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [zoom, setZoom] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="page-wrap"><h1>Cake not found</h1><p className="muted">That cake isn’t on the menu.</p><Link to="/shop" className="pill dark">Back to shop</Link></main>
    );
  }

  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]!;
  const soldOut = product.availability.kind === "soldout";
  const total = size.priceCentavos * qty;
  const earliest = (() => {
    if (product.availability.kind !== "preorder") return null;
    const d = new Date();
    d.setDate(d.getDate() + product.availability.days);
    return d;
  })();
  const line = () => ({ productId: product.id, sizeId: size.id, flavor, name: product.name, sizeLabel: size.label, tone: product.look.tone, unitPriceCentavos: size.priceCentavos, quantity: qty, message: message.trim() || undefined });
  const addToCart = () => { add(line()); setAdded(true); };

  return (
    <main className="page-wrap pdp">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</p>
      <div className="detail">
        <div className="gallery">
          <ProductArt product={product} className="big" />
          <button type="button" className="pill outline-dark small align-start" onClick={() => setZoom(true)}>Enlarge photo</button>
        </div>

        <div className="stack">
          <div className="row tight"><span className="eyebrow">{product.label} · {product.style}</span><AvailabilityBadge availability={product.availability} /></div>
          <h1>{product.name}</h1>
          <p className="price">{peso(size.priceCentavos)}</p>
          <p className="muted">{product.description}</p>

          <fieldset className="opt-group">
            <legend>Size</legend>
            <div className="row tight">
              {product.sizes.map((s) => (
                <button key={s.id} type="button" className={`size-opt${s.id === size.id ? " on" : ""}`} aria-pressed={s.id === size.id} onClick={() => setSizeId(s.id)}>
                  <strong>{s.label}</strong><span>{s.serves}</span><span>{peso(s.priceCentavos)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {product.flavors.length > 1 ? (
            <fieldset className="opt-group">
              <legend>Flavor</legend>
              <div className="row tight">
                {product.flavors.map((f) => <button key={f} type="button" className={`flavor-opt${f === flavor ? " on" : ""}`} aria-pressed={f === flavor} onClick={() => setFlavor(f)}>{f}</button>)}
              </div>
            </fieldset>
          ) : (
            <p className="muted small">Flavor: {product.flavors[0]}</p>
          )}

          <div className="field message-field">
            <label htmlFor="cake-message">Message on the cake (optional)</label>
            <input id="cake-message" type="text" maxLength={MAX_MESSAGE_LENGTH} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Happy Birthday, Bea" aria-describedby="message-count" />
            <span id="message-count" className="muted small" aria-live="polite">{message.length} / {MAX_MESSAGE_LENGTH} characters</span>
          </div>

          <div className="slip" aria-label="Price breakdown">
            <div><span>{size.label} · {flavor} × {qty}</span><span>{peso(total)}</span></div>
            <div><span>Message on the cake</span><span>No charge</span></div>
            <div className="grand"><span>Subtotal</span><span>{peso(total)}</span></div>
            <p className="muted small">Delivery fees, if any, are shown at checkout.</p>
          </div>

          <p className="when small">
            {soldOut ? "Sold out today. Check back tomorrow, or design a custom cake." : earliest ? `Pre-order: ready as early as ${dateLabel(earliest)} for pickup or delivery.` : "Available today. Choose your pickup or delivery date and time at checkout."}
          </p>

          <div className="buy-row">
            <Stepper value={qty} onChange={setQty} label="Quantity" />
            <button className="pill dark grow" disabled={soldOut} onClick={addToCart}>{soldOut ? "Sold out today" : "Add to cart"}</button>
            <button className="pill ghost" disabled={soldOut} onClick={() => { add(line()); navigate("/checkout"); }}>Buy now</button>
          </div>
          <p role="status" className="muted small">{added ? <>Added to your cart. <Link to="/cart" className="underline">View cart</Link></> : null}</p>

          <dl className="info-rows">
            <div><StoreIcon /><div><dt>Pickup or delivery</dt><dd>Pick up at [store location], or choose delivery at checkout. The delivery fee depends on your area.</dd></div></div>
            <div><InfoIcon /><div><dt>Allergens</dt><dd>{product.allergens}</dd></div></div>
            <div><SparkIcon /><div><dt>Want it personalized?</dt><dd>Start from this cake in the <Link to="/cake-builder" className="underline">Cake Builder</Link> to change tiers, colors and toppers. Our bakers review custom designs before you pay.</dd></div></div>
          </dl>
        </div>
      </div>

      <div className="buy-bar" role="region" aria-label="Quick purchase">
        <div><strong>{peso(total)}</strong><span className="muted small"> {size.label} × {qty}</span></div>
        <button className="pill dark" disabled={soldOut} onClick={addToCart}>{soldOut ? "Sold out" : "Add to cart"}</button>
      </div>

      {zoom ? (
        <Dialog title={product.name} onClose={() => setZoom(false)}>
          <div className="zoom"><ProductArt product={product} className="big" /></div>
          <div className="row end"><button type="button" className="pill dark" onClick={() => setZoom(false)}>Close</button></div>
        </Dialog>
      ) : null}
    </main>
  );
}
