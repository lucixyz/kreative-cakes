import { Route, Routes } from "react-router-dom";
import { RequireCustomer } from "./components/RequireCustomer";
import { SiteLayout } from "./layout/SiteLayout";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { AiDesignerPage, CakeBuilderPage } from "./pages/Designers";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Placeholder } from "./pages/Placeholder";
import { ProductDetail } from "./pages/ProductDetail";
import { Shop } from "./pages/Shop";
import { Signup } from "./pages/Signup";

const INFO_PAGES: [string, string][] = [
  ["faq", "FAQs"], ["delivery", "Delivery & pickup"], ["terms", "Terms & Conditions"],
  ["privacy", "Privacy Policy"], ["refunds", "Cancellation & refunds"], ["allergens", "Allergen information"],
];

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ai-designer" element={<AiDesignerPage />} />
        <Route path="/cake-builder" element={<CakeBuilderPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireCustomer />}>
          <Route path="/orders" element={<Placeholder title="Track an order" />} />
          <Route path="/profile" element={<Placeholder title="My profile" />} />
        </Route>
        {INFO_PAGES.map(([path, title]) => <Route key={path} path={`/${path}`} element={<Placeholder title={title} />} />)}
        <Route path="*" element={<Placeholder title="Page not found" note="That page does not exist." />} />
      </Route>
    </Routes>
  );
}
