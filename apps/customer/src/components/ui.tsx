import { MAX_LINE_QUANTITY } from "@cakeshop/domain";
import type { Availability, StorefrontProduct } from "@cakeshop/database";
import type { ReactNode } from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import { MIN_TOUCH, c, serif } from "../theme";

export function Btn({ label, onPress, variant = "dark", disabled = false, style, children }: { label: string; onPress: () => void; variant?: "dark" | "ghost" | "light"; disabled?: boolean; style?: ViewStyle; children?: ReactNode }) {
  const bg = variant === "dark" ? c.ink : variant === "light" ? "#fff" : "transparent";
  const fg = variant === "dark" ? "#fff" : c.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[{ minHeight: MIN_TOUCH, borderRadius: 999, paddingHorizontal: 22, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: bg, borderWidth: variant === "ghost" ? 1 : 0, borderColor: "#CFC4B8", opacity: disabled ? 0.5 : 1 }, style]}
    >
      {children}
      <Text style={{ color: fg, fontWeight: "600", fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

export function availabilityText(a: Availability): string {
  if (a.kind === "today") return "Available today";
  if (a.kind === "soldout") return "Sold out today";
  return `Pre-order · ${a.days} ${a.days === 1 ? "day" : "days"}`;
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const sold = availability.kind === "soldout";
  const today = availability.kind === "today";
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: today ? c.greenBg : sold ? c.soldBg : c.preBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ fontSize: 12, color: today ? c.green : sold ? c.soldText : c.ink }}>{availabilityText(availability)}</Text>
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
    <View accessibilityLabel={`Quantity ${value}`} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#D3C8BC", borderRadius: 999, backgroundColor: "#fff" }}>
      {step("Decrease quantity", -1, value <= min)}
      <Text style={{ minWidth: 28, textAlign: "center", fontWeight: "600", fontSize: 16 }}>{value}</Text>
      {step("Increase quantity", 1, value >= MAX_LINE_QUANTITY)}
    </View>
  );
}

/** Placeholder illustration (stacked tiers on a plate) until real product photos exist. */
export function CakeThumb({ product, height = 150 }: { product: Pick<StorefrontProduct, "look">; height?: number }) {
  const { tiers, color, tone } = product.look;
  const tierH = height / 4.2;
  return (
    <View style={{ height, backgroundColor: tone, alignItems: "center", justifyContent: "flex-end", paddingBottom: height * 0.12 }}>
      {Array.from({ length: tiers }, (_, i) => tiers - 1 - i).map((i) => (
        <View key={i} style={{ width: tierH * (3.1 - i * 0.7), height: tierH, backgroundColor: color, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomWidth: 3, borderBottomColor: "#0000001A" }} />
      ))}
      <View style={{ width: tierH * 4, height: 8, borderRadius: 4, backgroundColor: "#FFFAF8" }} />
    </View>
  );
}

export const heading = (size: number) => ({ ...serif, fontSize: size, color: c.ink });
