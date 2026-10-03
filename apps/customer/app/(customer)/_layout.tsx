import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";
import { c, font } from "../../src/theme";

const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color }: { color: ColorValue }) => <Ionicons name={name} size={22} color={color} />;

// Customer-facing routes. Five tabs (Home, Shop, Design, Orders, Profile); every other route is
// reachable but hidden from the tab bar (`href: null`), otherwise Expo Router would add it as a tab.
export default function CustomerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: c.rose, tabBarInactiveTintColor: c.muted, tabBarLabelStyle: { fontFamily: font.bodyBold, fontSize: 11 }, tabBarStyle: { backgroundColor: c.card, borderTopColor: c.stockLine } }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("home-outline") }} />
      <Tabs.Screen name="shop" options={{ title: "Shop", tabBarIcon: icon("grid-outline") }} />
      <Tabs.Screen name="ai-designer" options={{ title: "Design", tabBarIcon: icon("sparkles-outline") }} />
      <Tabs.Screen name="orders" options={{ title: "Orders", tabBarIcon: icon("receipt-outline") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: icon("person-outline") }} />
      <Tabs.Screen name="cake-builder" options={{ href: null }} />
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="order/[id]" options={{ href: null }} />
      <Tabs.Screen name="order-confirmed" options={{ href: null }} />
      <Tabs.Screen name="product/[slug]" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
    </Tabs>
  );
}
