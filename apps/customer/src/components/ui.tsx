import { MAX_LINE_QUANTITY } from "@cakeshop/domain";
import type { Availability, StorefrontProduct } from "@cakeshop/database";
import type { ReactNode } from "react";
import { Image, Pressable, Text, View, type ViewStyle } from "react-native";
import { cakeImage } from "../assets";
import { MIN_TOUCH, c, font, radius, serif } from "../theme";

export function Btn({ label, onPress, variant = "dark", disabled = false, style, children }: { label: string; onPress: () => void; variant?: "dark" | "ghost" | "light"; disabled?: boolean; style?: ViewStyle; children?: ReactNode }) {
  const bg = variant === "dark" ? c.rose : variant === "light" ? "#fff" : "transparent";
  const fg = variant === "dark" ? "#fff" : variant === "light" ? c.roseDark : c.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[{ minHeight: MIN_TOUCH, borderRadius: radius.control, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: bg, borderWidth: variant === "ghost" ? 1 : 0, borderColor: "#CFC4B8", opacity: disabled ? 0.5 : 1 }, style]}
    >
      {children}
      <Text style={{ color: fg, fontFamily: font.bodyBold, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

export function availabilityText(a: Availability): string {
  if (a.kind === "today") return "Here today";
  if (a.kind === "soldout") return "Sold out today";
  return `Order ${a.days} ${a.days === 1 ? "day" : "days"} ahead`;
}

/** Tape on the price card: green here today, amber pre-order with the days written out, grey sold out. */
export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const sold = availability.kind === "soldout";
  const today = availability.kind === "today";
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: today ? c.greenBg : sold ? c.soldBg : c.preBg, borderRadius: radius.tape, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ fontSize: 13, fontFamily: font.bodyBold, color: today ? c.green : sold ? c.soldText : c.preText }}>{availabilityText(availability)}</Text>
    </View>
  );
}

export function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  const step = (label: string, delta: number, off: boolean) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={off} onPress={() => onChange(value + delta)} style={{ width: MIN_TOUCH, height: MIN_TOUCH, alignItems: "center", justifyContent: "center", opacity: off ? 0.35 : 1 }}>
      <Text style={{ fontSize: 22, color: c.ink }}>{delta < 0 ? "−" : "+"}</Text>
    </Pressable>
  );
  return (
    <View accessibilityLabel={`Quantity ${value}`} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#D3C8BC", borderRadius: radius.control, backgroundColor: "#fff" }}>
      {step("Decrease quantity", -1, value <= min)}
      <Text style={{ minWidth: 28, textAlign: "center", fontFamily: font.bodyBold, fontSize: 16 }}>{value}</Text>
      {step("Increase quantity", 1, value >= MAX_LINE_QUANTITY)}
    </View>
  );
}

/** The cake on the shelf. An illustration (labeled) until real product photos replace the PNGs in assets/images. */
export function CakeThumb({ product, height = 200, label = true }: { product: Pick<StorefrontProduct, "slug" | "name" | "look">; height?: number; label?: boolean }) {
  const source = cakeImage(product.slug);
  return (
    <View style={{ height, backgroundColor: product.look.tone, overflow: "hidden" }}>
      {source ? <Image source={source} accessibilityLabel={product.name} resizeMode="cover" style={{ width: "100%", height: "100%", transform: [{ scale: 1.08 }] }} /> : null}
      {label ? <Text style={{ position: "absolute", left: 8, bottom: 6, fontSize: 11, color: c.muted, backgroundColor: "#FFFFFFB3", paddingHorizontal: 6, borderRadius: 2 }}>Illustration</Text> : null}
    </View>
  );
}

export const heading = (size: number) => ({ ...serif, fontSize: size, color: c.ink });
