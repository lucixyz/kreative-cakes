import { storefrontProducts } from "@cakeshop/database";
import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartButton } from "../../src/components/CartButton";
import { ProductTile } from "../../src/components/ProductTile";
import { Btn, heading } from "../../src/components/ui";
import { c } from "../../src/theme";

const OCCASIONS = [["Birthdays", "birthday"], ["Weddings", "wedding"], ["Anniversaries", "anniversary"], ["Corporate", "corporate"]] as const;
const STEPS = ["Describe your idea or upload an invitation", "Get a suggested cake design", "Customize it in 3D", "Our bakers review and quote it", "Order and celebrate"];

// PROTOTYPE home (see Design.pdf page 5). Photos are placeholders until real images exist.
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: c.cream }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32, gap: 24 }}>
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={heading(28)}>Kreative Cakes</Text>
          <CartButton />
        </View>
        <Pressable accessibilityRole="search" onPress={() => router.push("/shop")} style={{ minHeight: 52, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, justifyContent: "center", paddingHorizontal: 20 }}>
          <Text style={{ color: c.muted, fontSize: 16 }}>⌕  Search cakes</Text>
        </Pressable>
      </View>

      <View style={{ marginHorizontal: 20, borderRadius: 28, overflow: "hidden", backgroundColor: c.ink }}>
        <View style={{ height: 150, backgroundColor: "#E6DDD3", alignItems: "center", justifyContent: "center" }}><Text style={{ color: c.muted }}>Hero photo</Text></View>
        <View style={{ padding: 22, gap: 12 }}>
          <Text style={{ ...heading(34), color: "#fff" }}>Your Dream Cake, Designed With AI.</Text>
          <Text style={{ color: "#E0D5CD", fontSize: 16 }}>Describe it, see it in 3D, and our bakers make it real.</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn label="✧ Design with AI" variant="light" onPress={() => router.push("/ai-designer")} style={{ flex: 1 }} />
            <Pressable accessibilityRole="button" accessibilityLabel="Shop" onPress={() => router.push("/shop")} style={{ minHeight: 48, borderRadius: 999, borderWidth: 1, borderColor: "#FFFFFF66", paddingHorizontal: 22, justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Shop</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ ...heading(26), paddingHorizontal: 20 }}>Shop by occasion</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {OCCASIONS.map(([label, key], i) => (
            <Pressable key={key} accessibilityRole="button" onPress={() => router.push({ pathname: "/shop", params: { occasion: key } })} style={{ minHeight: 44, paddingHorizontal: 20, borderRadius: 999, justifyContent: "center", backgroundColor: i === 0 ? c.ink : "#fff", borderWidth: 1, borderColor: i === 0 ? c.ink : c.line }}>
              <Text style={{ color: i === 0 ? "#fff" : c.ink, fontWeight: "500", fontSize: 16 }}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", paddingHorizontal: 20 }}>
          <Text style={heading(26)}>Featured cakes</Text>
          <Link href="/shop" style={{ color: c.ink, textDecorationLine: "underline" }}>See all</Link>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
          {storefrontProducts.slice(0, 4).map((p) => <ProductTile key={p.id} product={p} width={210} />)}
        </ScrollView>
      </View>

      <View style={{ marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 24, borderWidth: 1, borderColor: c.line, padding: 22, gap: 12 }}>
        <Text style={heading(26)}>How it works</Text>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <Text style={{ ...heading(22), color: c.rose, width: 24 }}>{i + 1}</Text>
            <Text style={{ flex: 1, color: c.ink, fontSize: 16 }}>{s}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
