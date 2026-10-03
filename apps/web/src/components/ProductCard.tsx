import { productListPrice, type Availability, type StorefrontProduct } from "@cakeshop/database";
import { Link } from "react-router-dom";
import { useFavorites } from "../cart/FavoritesContext";
import { peso } from "../format";
import { CakeArt } from "../store/CakeArt";
import { Photo, productPhoto } from "../store/Photo";
import { HeartIcon } from "./Icons";

export function availabilityLabel(a: Availability): string {
  if (a.kind === "today") return "Here today";
  if (a.kind === "soldout") return "Sold out today";
  return `Order ${a.days} ${a.days === 1 ? "day" : "days"} ahead`;
}

/** Tape on the price card: green here today, amber pre-order with the days written out, grey sold out. */
export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return <span className={`avail ${availability.kind}`}>{availabilityLabel(availability)}</span>;
}

export function ProductArt({ product, className = "" }: { product: StorefrontProduct; className?: string }) {
  return (
    <div className={`product-art ${className}`} style={{ background: product.look.tone }}>
      <Photo src={productPhoto(product.slug)} alt={product.name} fallback={<CakeArt tiers={product.look.tiers} color={product.look.color} drip={product.type === "whole"} label={product.name} />} />
    </div>
  );
}

/** A cake on the shelf with its clipped price card hanging below it. */
export function ProductCard({ product }: { product: StorefrontProduct }) {
  const favorites = useFavorites();
  const fav = favorites.has(product.id);
  return (
    <article className={`product-card${product.availability.kind === "soldout" ? " is-sold" : ""}`}>
      <div className="tray">
        <Link to={`/shop/${product.slug}`} aria-label={product.name}><ProductArt product={product} /></Link>
        <button className={`fav${fav ? " on" : ""}`} aria-pressed={fav} aria-label={`Favorite ${product.name}`} onClick={() => favorites.toggle(product.id)}><HeartIcon filled={fav} /></button>
      </div>
      <div className="price-card">
        <p className="eyebrow">{product.label}</p>
        <h3><Link to={`/shop/${product.slug}`}>{product.name}</Link></h3>
        <p className="price-line"><span>From</span> <strong>{peso(productListPrice(product))}</strong></p>
        <AvailabilityBadge availability={product.availability} />
      </div>
    </article>
  );
}
