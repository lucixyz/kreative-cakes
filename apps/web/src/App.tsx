import { Navigate, Route, Routes } from "react-router-dom";
import { RequireCustomer } from "./components/RequireCustomer";
import { SiteLayout } from "./layout/SiteLayout";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { AiDesignerPage, CakeBuilderPage } from "./pages/Designers";
import { Home } from "./pages/Home";
import { About, Contact } from "./pages/Info";
import { Legal } from "./pages/Legal";
import { Login } from "./pages/Login";
import { Placeholder } from "./pages/Placeholder";
import { ProductDetail } from "./pages/ProductDetail";
import { Shop } from "./pages/Shop";
import { Signup } from "./pages/Signup";
import { AccountLayout } from "./pages/account/AccountLayout";
import { EventDetails } from "./pages/account/EventDetails";
import { Favorites } from "./pages/account/Favorites";
import { Messages } from "./pages/account/Messages";
import { OrderTracking } from "./pages/account/OrderTracking";
import { Orders } from "./pages/account/Orders";
import { Pay } from "./pages/account/Pay";
import { QuoteReview } from "./pages/account/QuoteReview";
import { Settings } from "./pages/account/Settings";
import { POLICIES, type PolicyKey } from "./data/account";

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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {(Object.keys(POLICIES) as PolicyKey[]).map((k) => <Route key={k} path={`/${k}`} element={<Legal tab={k} />} />)}
        <Route element={<RequireCustomer />}>
          <Route element={<AccountLayout />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Settings />} />
          </Route>
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/quotation" element={<QuoteReview />} />
          <Route path="/submit-design" element={<EventDetails />} />
          <Route path="/pay" element={<Pay />} />
        </Route>
        <Route path="/account" element={<Navigate replace to="/orders" />} />
        <Route path="*" element={<Placeholder title="Page not found" note="That page does not exist." />} />
      </Route>
    </Routes>
  );
}
