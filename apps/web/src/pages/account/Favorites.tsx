import { storefrontProducts } from "@cakeshop/database";
import { Link } from "react-router-dom";
import { useFavorites } from "../../cart/FavoritesContext";
import { ProductCard } from "../../components/ProductCard";
import { EmptyState } from "../../components/States";

export function Favorites() {
  const { ids } = useFavorites();
  const products = storefrontProducts.filter((p) => ids.includes(p.id));
  return (
    <>
      <div className="shop-head">
        <div><h1>Favorites</h1><p className="muted">{products.length === 0 ? "Nothing saved yet" : `${products.length} saved ${products.length === 1 ? "cake" : "cakes"}`}</p></div>
        <Link to="/shop" className="pill outline-dark">Keep shopping</Link>
      </div>
      {products.length === 0 ? (
        <EmptyState title="No favorites yet" text="Tap the heart on any cake to save it here for later.">
          <Link to="/shop" className="pill dark">Browse cakes</Link>
        </EmptyState>
      ) : (
        <div className="grid-3">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </>
  );
}
