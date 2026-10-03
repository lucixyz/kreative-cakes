import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MIN_TOUCH, c, font } from "../theme";
import { heading } from "./ui";

const AWNING_PINK = "#F0CDD6";

/** Scalloped awning hung under the shop bar: rose and pink half circles under a striped top edge. */
export function Awning() {
  const [width, setWidth] = useState(390);
  const count = Math.ceil(width / 40) + 1;
  const tone = (i: number) => (i % 2 === 0 ? c.rose : AWNING_PINK);
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height: 26, overflow: "hidden" }}>
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: count }, (_, i) => <View key={i} style={{ width: 40, height: 6, backgroundColor: tone(i) }} />)}
      </View>
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: count }, (_, i) => <View key={i} style={{ width: 40, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: tone(i) }} />)}
      </View>
    </View>
  );
}

/** Top bar for the tab screens: rose bar with the wordmark and cart, and the awning below it. */
export function ShopBar({ right }: { right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={{ backgroundColor: c.roseDark, paddingTop: insets.top + 10, paddingBottom: 12, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text accessibilityRole="header" style={{ color: "#fff", fontFamily: font.display, fontSize: 24, letterSpacing: -0.6 }}>Kreative Cakes</Text>
        {right}
      </View>
      <Awning />
    </View>
  );
}

/** Round back button + serif title, shared by the pushed screens. */
export function BackHeader({ title, subtitle, right, fallback = "/" }: { title: string; subtitle?: string; right?: ReactNode; fallback?: string }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback as never))} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", borderWidth: 1, borderColor: c.line, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="chevron-back" size={22} color={c.ink} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text accessibilityRole="header" style={heading(30)}>{title}</Text>
        {subtitle ? <Text style={{ color: c.muted, fontSize: 13 }}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/** Scrolling screen with safe-area padding and a toast slot. */
export function Page({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.cream }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 32, gap: 14 }}>{children}</ScrollView>
      {footer ? <View style={{ backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: c.line, padding: 20, paddingBottom: insets.bottom + 16, gap: 10 }}>{footer}</View> : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[{ backgroundColor: c.card, borderRadius: 8, borderWidth: 1, borderColor: c.stockLine, padding: 16, gap: 12 }, style]}>{children}</View>;
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: 10, justifyContent: "center", backgroundColor: selected ? c.ink : "#fff", borderWidth: 1, borderColor: selected ? c.ink : "#D3C8BC" }}>
      <Text style={{ color: selected ? "#fff" : c.ink, fontWeight: selected ? "600" : "400", fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Swatch({ name, hex, selected, onPress }: { name: string; hex: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityState={{ selected }} onPress={onPress} style={{ width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: 24, backgroundColor: hex, borderWidth: selected ? 3 : 1, borderColor: selected ? c.ink : "#D3C8BC" }} />
  );
}

/** Row with a native-feeling toggle (accessible switch). */
export function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label} onPress={() => onChange(!value)} style={{ minHeight: MIN_TOUCH, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#F1ECE5" }}>
      <Text style={{ fontSize: 16, color: c.ink }}>{label}</Text>
      <View style={{ width: 50, height: 30, borderRadius: 15, backgroundColor: value ? "#6E8B5E" : "#CFC5BA", padding: 3, alignItems: value ? "flex-end" : "flex-start" }}>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff" }} />
      </View>
    </Pressable>
  );
}

export const STATUS_TONE = {
  scheduled: { bg: "#E3ECF5", fg: "#23466B" }, review: { bg: "#F6EBD9", fg: "#6A4A12" }, ready: { bg: "#E5EBDF", fg: "#3E5233" },
  done: { bg: "#EEEAE4", fg: "#4A3F38" }, cancelled: { bg: "#F3E3E6", fg: "#7A2E3F" },
} as const;
export type StatusTone = keyof typeof STATUS_TONE;

export function StatusPill({ tone, label }: { tone: StatusTone; label: string }) {
  const t = STATUS_TONE[tone];
  return (
    <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: t.bg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.fg }} />
      <Text style={{ color: t.fg, fontWeight: "600", fontSize: 13 }}>{label}</Text>
    </View>
  );
}

/** Polite, auto-dismissing toast. Render `node` last inside the screen's root View. */
export function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2600);
  }, []);
  const node = msg ? (
    <View accessibilityLiveRegion="polite" pointerEvents="none" style={{ position: "absolute", left: 20, right: 20, bottom: 96, alignItems: "center" }}>
      <View style={{ backgroundColor: c.ink, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}><Text style={{ color: "#fff", fontSize: 14 }}>{msg}</Text></View>
    </View>
  ) : null;
  return { show, node };
}
