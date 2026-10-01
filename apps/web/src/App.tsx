import { Route, Routes } from "react-router-dom";
import { RequireCustomer } from "./components/RequireCustomer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Placeholder } from "./pages/Placeholder";
import { Signup } from "./pages/Signup";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/shop" element={<Placeholder title="Shop" />} />
      <Route path="/cake-builder" element={<Placeholder title="Cake builder" />} />
      <Route path="/ai-designer" element={<Placeholder title="AI designer" />} />
      <Route path="/cart" element={<Placeholder title="Cart" />} />
      <Route path="/checkout" element={<Placeholder title="Checkout" />} />
      <Route element={<RequireCustomer />}>
        <Route path="/orders" element={<Placeholder title="My orders" />} />
        <Route path="/profile" element={<Placeholder title="My profile" />} />
      </Route>
      <Route path="/faq" element={<Placeholder title="FAQs" />} />
      <Route path="/delivery" element={<Placeholder title="Delivery Information" />} />
      <Route path="/contact" element={<Placeholder title="Contact" />} />
      <Route path="/refunds" element={<Placeholder title="Refund / Cancellation Policy" />} />
      <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
      <Route path="/terms" element={<Placeholder title="Terms" />} />
      <Route path="*" element={<Placeholder title="Page not found" note="That page does not exist." />} />
    </Routes>
  );
}
