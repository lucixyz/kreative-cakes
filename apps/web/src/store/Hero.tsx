import { Link } from "react-router-dom";
import { CakeArt } from "./CakeArt";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="chip">✨ Handcrafted cakes + AI cake design</span>
        <h1>Your Dream Cake, Designed by You.</h1>
        <p>Shop handcrafted cakes or bring your idea to life with our AI-powered 3D Cake Designer.</p>
        <div className="row">
          <Link to="/ai-designer" className="pill solid">Design Your Cake</Link>
          <Link to="/shop" className="pill outline">Shop Cakes</Link>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <CakeArt tiers={2} color="#f4a6c0" topper="candles" sprinkles />
      </div>
      <ul className="hero-tags">
        <li>[ Delicious Perfection ]</li>
        <li>[ Crafted with Love ]</li>
        <li>[ Elegantly Decorated ]</li>
      </ul>
    </section>
  );
}
