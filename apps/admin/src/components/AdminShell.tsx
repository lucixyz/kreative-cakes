import type { AuthUser } from "@cakeshop/auth";
import { useAuthService } from "@cakeshop/auth/react";
import { Button, colors, spacing } from "@cakeshop/ui";
import { Link, useRouter } from "expo-router";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { ADMIN_SECTIONS } from "../constants/sections";

// PROTOTYPE shell: simple top bar + links. The sidebar layout arrives in the UI phase.
export function AdminShell({ user, children }: { user: AuthUser; children: ReactNode }) {
  const service = useAuthService();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.adminBar, padding: spacing.md, gap: spacing.sm }}>
        <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Kreative Cakes · Management</Text>
        <Text testID="admin-user" style={{ color: "#CFCAC4" }}>{user.displayName} · {user.role}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
          {ADMIN_SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} style={{ color: "#FFFFFF" }}>{s.label}</Link>
          ))}
        </View>
        <View style={{ alignSelf: "flex-start" }}>
          <Button
            label="Sign out"
            variant="secondary"
            onPress={() => {
              void service.signOut().then(() => router.replace("/login"));
            }}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
    </View>
  );
}
