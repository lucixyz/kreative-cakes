import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useAuthService, useSession } from "@cakeshop/auth/react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ADMIN_SECTIONS } from "../constants/sections";

/**
 * Guards and frames every /dashboard/* route. Routing only: the API (requireAdminPortal) and, later,
 * database RLS enforce access to the data itself, because a client can bypass this check.
 * PROTOTYPE shell: simple top bar + links. The sidebar layout arrives in the UI phase.
 */
export function AdminShell() {
  const session = useSession();
  const service = useAuthService();
  const navigate = useNavigate();
  const decision = decideAccess("admin", session, { requireMfa: AUTH_POLICY.adminRequiresMfa });
  if (!decision.allowed || !session) return <Navigate replace to={decision.allowed ? "/login" : decision.redirectTo} />;

  return (
    <div>
      <header style={{ background: "var(--admin-bar)", color: "#fff", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <strong>Kreative Cakes · Management</strong>
        <span data-testid="admin-user" style={{ color: "#cfcac4" }}>{session.user.displayName} · {session.user.role}</span>
        <nav className="row" style={{ gap: 16 }}>
          {ADMIN_SECTIONS.map((s) => (
            <NavLink key={s.href} to={s.href} end style={{ color: "#fff" }}>{s.label}</NavLink>
          ))}
        </nav>
        <button
          className="btn secondary"
          style={{ alignSelf: "flex-start", color: "#fff", borderColor: "#fff" }}
          onClick={() => void service.signOut().then(() => navigate("/login", { replace: true }))}
        >
          Sign out
        </button>
      </header>
      <Outlet />
    </div>
  );
}
