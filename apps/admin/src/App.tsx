import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/AdminShell";
import { ADMIN_SECTIONS } from "./constants/sections";
import { Login } from "./pages/Login";
import { Section } from "./pages/Section";

// There is intentionally no signup route: admin accounts are provisioned by a super admin /
// controlled script, never by public registration.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      {/* The shell guards EVERY /dashboard/* route. */}
      <Route path="/dashboard" element={<AdminShell />}>
        {ADMIN_SECTIONS.map((s) =>
          s.href === "/dashboard" ? (
            <Route key={s.href} index element={<Section title={s.label} />} />
          ) : (
            <Route key={s.href} path={s.href.replace("/dashboard/", "")} element={<Section title={s.label} />} />
          ),
        )}
        <Route path="*" element={<Section title="Page not found" note="That page does not exist." />} />
      </Route>
      <Route path="*" element={<Section title="Page not found" note="That page does not exist." />} />
    </Routes>
  );
}
