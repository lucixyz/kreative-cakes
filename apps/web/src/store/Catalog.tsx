import { mockProducts } from "@cakeshop/database";
import { formatMoney } from "@cakeshop/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CakeArt } from "./CakeArt";
import { FLAVORS, OCCASIONS, PRODUCT_DISPLAY } from "./data";

export function SectionHead({ title, sub, to, cta }: { title: string; sub?: string; to?: string; cta?: string }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {sub ? <p className="muted">{sub}</p> : null}
      </div>
      {to && cta ? <Link to={to} className="pill ghost">{cta}</Link> : null}
    </div>
  );
}

export function Occasions() {
  return (
    <section className="section">
      <SectionHead title="Shop by Occasion" sub="Cakes for every celebration." />
      <div className="occasions">
        {OCCASIONS.map((o) => (
          <Link key={o.name} to="/shop" className="occasion" style={{ background: o.tone }}>
            <CakeArt {...o.cake} label={`${o.name} cake`} />
            <span>{o.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BestSellers() {
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<string | null>(null);
  const toggle = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      if (!n.delete(id)) n.add(id);
      return n;
    });

  return (
    <section className="section">
      <SectionHead title="Best Sellers" sub="Our most-loved cakes." to="/shop" cta="View All Cakes" />
      <div className="products">
        {mockProducts.map((p) => {
          const d = PRODUCT_DISPLAY[p.id];
          if (!d) return null;
          return (
            <article key={p.id} className="product">
              <div className="product-art">
                <button className={`fav${favs.has(p.id) ? " on" : ""}`} aria-pressed={favs.has(p.id)} aria-label={`Favorite ${p.name}`} onClick={() => toggle(p.id)}>
                  {favs.has(p.id) ? "♥" : "♡"}
                </button>
                {d.customizable ? <span className="badge">Customizable</span> : null}
                <CakeArt {...d.cake} label={p.name} />
              </div>
              <h3>{p.name}</h3>
              <p className="rating">★ {d.rating} <span className="muted">({d.reviews})</span></p>
              <div className="product-foot">
                <strong>From {formatMoney(p.startingPriceCentavos)}</strong>
                <button className="pill small" onClick={() => setAdded(p.id)}>{added === p.id ? "Added ✓" : "Quick add"}</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Flavors() {
  return (
    <section className="section">
      <SectionHead title="Shop by Flavor" sub="Start with the taste you love." />
      <div className="flavors">
        {FLAVORS.map((f) => (
          <Link key={f.name} to="/shop" className="flavor">
            <span className="swatch" style={{ background: f.color }} />
            {f.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
