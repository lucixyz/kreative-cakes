import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { c } from "../../src/theme";

const glyph = (g: string) => ({ color }: { color: ColorValue }) => <Text style={{ color, fontSize: 20 }}>{g}</Text>;

// Customer-facing routes. Five tabs (Home, Shop, Design, Orders, Profile); every other route is
// reachable but hidden from the tab bar (`href: null`), otherwise Expo Router would add it as a tab.
export default function CustomerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.ink, tabBarInactiveTintColor: c.muted, tabBarStyle: { backgroundColor: "#fff", borderTopColor: c.line } }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: glyph("⌂") }} />
      <Tabs.Screen name="shop" options={{ title: "Shop", tabBarIcon: glyph("▦") }} />
      <Tabs.Screen name="ai-designer" options={{ title: "Design", tabBarIcon: glyph("✧") }} />
      <Tabs.Screen name="orders" options={{ title: "Orders", tabBarIcon: glyph("▤") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: glyph("☺") }} />
      <Tabs.Screen name="cake-builder" options={{ href: null }} />
      <Tabs.Screen name="product/[slug]" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
    </Tabs>
  );
}
