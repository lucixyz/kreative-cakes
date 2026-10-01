import { decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Redirect, usePathname } from "expo-router";
import type { ReactNode } from "react";

/**
 * Guard for signed-in customer screens (orders, profile). Routing only: the API and database
 * enforce access to the underlying data independently.
 */
export function RequireCustomer({ children }: { children: ReactNode }) {
  const session = useSession();
  const pathname = usePathname();
  const decision = decideAccess("customer", session);
  if (!decision.allowed) return <Redirect href={`${decision.redirectTo}?next=${encodeURIComponent(pathname)}` as never} />;
  return <>{children}</>;
}
