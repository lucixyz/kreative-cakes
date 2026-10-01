import { productListPrice, type Availability, type StorefrontProduct } from "@cakeshop/database";
import { peso } from "../format";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CakeArt } from "../store/CakeArt";

export function availabilityLabel(a: Availability): string {
  if (a.kind === "today") return "Available today";
  if (a.kind === "soldout") return "Sold out today";
  return `Pre-order · ${a.days} ${a.days === 1 ? "day" : "days"}`;
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return <span className={`avail ${availability.kind}`}>{availabilityLabel(availability)}</span>;
}

export function ProductArt({ product, className = "" }: { product: StorefrontProduct; className?: string }) {
  return (
    <div className={`product-art ${className}`} style={{ background: product.look.tone }}>
      <CakeArt tiers={product.look.tiers} color={product.look.color} drip={product.type === "whole"} label={product.name} />
    </div>
  );
}

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const [fav, setFav] = useState(false);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/shop/${product.slug}`} aria-label={product.name}><ProductArt product={product} /></Link>
        <button className={`fav${fav ? " on" : ""}`} aria-pressed={fav} aria-label={`Favorite ${product.name}`} onClick={() => setFav(!fav)}>{fav ? "♥" : "♡"}</button>
      </div>
      <div className="product-body">
        <p className="eyebrow">{product.label}</p>
        <h3><Link to={`/shop/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-foot">
          <strong>From {peso(productListPrice(product))}</strong>
          <AvailabilityBadge availability={product.availability} />
        </div>
      </div>
    </article>
  );
}
