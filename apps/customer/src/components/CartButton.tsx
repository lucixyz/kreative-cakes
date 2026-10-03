import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useCart } from "../cart/CartContext";
import { c } from "../theme";

export function CartButton() {
  const { units } = useCart();
  return (
    <Link href="/cart" asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={`Cart, ${units} items`} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="bag-handle-outline" size={22} color={c.ink} />
        {units > 0 ? <View style={{ position: "absolute", top: -2, right: -2, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: c.rose, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{units}</Text></View> : null}
      </Pressable>
    </Link>
  );
}
