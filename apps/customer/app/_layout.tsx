import { AuthProvider } from "@cakeshop/auth/react";
import { BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { Caveat_600SemiBold } from "@expo-google-fonts/caveat";
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold } from "@expo-google-fonts/hanken-grotesk";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { CartProvider } from "../src/cart/CartContext";
import { authService } from "../src/providers/auth";

export default function RootLayout() {
  // Hold the first paint until the three typefaces are ready so headings never flash in the system font.
  const [fontsReady] = useFonts({ BricolageGrotesque_700Bold, Caveat_600SemiBold, HankenGrotesk_400Regular, HankenGrotesk_600SemiBold });
  if (!fontsReady) return null;
  return (
    <AuthProvider service={authService}>
      <CartProvider>
        <Slot />
      </CartProvider>
    </AuthProvider>
  );
}
