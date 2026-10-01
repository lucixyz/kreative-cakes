import { Link } from "react-router-dom";
import { CakeArt } from "./CakeArt";
import { OFFERS, REVIEWS, STYLES, WHY } from "./data";
import { SectionHead } from "./Catalog";

const GALLERY_TONES = ["#f9d9e2", "#efe6df", "#dcedf8", "#e8def8", "#fbeab8", "#d9ead0", "#f4cfd6", "#dde2ea"];

export function PopularDesigns() {
  return (
    <section className="section">
      <SectionHead title="Popular Custom Designs" sub="Start from a style others love, then make it yours." />
      <div className="designs">
        {STYLES.map((s, i) => (
          <article key={s.name} className="design" style={{ background: GALLERY_TONES[i % GALLERY_TONES.length] }}>
            <CakeArt {...s.cake} label={`${s.name} cake`} />
            <h3>{s.name}</h3>
            <Link to="/cake-builder" className="pill small ghost">Customize This Design</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="section" id="about">
      <SectionHead title="Why Choose Us?" />
      <ul className="why">
        {WHY.map((w) => (
          <li key={w.title}>
            <h3>{w.title}</h3>
            <p className="muted">{w.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="section">
      <SectionHead title="Customer Reviews" />
      <div className="reviews">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="review">
            <p className="rating">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
            <blockquote>“{r.text}”</blockquote>
            <figcaption>
              <strong>{r.name}</strong> · {r.cake}
              <span className="verified">✓ Verified Purchase</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Offers() {
  return (
    <section className="section">
      <SectionHead title="Special Offers" />
      <div className="offers">
        {OFFERS.map((o) => (
          <article key={o.title} className="offer">
            <h3>{o.title}</h3>
            <p className="muted">{o.text}</p>
            <Link to="/shop" className="pill small ghost">{o.cta}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InspirationGallery() {
  // Masonry-style: columns with varied heights. Real customer / bakery photos replace the drawings.
  const tiles = [...STYLES, ...STYLES].slice(0, 10);
  return (
    <section className="section">
      <SectionHead title="Cake Inspiration Gallery" sub="Find a look you love." />
      <div className="masonry">
        {tiles.map((s, i) => (
          <Link key={`${s.name}-${i}`} to="/cake-builder" className={`tile t${i % 3}`} style={{ background: GALLERY_TONES[(i + 2) % GALLERY_TONES.length] }}>
            <CakeArt {...s.cake} label={`${s.name} inspiration`} />
          </Link>
        ))}
      </div>
    </section>
  );
}
