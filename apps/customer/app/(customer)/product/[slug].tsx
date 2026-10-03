import { Ionicons } from "@expo/vector-icons";
import { defaultProductSize, findStorefrontProduct } from "@cakeshop/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../../src/cart/CartContext";
import { peso } from "../../../src/components/ProductTile";
import { AvailabilityBadge, Btn, CakeThumb, Stepper, heading } from "../../../src/components/ui";
import { c, font } from "../../../src/theme";

const roundBtn = { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" } as const;

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const product = findStorefrontProduct(slug ?? "");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(product ? defaultProductSize(product).id : "");
  const [flavor, setFlavor] = useState(product?.flavors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: c.cream, padding: 24, paddingTop: insets.top + 24, gap: 12 }}>
        <Text style={heading(28)}>Cake not found</Text>
        <Btn label="Back to shop" onPress={() => router.replace("/shop")} />
      </View>
    );
  }

  const size = product.sizes.find((s) => s.id === sizeId) ?? defaultProductSize(product);
  const soldOut = product.availability.kind === "soldout";
  const total = size.priceCentavos * qty;
  const addToCart = () => {
    add({ productId: product.id, sizeId: size.id, flavor, name: product.name, sizeLabel: size.label, tone: product.look.tone, unitPriceCentavos: size.priceCentavos, quantity: qty });
    setAdded(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <CakeThumb product={product} height={300} />
          <View style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/shop"))} style={roundBtn}><Ionicons name="chevron-back" size={22} color={c.ink} /></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Favorite" accessibilityState={{ selected: fav }} onPress={() => setFav(!fav)} style={roundBtn}><Ionicons name={fav ? "heart" : "heart-outline"} size={22} color={fav ? "#C2334F" : c.ink} /></Pressable>
          </View>
        </View>

        <View style={{ padding: 20, gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: c.muted, letterSpacing: 1, fontSize: 12 }}>{product.label}</Text>
            <AvailabilityBadge availability={product.availability} />
          </View>
          <Text style={heading(34)}>{product.name}</Text>
          <Text style={{ fontFamily: font.price, fontSize: 40, lineHeight: 44, color: c.ink }}>{peso(size.priceCentavos)}</Text>
          <Text style={{ color: c.muted, fontSize: 16, lineHeight: 24 }}>{product.description}</Text>

          <Text style={{ fontWeight: "600", fontSize: 16 }}>Size</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {product.sizes.map((s) => {
              const on = s.id === size.id;
              return (
                <Pressable key={s.id} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setSizeId(s.id)} style={{ flex: 1, minHeight: 56, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 6, backgroundColor: on ? c.ink : "#fff", borderWidth: 1.5, borderColor: on ? c.ink : "#D3C8BC" }}>
                  <Text style={{ fontWeight: "600", color: on ? "#fff" : c.ink }}>{s.label}</Text>
                  <Text style={{ fontSize: 12, color: on ? "#D9CFC6" : c.muted }}>{s.serves}</Text>
                </Pressable>
              );
            })}
          </View>

          {product.flavors.length > 1 ? (
            <>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Flavor</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {product.flavors.map((f) => {
                  const on = f === flavor;
                  return (
                    <Pressable key={f} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setFlavor(f)} style={{ minHeight: 44, paddingHorizontal: 20, borderRadius: 999, justifyContent: "center", backgroundColor: on ? c.ink : "#fff", borderWidth: 1.5, borderColor: on ? c.ink : "#D3C8BC" }}>
                      <Text style={{ color: on ? "#fff" : c.ink, fontSize: 16 }}>{f}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "600", fontSize: 18 }}>Quantity</Text>
            <Stepper value={qty} onChange={setQty} />
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: c.line, paddingTop: 14, gap: 4 }}>
            <Text style={{ fontWeight: "600", fontSize: 17 }}>Allergens</Text>
            <Text style={{ color: c.muted, fontSize: 15, lineHeight: 22 }}>{product.allergens}</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: c.line, paddingTop: 14, gap: 4 }}>
            <Text style={{ fontWeight: "600", fontSize: 17 }}>Pickup or delivery</Text>
            <Text style={{ color: c.muted, fontSize: 15 }}>Pick up today, or choose delivery at checkout.</Text>
          </View>
          {added ? <Pressable accessibilityRole="link" onPress={() => router.push("/cart")}><Text accessibilityRole="alert" style={{ color: c.green, textDecorationLine: "underline" }}>Added to your cart. View cart</Text></Pressable> : null}
        </View>
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: c.line }}>
        <View>
          <Text style={{ color: c.muted, fontSize: 13 }}>Total</Text>
          <Text style={{ fontSize: 22, fontWeight: "700", color: c.ink }}>{peso(total)}</Text>
        </View>
        <Btn label={soldOut ? "Sold out today" : "Add to cart"} disabled={soldOut} onPress={addToCart} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
