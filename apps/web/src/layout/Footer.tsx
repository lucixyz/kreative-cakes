import { Link } from "react-router-dom";

const COLUMNS = [
  { title: "Shop", links: [["All cakes", "/shop"], ["Custom cakes", "/cake-builder"], ["AI Designer", "/ai-designer"]] },
  { title: "Help", links: [["Delivery & pickup", "/delivery"], ["Track an order", "/orders"], ["FAQs", "/faq"]] },
  { title: "Legal", links: [["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Cancellation & refunds", "/refunds"], ["Allergen information", "/allergens"]] },
] as const;

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <strong className="brand">Kreative Cakes</strong>
          <p className="muted">[Address]</p>
          <p className="muted">[Phone] · [Email]</p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <h3>{c.title}</h3>
            <ul>
              {c.links.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
