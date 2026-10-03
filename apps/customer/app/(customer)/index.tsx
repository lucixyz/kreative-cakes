import { storefrontProducts } from "@cakeshop/database";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CartButton } from "../../src/components/CartButton";
import { ShopBar } from "../../src/components/kit";
import { ProductTile } from "../../src/components/ProductTile";
import { Btn, heading } from "../../src/components/ui";
import { c, font, radius } from "../../src/theme";

const OCCASIONS = [["Birthdays", "birthday"], ["Weddings", "wedding"], ["Anniversaries", "anniversary"], ["Corporate", "corporate"]] as const;
const STEPS = ["Describe your idea or upload an invitation", "Get a suggested cake design", "Customize it in 3D", "Our bakers review and quote it", "Order and celebrate"];
const shelf = (from: number) => storefrontProducts.slice(from, from + 2);

// Home is the shop window: a sign, then the glass display case with today's cakes.
export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ShopBar right={<CartButton />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32, gap: 24 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 14 }}>
          <Text accessibilityRole="header" style={{ ...heading(40), lineHeight: 42 }}>Fresh cakes, or design your own.</Text>
          <Text style={{ color: c.muted, fontSize: 16, lineHeight: 23, fontFamily: font.body }}>Pick a ready-made cake, or describe your celebration and our bakers review and quote it before you pay.</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Btn label="Design Your Cake" onPress={() => router.push("/ai-designer")} style={{ flex: 1 }} />
            <Btn label="Shop Cakes" variant="ghost" onPress={() => router.push("/shop")} />
          </View>
        </View>

        <View style={{ marginHorizontal: 16, backgroundColor: c.rose, borderWidth: 6, borderColor: "#B9C1C5", borderRadius: 12, paddingTop: 20, paddingHorizontal: 12 }}>
          {[shelf(0), shelf(2)].map((row, i) => (
            <View key={i} style={{ paddingBottom: 18, borderBottomWidth: 10, borderBottomColor: "#FFFFFF59", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>{row.map((p) => <View key={p.id} style={{ flex: 1 }}><ProductTile product={p} /></View>)}</View>
            </View>
          ))}
          <Link href="/shop" asChild>
            <Pressable accessibilityRole="link" style={{ minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <Text style={{ color: "#fff", fontFamily: font.bodyBold }}>See every cake</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </Pressable>
          </Link>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ ...heading(26), paddingHorizontal: 20 }}>Shop by occasion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {OCCASIONS.map(([label, key]) => (
              <Pressable key={key} accessibilityRole="button" onPress={() => router.push({ pathname: "/shop", params: { occasion: key } })} style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: radius.control, justifyContent: "center", backgroundColor: c.card, borderWidth: 1, borderColor: c.stockLine }}>
                <Text style={{ color: c.ink, fontFamily: font.bodyBold, fontSize: 15 }}>{label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginHorizontal: 20, backgroundColor: c.card, borderRadius: radius.card, borderWidth: 1, borderColor: c.stockLine, padding: 20, gap: 12 }}>
          <Text style={heading(24)}>How a custom cake works</Text>
          {STEPS.map((s, i) => (
            <View key={s} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <Text style={{ fontFamily: font.price, fontSize: 30, lineHeight: 30, color: c.rose, width: 24 }}>{i + 1}</Text>
              <Text style={{ flex: 1, color: c.ink, fontSize: 16, fontFamily: font.body }}>{s}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
