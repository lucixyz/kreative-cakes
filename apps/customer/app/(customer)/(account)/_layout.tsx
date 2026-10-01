import { decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Redirect, Stack, usePathname } from "expo-router";

/**
 * Guard for signed-in customer routes (/orders, /profile). Routing only: the API and database
 * enforce access to the underlying data independently.
 */
export default function AccountLayout() {
  const session = useSession();
  const pathname = usePathname();
  const decision = decideAccess("customer", session);
  if (!decision.allowed) {
    return <Redirect href={`${decision.redirectTo}?next=${encodeURIComponent(pathname)}` as never} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
