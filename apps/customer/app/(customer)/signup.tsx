import { decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { Redirect } from "expo-router";
import { AuthScreen } from "../../src/components/AuthScreen";
import { SignupForm } from "../../src/features/auth/components/SignupForm";

export default function Signup() {
  const session = useSession();
  if (decideAccess("customer", session).allowed) return <Redirect href="/" />;
  return (
    <AuthScreen title="Create your account">
      <SignupForm />
    </AuthScreen>
  );
}
