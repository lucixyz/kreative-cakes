import { decideAccess, safeRedirectPath } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { AuthScreen } from "../../src/components/AuthScreen";
import { LoginForm } from "../../src/features/auth/components/LoginForm";

// Customer login only. Staff/admin accounts sign in at /admin/login and are rejected here.
export default function Login() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const session = useSession();
  if (decideAccess("customer", session).allowed) return <Redirect href={(safeRedirectPath(next) ?? "/") as never} />;
  return (
    <AuthScreen title="Log in">
      <LoginForm next={next} />
    </AuthScreen>
  );
}
