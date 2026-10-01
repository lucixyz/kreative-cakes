import { useAuthService, useSession } from "@cakeshop/auth/react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { BagIcon } from "../components/Icons";
import { Footer } from "./Footer";

const LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/cake-builder", label: "Custom Cakes" },
  { to: "/ai-designer", label: "AI Designer" },
  { to: "/#occasions", label: "Occasions", plainOnly: true },
  { to: "/orders", label: "Track Order" },
] as const;

function Header({ hero }: { hero: boolean }) {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const service = useAuthService();
  const { units } = useCart();
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={hero ? "site-nav hero-nav" : "site-nav plain-nav"}>
      <nav className="nav-inner" aria-label="Main">
        <Link to="/" className="brand">Kreative Cakes</Link>
        <ul className={`nav-links${open ? " open" : ""}`}>
          {LINKS.filter((l) => hero ? !("plainOnly" in l) : true).map((l) => (
            <li key={l.label}><NavLink to={l.to} end>{l.label}</NavLink></li>
          ))}
        </ul>
        <div className="nav-right">
          {session ? (
            <>
              <span data-testid="signed-in-as" className="who">Signed in as {session.user.displayName} ({session.user.role})</span>
              <button className="link-btn" onClick={() => void service.signOut()}>Log out</button>
            </>
          ) : !hero ? (
            <Link to="/login" className="link-btn">Sign in</Link>
          ) : null}
          {hero ? (
            <>
              <Link to="/cart" className="bag" aria-label={`Cart, ${units} items`}><BagIcon />{units > 0 ? <span className="bag-count">{units}</span> : null}</Link>
              {!session ? <Link to="/login" className="pill solid small">Sign In</Link> : null}
            </>
          ) : (
            <Link to="/cart" className="pill dark small"><BagIcon /> Cart · {units}</Link>
          )}
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? "✕" : "☰"}</button>
        </div>
      </nav>
    </header>
  );
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const hero = pathname === "/";
  return (
    <div className={`store${hero ? " is-home" : ""}`}>
      <Header hero={hero} />
      <Outlet />
      <Footer />
    </div>
  );
}
