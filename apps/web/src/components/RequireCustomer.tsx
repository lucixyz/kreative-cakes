import { decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Guard for signed-in customer routes (/orders, /profile). Routing only: the API and database
 * enforce access to the underlying data independently.
 */
export function RequireCustomer() {
  const session = useSession();
  const { pathname } = useLocation();
  const decision = decideAccess("customer", session);
  if (!decision.allowed) return <Navigate replace to={`${decision.redirectTo}?next=${encodeURIComponent(pathname)}`} />;
  return <Outlet />;
}
