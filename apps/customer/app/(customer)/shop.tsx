import { storefrontProducts } from "@cakeshop/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartButton } from "../../src/components/CartButton";
import { ProductTile } from "../../src/components/ProductTile";
import { heading } from "../../src/components/ui";
import { MIN_TOUCH, c } from "../../src/theme";

const OCCASIONS = [["Birthday", "birthday"], ["Wedding", "wedding"], ["Anniversary", "anniversary"], ["Corporate", "corporate"]] as const;

export default function Shop() {
  const params = useLocalSearchParams<{ occasion?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const occasion = params.occasion;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return storefrontProducts.filter((p) => (!occasion || p.occasion === occasion) && (needle === "" || `${p.name} ${p.label} ${p.flavors.join(" ")}`.toLowerCase().includes(needle)));
  }, [q, occasion]);

  return (
    <ScrollView style={{ backgroundColor: c.cream }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32, paddingHorizontal: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={heading(30)}>Shop cakes</Text>
        <CartButton />
      </View>
      <TextInput accessibilityLabel="Search cakes" placeholder="Search cakes" placeholderTextColor={c.muted} value={q} onChangeText={setQ} style={{ minHeight: MIN_TOUCH + 4, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, paddingHorizontal: 20, fontSize: 16, color: c.ink }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {[["All", undefined] as const, ...OCCASIONS].map(([label, key]) => {
          const on = occasion === key;
          return (
            <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => router.setParams({ occasion: key })} style={{ minHeight: 40, paddingHorizontal: 18, borderRadius: 999, justifyContent: "center", backgroundColor: on ? c.ink : "#fff", borderWidth: 1, borderColor: on ? c.ink : c.line }}>
              <Text style={{ color: on ? "#fff" : c.ink }}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text style={{ color: c.muted }}>{results.length} {results.length === 1 ? "cake" : "cakes"}</Text>
      {results.map((p) => <ProductTile key={p.id} product={p} />)}
    </ScrollView>
  );
}
