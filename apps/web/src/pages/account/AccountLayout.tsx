import { useAuthService, useSession } from "@cakeshop/auth/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const LINKS = [
  { to: "/orders", label: "Orders" },
  { to: "/quotation", label: "Quotations", badge: 1 },
  { to: "/favorites", label: "Favorites" },
  { to: "/messages", label: "Messages" },
  { to: "/profile", label: "Profile & settings" },
] as const;

/** Frame for the signed-in customer area. Route protection is RequireCustomer; this is layout only. */
export function AccountLayout() {
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  return (
    <div className="account">
      <aside className="account-side">
        <div className="account-who">
          <strong className="account-name">{session?.user.displayName ?? "Your account"}</strong>
          <span className="muted small">Customer since 2026</span>
        </div>
        <nav aria-label="Account">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end className={({ isActive }) => `account-link${isActive ? " active" : ""}`}>
              {l.label}
              {"badge" in l ? <span className="badge">{l.badge}</span> : null}
            </NavLink>
          ))}
          <button type="button" className="account-link signout" onClick={() => void service.signOut().then(() => navigate("/login", { replace: true }))}>Sign out</button>
        </nav>
      </aside>
      <div className="account-main"><Outlet /></div>
    </div>
  );
}
