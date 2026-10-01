import { AuthProvider } from "@cakeshop/auth/react";
import { Slot } from "expo-router";
import { authService } from "../src/providers/auth";

export default function RootLayout() {
  return (
    <AuthProvider service={authService}>
      <Slot />
    </AuthProvider>
  );
}
