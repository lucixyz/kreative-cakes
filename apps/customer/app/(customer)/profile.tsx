import { useAuthService, useSession } from "@cakeshop/auth/react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Page } from "../../src/components/kit";
import { RequireCustomer } from "../../src/components/RequireCustomer";
import { Btn, heading } from "../../src/components/ui";
import { ACCOUNT_LINKS, LEGAL_LINKS } from "../../src/data/account";
import { c } from "../../src/theme";

function Row({ label, badge, onPress }: { label: string; badge?: number | undefined; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={{ minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#F1ECE5" }}>
      <Text style={{ fontSize: 16, color: c.ink }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        {badge ? <View style={{ backgroundColor: "#9C4257", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ color: "#fff", fontSize: 12 }}>{badge}</Text></View> : null}
        <Text style={{ color: c.muted, fontSize: 18 }}>›</Text>
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const session = useSession();
  const service = useAuthService();
  const router = useRouter();
  const initials = (session?.user.displayName ?? "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <RequireCustomer>
      <Page>
        <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
          <View accessibilityElementsHidden style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>{initials}</Text></View>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={heading(28)}>{session?.user.displayName ?? "Your account"}</Text>
            <Text testID="signed-in-as" style={{ color: c.muted }}>Signed in as {session?.user.displayName} ({session?.user.role})</Text>
          </View>
        </View>
        <Card style={{ paddingVertical: 4 }}>
          {ACCOUNT_LINKS.map((l) => <Row key={l.label} label={l.label} badge={l.badge} onPress={() => router.push(l.to as never)} />)}
        </Card>
        <Card style={{ paddingVertical: 4 }}>
          {LEGAL_LINKS.map((l) => <Row key={l} label={l} />)}
        </Card>
        <Btn label="Log out" variant="ghost" onPress={() => void service.signOut()} />
      </Page>
    </RequireCustomer>
  );
}
