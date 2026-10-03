import { storefrontProducts } from "@cakeshop/database";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { CakeArt } from "../store/CakeArt";
import { Photo, occasionPhoto } from "../store/Photo";

const STEPS = [
  ["Describe your idea", "Type the occasion and theme, or upload an invitation for inspiration."],
  ["Generate your cake", "Get a suggested design with tiers, colors and decorations."],
  ["Customize in 3D", "Change flavors, colors and toppers and see every update live."],
  ["Bakery reviews it", "Our bakers check the design and send your final quotation."],
  ["Order and celebrate", "Pay the deposit, track production, and pick up or get it delivered."],
] as const;

const OCCASIONS = [
  { key: "birthday", name: "Birthdays", to: "/shop?occasion=birthday", tiers: 2, color: "#f2a7bd" },
  { key: "wedding", name: "Weddings", to: "/shop?occasion=wedding", tiers: 3, color: "#fbf3ee" },
  { key: "anniversary", name: "Anniversaries", to: "/shop?occasion=anniversary", tiers: 2, color: "#a98bd6" },
  { key: "corporate", name: "Corporate events", to: "/shop?occasion=corporate", tiers: 1, color: "#9bc27a" },
  { key: "cupcakes", name: "Cupcakes", to: "/shop?type=cupcakes", tiers: 1, color: "#e2b94d" },
  { key: "bento", name: "Bento cakes", to: "/shop?type=bento", tiers: 1, color: "#c0405f" },
] as const;

// Only claims the system can back: review before payment, allergen info on every cake, chosen fulfillment.
const WHY = [
  ["Reviewed before you pay", "Every custom design is checked by our bakers, who send a quotation first."],
  ["Made to your details", "Choose the size, flavor and a message for the cake. Pre-orders show how many days ahead to order."],
  ["Allergens listed", "Every cake shows its allergen information, so you can decide before you order."],
  ["Pickup or delivery", "Choose either at checkout, with the date and time that suit your celebration."],
] as const;

const shelf = (from: number) => storefrontProducts.slice(from, from + 4);

// The home page is the shop window: a sign, then the glass display case with the day's cakes.
// Illustrations stand in for photography until real photos are added (see store/Photo.tsx).
export function Home() {
  return (
    <main>
      <section className="sign">
        <div className="sign-inner">
          <h1>Fresh cakes, or design your own.</h1>
          <p>Pick a ready-made cake, or describe your celebration and our bakers review and quote it before you pay.</p>
          <div className="row">
            <Link to="/ai-designer" className="pill solid">Design Your Cake</Link>
            <Link to="/shop" className="pill outline">Shop Cakes</Link>
          </div>
        </div>
      </section>

      <section className="case" aria-label="Today's cakes">
        <div className="case-glass">
          {[shelf(0), shelf(4)].map((row, i) => (
            <div key={i} className="shelf">
              <div className="shelf-row">{row.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </div>
          ))}
        </div>
        <div className="case-foot"><Link to="/shop" className="text-link">See every cake <ArrowIcon /></Link></div>
      </section>

      <section className="section custom-choices" aria-labelledby="custom-h">
        <div className="custom-copy">
          <h2 id="custom-h">Your cake, your way</h2>
          <p className="muted">Start with an idea, then choose each detail. Our bakers review the design and send you a quotation before any payment.</p>
          <ul className="plain-list">
            <li><strong>Design:</strong> describe it to the AI Designer, or build it step by step.</li>
            <li><strong>Size and flavor:</strong> pick the tiers, flavors and decorations that fit your guests.</li>
            <li><strong>Message:</strong> add a short message for the cake.</li>
            <li><strong>Date:</strong> choose a pickup or delivery date that gives us the time we need.</li>
          </ul>
          <div className="row"><Link to="/cake-builder" className="pill dark">Customize a Cake</Link><Link to="/ai-designer" className="pill outline-dark">Try the AI Designer</Link></div>
        </div>
        <ul className="why-grid" aria-label="Why order with us">
          {WHY.map(([title, text]) => <li key={title}><h3>{title}</h3><p className="muted">{text}</p></li>)}
        </ul>
      </section>

      <section className="band">
        <div className="section no-top">
          <div className="center"><h2>How ordering works</h2><p className="muted">From an idea to your celebration table in five steps.</p></div>
          <ol className="steps">
            {STEPS.map(([title, text], i) => (
              <li key={title}><span className="step-no">{i + 1}</span><h3>{title}</h3><p className="muted">{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="occasions">
        <div className="section-head"><h2>Shop by occasion</h2></div>
        <div className="occasion-grid">
          {OCCASIONS.map((o) => (
            <Link key={o.name} to={o.to} className="occasion">
              <Photo src={occasionPhoto(o.key)} alt="" caption={false} className="wide" fallback={<CakeArt tiers={o.tiers} color={o.color} label="" />} />
              <span className="occasion-foot"><span className="occasion-name">{o.name}</span><span className="arrow" aria-hidden="true"><ArrowIcon /></span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ai-band">
        <div className="ai-inner">
          <div className="stack">
            <h2>Tell us the theme. We’ll sketch the cake.</h2>
            <p>Type a description or upload your invitation. The designer suggests tiers, colors and decorations, then you fine-tune everything in 3D. Our bakers always review it first.</p>
            <Link to="/ai-designer" className="pill solid align-start">Try the AI Designer <ArrowIcon /></Link>
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
