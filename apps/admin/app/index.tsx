import { Redirect } from "expo-router";

// /admin -> dashboard. The dashboard layout sends visitors without admin access to /admin/login.
export default function AdminIndex() {
  return <Redirect href="/dashboard" />;
}
