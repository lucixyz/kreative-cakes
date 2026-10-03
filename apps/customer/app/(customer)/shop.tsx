import { storefrontProducts } from "@cakeshop/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { CartButton } from "../../src/components/CartButton";
import { ShopBar } from "../../src/components/kit";
import { ProductTile } from "../../src/components/ProductTile";
import { heading } from "../../src/components/ui";
import { MIN_TOUCH, c, font, radius } from "../../src/theme";

const OCCASIONS = [["Birthday", "birthday"], ["Wedding", "wedding"], ["Anniversary", "anniversary"], ["Corporate", "corporate"]] as const;

export default function Shop() {
  const params = useLocalSearchParams<{ occasion?: string }>();
  const router = useRouter();
  const [q, setQ] = useState("");
  const occasion = params.occasion;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return storefrontProducts.filter((p) => (!occasion || p.occasion === occasion) && (needle === "" || `${p.name} ${p.label} ${p.flavors.join(" ")}`.toLowerCase().includes(needle)));
  }, [q, occasion]);

  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ShopBar right={<CartButton />} />
      <ScrollView contentContainerStyle={{ paddingTop: 20, paddingBottom: 32, paddingHorizontal: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={heading(30)}>Shop cakes</Text>
        <TextInput accessibilityLabel="Search cakes" placeholder="Search cakes" placeholderTextColor={c.muted} value={q} onChangeText={setQ} style={{ minHeight: MIN_TOUCH + 4, borderRadius: radius.control, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, paddingHorizontal: 16, fontSize: 16, fontFamily: font.body, color: c.ink }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {[["All", undefined] as const, ...OCCASIONS].map(([label, key]) => {
            const on = occasion === key;
            return (
              <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => router.setParams({ occasion: key })} style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: radius.control, justifyContent: "center", backgroundColor: on ? c.ink : "#fff", borderWidth: 1, borderColor: on ? c.ink : c.line }}>
                <Text style={{ color: on ? "#fff" : c.ink, fontFamily: font.bodyBold }}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={{ color: c.muted, fontFamily: font.body }}>{results.length} {results.length === 1 ? "cake" : "cakes"}</Text>
        {results.length === 0 ? <Text style={{ color: c.muted, fontSize: 16 }}>No cakes match that. Try another word, or design one in the AI Designer.</Text> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
          {results.map((p) => <View key={p.id} style={{ width: "47.5%" }}><ProductTile product={p} /></View>)}
        </View>
      </ScrollView>
    </View>
  );
}
