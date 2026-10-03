import { AuthProvider } from "@cakeshop/auth/react";
import "@cakeshop/ui/web.css";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/caveat/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./store/store.css";
import "./store/account.css";
import "./store/refine.css";
import { authService } from "./auth";
import { CartProvider } from "./cart/CartContext";
import { FavoritesProvider } from "./cart/FavoritesContext";

createRoot(document.getElementById("root")!).render(
  !authService ? (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Sign-in is not configured</h1>
      <p>This deployment has no authentication backend yet.</p>
    </main>
  ) : (
  <StrictMode>
    <AuthProvider service={authService}>
      <BrowserRouter>
        <CartProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
  ),
);
