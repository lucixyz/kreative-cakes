import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import {
  Cake, CalendarBlank, ChartBar, ChatCircle, CreditCard, FileText, Flower, Gear, Package, PaintBrush, Percent, Receipt, SquaresFour, Sliders, Star, Storefront, Tag, Users,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_NAV } from "../constants/sections";

// One icon family (Phosphor, regular) for the whole admin. Decorative: the label is always present.
const ICONS: Record<string, Icon> = {
  "/dashboard": SquaresFour, "/dashboard/reports": ChartBar,
  "/dashboard/orders": Receipt, "/dashboard/custom-orders": Cake, "/dashboard/design-reviews": PaintBrush, "/dashboard/quotations": FileText,
  "/dashboard/payments": CreditCard, "/dashboard/calendar": CalendarBlank,
  "/dashboard/products": Storefront, "/dashboard/categories": Tag, "/dashboard/builder-options": Sliders, "/dashboard/decorations": Flower,
  "/dashboard/inventory": Package, "/dashboard/promotions": Percent,
  "/dashboard/customers": Users, "/dashboard/messages": ChatCircle, "/dashboard/reviews": Star, "/dashboard/settings": Gear,
};

/**
 * Guards and frames every /dashboard/* route. Routing only: the API (requireAdminPortal) and, later,
 * database RLS enforce access to the data itself, because a client can bypass this check.
 */
export function AdminShell() {
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const decision = decideAccess("admin", session, { requireMfa: AUTH_POLICY.adminRequiresMfa });
  if (!decision.allowed || !session) return <Navigate replace to={decision.allowed ? "/login" : decision.redirectTo} />;

  return (
    <div className="adm">
      <div className="adm-top">
        <strong>Kreative Cakes</strong>
        <button type="button" aria-expanded={open} aria-controls="adm-side" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Menu"}</button>
      </div>
      <aside id="adm-side" className={`adm-side${open ? " open" : ""}`}>
        <div className="adm-brand"><strong>Kreative Cakes</strong><span>Management</span></div>
        <nav className="adm-nav" aria-label="Admin">
          {ADMIN_NAV.map((g) => (
            <div key={g.title} className="adm-group">
              <h2>{g.title}</h2>
              {g.items.map((i) => {
                const Glyph = ICONS[i.href];
                return (
                  <NavLink key={i.href} to={i.href} end className={({ isActive }) => `adm-link${isActive ? " active" : ""}`}>
                    <span className="adm-link-label">{Glyph ? <Glyph size={18} aria-hidden="true" /> : null}{i.label}</span>
                    {i.count ? <span className="adm-count">{i.count}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="adm-who">
          <span data-testid="admin-user">{session.user.displayName} · {session.user.role}</span>
          <button type="button" onClick={() => void service.signOut().then(() => navigate("/login", { replace: true }))}>Sign out</button>
        </div>
      </aside>
      <main className="adm-main"><Outlet /></main>
    </div>
  );
}
