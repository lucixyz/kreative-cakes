import { storefrontProducts } from "@cakeshop/database";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { CakeArt } from "../store/CakeArt";

const STEPS = [
  ["01", "Describe your idea", "Type the occasion and theme, or upload an invitation for inspiration."],
  ["02", "Generate your cake", "Get a suggested design with tiers, colors and decorations."],
  ["03", "Customize in 3D", "Change flavors, colors and toppers and see every update live."],
  ["04", "Bakery reviews it", "Our bakers check the design and send your final quotation."],
  ["05", "Order and celebrate", "Pay the deposit, track production, and pick up or get it delivered."],
] as const;

const OCCASIONS = [
  { name: "Birthdays", to: "/shop?occasion=birthday", tone: "#efe3e1" },
  { name: "Weddings", to: "/shop?occasion=wedding", tone: "#ece4d8" },
  { name: "Anniversaries", to: "/shop?occasion=anniversary", tone: "#e6e0ec" },
  { name: "Corporate events", to: "/shop?occasion=corporate", tone: "#e3e5db" },
  { name: "Cupcakes & pastries", to: "/shop?type=cupcakes", tone: "#eadfd6" },
  { name: "Bento cakes", to: "/shop?type=bento", tone: "#e6ddd0" },
] as const;

// PROTOTYPE home. Cake images are drawn placeholders until real photos exist.
export function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="chip">✦ Custom cakes, designed with AI and made by hand</span>
          <h1>Your Dream Cake, Designed With AI.</h1>
          <p>Describe your celebration or upload an invitation. See your cake in 3D, adjust every detail, and our bakers review it before you pay.</p>
          <div className="row">
            <Link to="/ai-designer" className="pill solid">Design Your Cake</Link>
            <Link to="/shop" className="pill outline">Shop Cakes</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true"><CakeArt tiers={3} color="#f4b6c6" topper="butterfly" /></div>
        <ul className="hero-tags">
          <li>[ Designed With AI ]</li><li>[ Reviewed by Our Bakers ]</li><li>[ Made to Order ]</li>
        </ul>
      </section>

      <section className="section">
        <div className="section-head">
          <div><h2>Featured cakes</h2><p className="muted">Baked fresh, ready to order today.</p></div>
          <Link to="/shop" className="text-link">View all cakes →</Link>
        </div>
        <div className="grid-4">
          {storefrontProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="band">
        <div className="section no-top">
          <div className="center"><h2>How it works</h2><p className="muted">From an idea to your celebration table in five steps.</p></div>
          <ol className="steps">
            {STEPS.map(([n, title, text]) => (
              <li key={n}><span className="step-no">{n}</span><h3>{title}</h3><p className="muted">{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="occasions">
        <div className="section-head"><h2>Shop by occasion</h2></div>
        <div className="occasion-grid">
          {OCCASIONS.map((o) => (
            <Link key={o.name} to={o.to} className="occasion" style={{ background: o.tone }}>
              <span className="muted small">Category photo</span>
              <span className="occasion-foot"><span className="occasion-name">{o.name}</span><span className="arrow" aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ai-band">
        <div className="ai-inner">
          <div className="stack">
            <span className="eyebrow light">✦ AI CAKE DESIGNER</span>
            <h2>Tell us the theme. We’ll sketch the cake.</h2>
            <p>Type a description or upload your invitation. The designer suggests tiers, colors and decorations, then you fine-tune everything in 3D.</p>
            <Link to="/ai-designer" className="pill solid align-start">Try the AI Designer →</Link>
          </div>
          <div className="ai-card">
            <h3>What cake are you imagining?</h3>
            <p className="ai-sample">An elegant three-tier cake for an 18th birthday. The theme is butterflies. Use pink, white and gold.</p>
            <p className="muted small">Suggested design</p>
            <div className="row tight"><span className="tag">Theme: Butterflies</span><span className="tag">3 tiers · round</span><span className="tag">Butterfly cascade</span></div>
            <div className="row tight">
              {["#f4c0cc", "#ffffff", "#c9a14a"].map((c) => <span key={c} className="swatch" style={{ background: c }} />)}
              <span className="muted small">Pink · White · Gold accents</span>
            </div>
            <p className="muted small rule">AI-generated concept. Final design, availability and pricing are subject to bakery approval.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
