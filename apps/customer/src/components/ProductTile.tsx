import { productListPrice, type StorefrontProduct } from "@cakeshop/database";
import { formatMoney } from "@cakeshop/utils";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { c, font, radius } from "../theme";
import { AvailabilityBadge, CakeThumb } from "./ui";

export const peso = (centavos: number) => formatMoney(centavos, { hideZeroCents: true });

/** A cake on the shelf with its price card hanging below it (same card as the website). */
export function ProductTile({ product, width }: { product: StorefrontProduct; width?: number }) {
  return (
    <Link href={{ pathname: "/product/[slug]", params: { slug: product.slug } }} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={`${product.name}, from ${peso(productListPrice(product))}`} style={{ width }}>
        <View style={{ borderRadius: radius.card, overflow: "hidden" }}><CakeThumb product={product} height={width ? width * 1.05 : 190} /></View>
        <View style={{ marginTop: -18, marginHorizontal: 8, backgroundColor: c.card, borderRadius: 4, borderWidth: 1, borderColor: c.stockLine, padding: 12, gap: 3 }}>
          <Text style={{ fontSize: 16, fontFamily: font.display, letterSpacing: -0.3, color: c.ink }}>{product.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
            <Text style={{ color: c.muted, fontSize: 13, fontFamily: font.body }}>From</Text>
            <Text style={{ fontFamily: font.price, fontSize: 28, lineHeight: 32, color: c.ink }}>{peso(productListPrice(product))}</Text>
          </View>
          <AvailabilityBadge availability={product.availability} />
        </View>
      </Pressable>
    </Link>
  );
}
