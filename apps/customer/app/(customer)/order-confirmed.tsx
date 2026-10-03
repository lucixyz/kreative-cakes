import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Card, Page } from "../../src/components/kit";
import { Btn, heading } from "../../src/components/ui";
import { peso } from "../../src/components/ProductTile";
import { c } from "../../src/theme";

const METHODS: Record<string, string> = { gcash: "GCash", maya: "Maya", card: "card", online_banking: "online banking" };

// PROTOTYPE confirmation: no payment is taken and nothing reaches the bakery until the API exists.
export default function OrderConfirmed() {
  const router = useRouter();
  const { ref, total, mode, method } = useLocalSearchParams<{ ref?: string; total?: string; mode?: string; method?: string }>();
  const amount = Number(total);
  return (
    <Page footer={<><Btn label="Track my order" onPress={() => router.replace("/orders")} /><Btn label="Continue shopping" variant="ghost" onPress={() => router.replace("/shop")} /></>}>
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 24 }}>
        <View accessibilityElementsHidden style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.greenBg, alignItems: "center", justifyContent: "center" }}><Ionicons name="checkmark" size={38} color={c.green} /></View>
        <Text accessibilityRole="header" style={{ ...heading(34), textAlign: "center" }}>Order confirmed</Text>
        <Text style={{ color: c.muted, textAlign: "center", fontSize: 16, lineHeight: 23 }}>
          {ref ?? "Your order"} was recorded{method && METHODS[method] ? ` for ${METHODS[method]}` : ""}. This is a prototype: no payment was taken and nothing was sent to the bakery yet.
        </Text>
      </View>
      <Card>
        {[["Handover", mode === "pickup" ? "Pickup" : "Delivery"], ["Total", Number.isFinite(amount) && amount > 0 ? peso(amount) : "—"]].map(([k, v]) => (
          <View key={k} style={{ flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: c.muted }}>{k}</Text><Text style={{ fontWeight: "600" }}>{v}</Text></View>
        ))}
      </Card>
    </Page>
  );
}
