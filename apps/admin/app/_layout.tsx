import { AuthProvider } from "@cakeshop/auth/react";
import { Slot } from "expo-router";
import { authService } from "../src/providers/auth";

// The admin app is served under /admin (see `experiments.baseUrl` in app.json), so the routes
// below are /admin/login and /admin/dashboard/*.
export default function AdminRootLayout() {
  return (
    <AuthProvider service={authService}>
      <Slot />
    </AuthProvider>
  );
}
