import { productListPrice, type StorefrontProduct } from "@cakeshop/database";
import { formatMoney } from "@cakeshop/utils";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { c, serif } from "../theme";
import { AvailabilityBadge, CakeThumb } from "./ui";

export const peso = (centavos: number) => formatMoney(centavos, { hideZeroCents: true });

export function ProductTile({ product, width }: { product: StorefrontProduct; width?: number }) {
  return (
    <Link href={{ pathname: "/product/[slug]", params: { slug: product.slug } }} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={product.name} style={{ width, backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.line, overflow: "hidden" }}>
        <CakeThumb product={product} />
        <View style={{ padding: 14, gap: 4 }}>
          <Text style={{ ...serif, fontSize: 19, color: c.ink }}>{product.name}</Text>
          <Text style={{ fontWeight: "600", color: c.ink }}>From {peso(productListPrice(product))}</Text>
          <AvailabilityBadge availability={product.availability} />
        </View>
      </Pressable>
    </Link>
  );
}
