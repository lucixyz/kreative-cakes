import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/AdminShell";
import { BuilderOptions } from "./pages/BuilderOptions";
import { Calendar } from "./pages/Calendar";
import { Categories } from "./pages/Categories";
import { Customers } from "./pages/Customers";
import { Dashboard } from "./pages/Dashboard";
import { Decorations } from "./pages/Decorations";
import { DesignReview } from "./pages/DesignReview";
import { Inventory } from "./pages/Inventory";
import { Login } from "./pages/Login";
import { Messages } from "./pages/Messages";
import { Orders } from "./pages/Orders";
import { Payments } from "./pages/Payments";
import { Products } from "./pages/Products";
import { Promotions } from "./pages/Promotions";
import { Quotations } from "./pages/Quotations";
import { Reports } from "./pages/Reports";
import { Reviews } from "./pages/Reviews";
import { Section } from "./pages/Section";
import { Settings } from "./pages/Settings";

// There is intentionally no signup route: admin accounts are provisioned by a super admin /
// controlled script, never by public registration.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      {/* The shell guards EVERY /dashboard/* route. */}
      <Route path="/dashboard" element={<AdminShell />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="custom-orders" element={<Orders initialKind="custom" />} />
        <Route path="design-reviews" element={<DesignReview />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="payments" element={<Payments />} />
        <Route path="transactions" element={<Navigate replace to="/dashboard/payments" />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="builder-options" element={<BuilderOptions />} />
        <Route path="decorations" element={<Decorations />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="customers" element={<Customers />} />
        <Route path="messages" element={<Messages />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Section title="Page not found" note="That page does not exist." />} />
      </Route>
      <Route path="*" element={<Section title="Page not found" note="That page does not exist." />} />
    </Routes>
  );
}
