import { AuthProvider } from "@cakeshop/auth/react";
import "@cakeshop/ui/web.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { authService } from "./auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider service={authService}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
