import { AuthProvider } from "@cakeshop/auth/react";
import { Slot } from "expo-router";
import { CartProvider } from "../src/cart/CartContext";
import { authService } from "../src/providers/auth";

export default function RootLayout() {
  return (
    <AuthProvider service={authService}>
      <CartProvider>
        <Slot />
      </CartProvider>
    </AuthProvider>
  );
}
