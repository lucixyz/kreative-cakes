import { useAuthService, useSession } from "@cakeshop/auth/react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS, PROMO } from "./data";

const ICONS = {
  search: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>,
  heart: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" /></svg>,
  cart: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11h10.6L20 7H6.5" /><circle cx="9" cy="19" r="1.2" /><circle cx="17" cy="19" r="1.2" /></svg>,
};

export function AnnouncementBar() {
  return <div className="announce">{PROMO}</div>;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const service = useAuthService();
  const close = () => setOpen(false);

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Main">
        <Link to="/" className="logo" onClick={close}>Kreative Cakes</Link>

        <ul className={`nav-links${open ? " open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <NavLink to={l.to} end onClick={close}>{l.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link to="/shop" aria-label="Search" className="icon-btn">{ICONS.search}</Link>
          <Link to="/shop" aria-label="Favorites" className="icon-btn hide-sm">{ICONS.heart}</Link>
          <Link to="/cart" aria-label="Cart" className="icon-btn">{ICONS.cart}</Link>
          {session ? (
            <span className="account">
              <span data-testid="signed-in-as" className="who">Signed in as {session.user.displayName} ({session.user.role})</span>
              <Link to="/orders" className="pill ghost">My orders</Link>
              <button className="pill" onClick={() => void service.signOut()}>Log out</button>
            </span>
          ) : (
            <Link to="/login" className="pill">Sign In</Link>
          )}
          <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
