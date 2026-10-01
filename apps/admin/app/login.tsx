import { AUTH_POLICY, decideAccess } from "@cakeshop/auth";
import { useSession } from "@cakeshop/auth/react";
import { colors, spacing } from "@cakeshop/ui";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { AdminLoginForm } from "../src/components/AdminLoginForm";

// Administrator login. There is intentionally no signup route: admin accounts are provisioned
// by a super admin / controlled script, never by public registration.
export default function AdminLogin() {
  const { denied, mfa } = useLocalSearchParams<{ denied?: string; mfa?: string }>();
  const session = useSession();
  if (decideAccess("admin", session, { requireMfa: AUTH_POLICY.adminRequiresMfa }).allowed) {
    return <Redirect href="/dashboard" />;
  }
  return (
    <ScrollView style={{ backgroundColor: colors.adminBar }} contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: "100%", maxWidth: 420, gap: spacing.lg, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ color: colors.primary, fontWeight: "700", letterSpacing: 1 }}>KREATIVE CAKES · MANAGEMENT</Text>
          <Text accessibilityRole="header" style={{ fontSize: 26, fontWeight: "600", color: colors.text }}>
            Staff sign in
          </Text>
          <Text style={{ color: colors.textMuted }}>Authorised bakery staff only. Customers sign in on the main site.</Text>
        </View>
        {denied ? (
          <Text accessibilityRole="alert" style={{ color: colors.danger }}>
            Access denied. This area is restricted to bakery staff.
          </Text>
        ) : null}
        {mfa ? <Text accessibilityRole="alert" style={{ color: colors.danger }}>Multi-factor verification is required but not yet available.</Text> : null}
        <AdminLoginForm />
      </View>
    </ScrollView>
  );
}
