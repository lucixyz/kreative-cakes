import { defaultProductSize, findStorefrontProduct } from "@cakeshop/database";
import { peso } from "../format";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { AvailabilityBadge, ProductArt } from "../components/ProductCard";
import { InfoIcon, SparkIcon, StoreIcon } from "../components/Icons";
import { Stepper } from "../components/Stepper";

const VIEWS = ["Front", "Top", "Slice", "Detail"] as const;

export function ProductDetail() {
  const { slug = "" } = useParams();
  const product = findStorefrontProduct(slug);
  const { add } = useCart();
  const navigate = useNavigate();
  const [sizeId, setSizeId] = useState(product ? defaultProductSize(product).id : "");
  const [flavor, setFlavor] = useState(product?.flavors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<(typeof VIEWS)[number]>("Front");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="page-wrap"><h1>Cake not found</h1><p className="muted">That cake isn’t on the menu.</p><Link to="/shop" className="pill dark">Back to shop</Link></main>
    );
  }

  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]!;
  const soldOut = product.availability.kind === "soldout";
  const line = () => ({ productId: product.id, sizeId: size.id, flavor, name: product.name, sizeLabel: size.label, tone: product.look.tone, unitPriceCentavos: size.priceCentavos, quantity: qty });

  return (
    <main className="page-wrap">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</p>
      <div className="detail">
        <div className="gallery">
          <ProductArt product={product} className="big" />
          <p className="muted small center">Product photo: {view.toLowerCase()} view</p>
          <div className="thumbs">
            {VIEWS.map((v, i) => (
              <button key={v} className={`thumb${v === view ? " on" : ""}`} style={{ background: i % 2 ? "#ece4d8" : product.look.tone }} aria-pressed={v === view} onClick={() => setView(v)}>{v}</button>
            ))}
          </div>
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
                  <strong>{s.label}</strong><span>{s.serves}</span>
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
          ) : null}

          <div className="buy-row">
            <Stepper value={qty} onChange={setQty} label="Quantity" />
            <button className="pill dark grow" disabled={soldOut} onClick={() => { add(line()); setAdded(true); }}>
              {soldOut ? "Sold out today" : `Add to cart · ${peso(size.priceCentavos * qty)}`}
            </button>
            <button className="pill ghost" disabled={soldOut} onClick={() => { add(line()); navigate("/checkout"); }}>Buy now</button>
          </div>
          <p role="status" className="muted small">{added ? <>Added to your cart. <Link to="/cart" className="underline">View cart</Link></> : null}</p>

          <dl className="info-rows">
            <div><StoreIcon /><div><dt>Pickup or delivery</dt><dd>Pick up today at [store location], or choose delivery at checkout. Delivery fee depends on your area.</dd></div></div>
            <div><InfoIcon /><div><dt>Allergens</dt><dd>{product.allergens}</dd></div></div>
            <div><SparkIcon /><div><dt>Want it personalized?</dt><dd>Start from this cake in the <Link to="/cake-builder" className="underline">Cake Builder</Link> to change tiers, colors and toppers.</dd></div></div>
          </dl>
        </div>
      </div>
    </main>
  );
}
