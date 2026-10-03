import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BackHeader, Chip, Page, StatusPill } from "../../src/components/kit";
import { RequireCustomer } from "../../src/components/RequireCustomer";
import { Btn } from "../../src/components/ui";
import { ORDERS } from "../../src/data/account";
import { c } from "../../src/theme";

export default function Orders() {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "past">("active");
  const rows = ORDERS.filter((o) => (tab === "active" ? o.active : !o.active));
  const count = (a: boolean) => ORDERS.filter((o) => o.active === a).length;
  return (
    <RequireCustomer>
      <Page>
        <BackHeader title="My orders" fallback="/profile" />
        <Link href="/messages" asChild>
          <Pressable accessibilityRole="link" style={{ backgroundColor: "#F3E3E6", borderRadius: 18, padding: 16, gap: 2 }}>
            <Text style={{ fontWeight: "600", color: "#5E2232" }}>A quotation is waiting for you</Text>
            <Text style={{ color: "#5E2232", fontSize: 14 }}>Rustic Wedding Cake · ₱14,800 · valid until Oct 9</Text>
          </Pressable>
        </Link>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Chip label={`Active · ${count(true)}`} selected={tab === "active"} onPress={() => setTab("active")} />
          <Chip label={`Past · ${count(false)}`} selected={tab === "past"} onPress={() => setTab("past")} />
        </View>
        {rows.length === 0 ? (
          <View style={{ alignItems: "center", gap: 10, paddingVertical: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>No orders yet</Text>
            <Text style={{ color: c.muted, textAlign: "center" }}>When you order or submit a custom cake, it will show up here.</Text>
            <Btn label="Design a cake" onPress={() => router.push("/ai-designer")} />
          </View>
        ) : null}
        {rows.map((o) => (
          <Pressable key={o.id} accessibilityRole="button" accessibilityLabel={`${o.name}, ${o.status}`} onPress={() => router.push({ pathname: "/order/[id]", params: { id: o.id } })} style={{ flexDirection: "row", gap: 14, backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: c.line, padding: 14 }}>
            <View style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: o.tint }} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontSize: 12, color: c.muted }}>{o.id} · {o.kind}</Text>
              <Text style={{ fontWeight: "600", fontSize: 16, color: c.ink }}>{o.name}</Text>
              <Text style={{ color: c.muted, fontSize: 14 }}>{o.when}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6, gap: 8 }}>
                <StatusPill tone={o.tone} label={o.status} /><Text style={{ fontWeight: "600", fontSize: 13 }}>{o.total}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </Page>
    </RequireCustomer>
  );
}
