import { Ionicons } from "@expo/vector-icons";
import { lineKey } from "@cakeshop/domain";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../src/cart/CartContext";
import { peso } from "../../src/components/ProductTile";
import { Btn, Stepper, heading } from "../../src/components/ui";
import { c } from "../../src/theme";

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lines, units, subtotal, setQty, remove } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState("");

  const header = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center" }}><Ionicons name="chevron-back" size={22} color={c.ink} /></Pressable>
      <Text style={{ ...heading(32), flex: 1 }}>Your cart</Text>
      <Text style={{ color: c.muted }}>{units} {units === 1 ? "item" : "items"}</Text>
    </View>
  );

  if (lines.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: c.cream, padding: 20, paddingTop: insets.top + 12, gap: 24 }}>
        {header}
        <View style={{ alignItems: "center", gap: 10, paddingVertical: 24 }}>
          <Text accessibilityRole="header" style={heading(28)}>Your cart is empty</Text>
          <Text style={{ color: c.muted, fontSize: 16, textAlign: "center" }}>Add a ready-made cake, or design your own.</Text>
        </View>
        <Btn label="Browse cakes" onPress={() => router.replace("/shop")} />
        <Btn label="Design a cake" variant="ghost" onPress={() => router.replace("/ai-designer")} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, gap: 14 }} keyboardShouldPersistTaps="handled">
        {header}
        {lines.map((l) => {
          const key = lineKey(l);
          return (
            <View key={key} style={{ flexDirection: "row", gap: 14, backgroundColor: "#fff", borderRadius: 18, borderWidth: 1, borderColor: c.line, padding: 14 }}>
              <View style={{ width: 84, height: 84, borderRadius: 14, backgroundColor: l.tone }} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                  <Text style={{ flex: 1, fontWeight: "600", fontSize: 17, color: c.ink }}>{l.name}</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${l.name}`} onPress={() => remove(key)} hitSlop={10}><Ionicons name="trash-outline" size={20} color={c.ink} /></Pressable>
                </View>
                <Text style={{ color: c.muted }}>{l.sizeLabel} · {l.flavor}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <Text style={{ fontWeight: "700", fontSize: 18 }}>{peso(l.unitPriceCentavos * l.quantity)}</Text>
                  <Stepper value={l.quantity} onChange={(q) => setQty(key, q)} />
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ backgroundColor: "#ECE6DF", borderRadius: 14, padding: 16 }}>
          <Text style={{ color: c.muted, fontSize: 15, lineHeight: 22 }}>Designing a custom cake? Custom cakes are reviewed and quoted by our bakers, then paid separately from your cart.</Text>
        </View>

        <Text style={{ fontWeight: "600" }}>Promo code</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput accessibilityLabel="Promo code" placeholder="Enter code" placeholderTextColor={c.muted} value={promo} onChangeText={setPromo} autoCapitalize="characters" style={{ flex: 1, minHeight: 52, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, paddingHorizontal: 20, fontSize: 16 }} />
          <Btn label="Apply" variant="ghost" onPress={() => setPromoMsg(promo.trim() ? "Promo codes aren’t available yet." : "")} />
        </View>
        {promoMsg ? <Text accessibilityRole="alert" style={{ color: c.muted }}>{promoMsg}</Text> : null}
      </ScrollView>

      <View style={{ backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: c.line, padding: 20, paddingBottom: insets.bottom + 16, gap: 8 }}>
        <Row label="Subtotal" value={peso(subtotal)} />
        <Row label="Delivery" value="Calculated at checkout" muted />
        <View style={{ borderTopWidth: 1, borderTopColor: c.line, paddingTop: 10 }}><Row label="Total" value={peso(subtotal)} big /></View>
        <Btn label="Checkout" onPress={() => router.push("/checkout")} />
      </View>
    </View>
  );
}

function Row({ label, value, muted, big }: { label: string; value: string; muted?: boolean; big?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontSize: big ? 22 : 16, fontWeight: big ? "700" : "400", color: muted ? c.muted : c.ink }}>{label}</Text>
      <Text style={{ fontSize: big ? 22 : 16, fontWeight: big ? "700" : "400", color: muted ? c.muted : c.ink }}>{value}</Text>
    </View>
  );
}
