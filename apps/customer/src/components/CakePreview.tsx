import { Text, View } from "react-native";
import { serif } from "../theme";

export type CakeDesign = { tiers: 1 | 2 | 3 | 4; primary: string; secondary?: string; butterflies: boolean; flowers: boolean; message?: string };

const WIDTHS = [250, 186, 128, 84];
const HEIGHTS = [96, 84, 72, 60];
const GOLD = "#C9A24A";

/**
 * Placeholder preview built from plain views (no SVG/3D dependency). The real 3D renderer replaces
 * it later; it only needs the same CakeDesign values.
 */
export function CakePreview({ design, label }: { design: CakeDesign; label: string }) {
  const { tiers, primary, secondary = "#FFFFFF", butterflies, flowers, message } = design;
  const order = Array.from({ length: tiers }, (_, i) => i); // 0 = bottom
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ height: 330, backgroundColor: "#F6F3EE", borderRadius: 16, alignItems: "center", justifyContent: "flex-end", paddingBottom: 18 }}>
      {message ? <Text style={{ ...serif, fontStyle: "italic", color: GOLD, fontSize: 22, marginBottom: 8 }}>{message}</Text> : null}
      {[...order].reverse().map((i) => (
        <View key={i} style={{ width: WIDTHS[i]!, height: HEIGHTS[i]!, backgroundColor: i % 2 === 0 ? primary : secondary, borderRadius: 10, borderWidth: 1, borderColor: "#D9CFC6", justifyContent: "flex-end", overflow: "hidden" }}>
          <View style={{ height: 6, backgroundColor: GOLD, marginBottom: 6 }} />
          {butterflies ? (
            <View style={{ position: "absolute", top: HEIGHTS[i]! * 0.35, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" }}>
              {[0, 1].map((k) => <Wings key={k} />)}
            </View>
          ) : null}
          {flowers ? (
            <View style={{ position: "absolute", top: 4, left: 0, right: 0, flexDirection: "row", justifyContent: "space-evenly" }}>
              {[0, 1, 2].map((k) => <View key={k} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 3, borderColor: "#B85C78" }} />)}
            </View>
          ) : null}
        </View>
      ))}
      <View style={{ width: 290, height: 10, borderRadius: 5, backgroundColor: "#D9CFC6", marginTop: -2 }} />
    </View>
  );
}

/** Rough serving estimate shown next to the structure controls (prototype heuristic only). */
export const servesFor = (tiers: number) => [[10, 14], [20, 28], [50, 70], [80, 110]][tiers - 1]!.join("–");

/** PROTOTYPE estimate in whole pesos. The authoritative price comes from the bakery quotation. */
export const estimatePesos = (d: CakeDesign) => [2400, 4800, 7600, 10400][d.tiers - 1]! + (d.message ? 250 : 0) + (d.butterflies ? 360 : 0) + (d.flowers ? 360 : 0);

export const SWATCHES = [
  { id: "pink", name: "Pink", hex: "#F2C4CE" }, { id: "purple", name: "Purple", hex: "#CDB6E3" },
  { id: "blush", name: "Blush", hex: "#F3D9CF" }, { id: "sage", name: "Sage", hex: "#CBD8C3" },
] as const;

function Wings() {
  const wing = (deg: string) => ({ width: 12, height: 18, borderRadius: 9, backgroundColor: GOLD, transform: [{ rotate: deg }] });
  return <View style={{ flexDirection: "row", gap: 1 }}><View style={wing("-28deg")} /><View style={wing("28deg")} /></View>;
}
