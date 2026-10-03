import { Link } from "react-router-dom";

const COLUMNS = [
  { title: "Shop", links: [["All cakes", "/shop"], ["Custom cakes", "/cake-builder"], ["AI Designer", "/ai-designer"]] },
  { title: "Help", links: [["Delivery & pickup", "/delivery"], ["Track an order", "/orders"], ["FAQs", "/faq"], ["About us", "/about"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Cancellation & refunds", "/refunds"], ["Allergen information", "/allergens"]] },
] as const;

// Bracketed text is a placeholder for details only the bakery can supply.
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <strong className="brand">Kreative Cakes</strong>
          <p className="muted">Pickup: [Store address]</p>
          <p className="muted">Hours: [Opening hours]</p>
          <p className="muted">[Phone] · [Email]</p>
          <p className="muted">Follow us: [Social links]</p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3>{c.title}</h3>
            <ul>
              {c.links.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
