import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Redirect, Slot } from "expo-router";
import { AdminShell } from "../../src/components/AdminShell";

/**
 * Guards EVERY /admin/dashboard/* route. Routing only: the API (requireAdminPortal) and, later,
 * database RLS enforce access to the data itself, because a client can bypass this check.
 */
export default function DashboardLayout() {
  const session = useSession();
  const decision = decideAccess("admin", session, { requireMfa: AUTH_POLICY.adminRequiresMfa });
  if (!decision.allowed || !session) return <Redirect href={(decision.allowed ? "/login" : decision.redirectTo) as never} />;
  return (
    <AdminShell user={session.user}>
      <Slot />
    </AdminShell>
  );
}
