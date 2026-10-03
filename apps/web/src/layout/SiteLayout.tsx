import { useAuthService, useSession } from "@cakeshop/auth/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { BagIcon, MenuIcon } from "../components/Icons";
import { Footer } from "./Footer";

const LINKS = [
  { to: "/shop", label: "Shop Cakes" },
  { to: "/cake-builder", label: "Custom Cakes" },
  { to: "/ai-designer", label: "AI Designer" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/orders", label: "Track Order" },
] as const;

function SearchForm({ className }: { className: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
  };
  return (
    <form role="search" className={`nav-search ${className}`} onSubmit={submit}>
      <label htmlFor={`nav-q-${className}`} className="sr">Search cakes</label>
      <MagnifyingGlass size={16} aria-hidden="true" />
      <input id={`nav-q-${className}`} type="search" placeholder="Search cakes" value={q} onChange={(e) => setQ(e.target.value)} />
    </form>
  );
}

function Header({ hero }: { hero: boolean }) {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const service = useAuthService();
  const { units } = useCart();
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={hero ? "site-nav hero-nav" : "site-nav"}>
      <nav className="nav-inner" aria-label="Main">
        <Link to="/" className="brand">Kreative Cakes</Link>
        <ul id="site-menu" className={`nav-links${open ? " open" : ""}`}>
          {LINKS.map((l) => (
            <li key={l.label}><NavLink to={l.to} end>{l.label}</NavLink></li>
          ))}
          <li className="only-mobile"><SearchForm className="in-menu" /></li>
        </ul>
        <div className="nav-right">
          <SearchForm className="in-bar" />
          {session ? (
            <>
              <Link to="/orders" className="link-btn">My account</Link>
              <span data-testid="signed-in-as" className="who">Signed in as {session.user.displayName} ({session.user.role})</span>
              <button className="link-btn" onClick={() => void service.signOut()}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="link-btn">Sign in</Link>
          )}
          <Link to="/cart" className="bag" aria-label={`Cart, ${units} ${units === 1 ? "item" : "items"}`}><BagIcon />{units > 0 ? <span className="bag-count">{units}</span> : null}</Link>
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}><MenuIcon open={open} /></button>
        </div>
      </nav>
      {hero ? null : <div className="awning" aria-hidden="true" />}
    </header>
  );
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const hero = pathname === "/";
  return (
    <div className={`store${hero ? " is-home" : ""}`}>
      <a href="#main" className="skip">Skip to content</a>
      <Header hero={hero} />
      <div id="main" tabIndex={-1}><Outlet /></div>
      <Footer />
    </div>
  );
}
