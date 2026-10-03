import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { CakePreview, SWATCHES, estimatePesos, type CakeDesign } from "../../src/components/CakePreview";
import { BackHeader, Card, Chip, Page, Swatch, ToggleRow, useToast } from "../../src/components/kit";
import { Btn, heading } from "../../src/components/ui";
import { c } from "../../src/theme";

const OCCASIONS = ["Birthday", "Wedding", "Anniversary", "Corporate"];
const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

/** DEMO ONLY: reads a few keywords from the prompt. The real AI provider replaces this later. */
function designFromPrompt(prompt: string): CakeDesign {
  const p = prompt.toLowerCase();
  const swatch = SWATCHES.find((s) => p.includes(s.id)) ?? SWATCHES[0];
  const tiers = /wedding|three|3[- ]tier|tall/.test(p) ? 3 : /two|2[- ]tier/.test(p) ? 2 : /small|mini|single|one/.test(p) ? 1 : 3;
  return { tiers: tiers as CakeDesign["tiers"], primary: swatch.hex, butterflies: /butterfl/.test(p) || !/flower|floral/.test(p), flowers: /flower|floral|rose/.test(p), message: /18/.test(p) ? "Happy 18th" : undefined };
}

export default function AiDesigner() {
  const router = useRouter();
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [guests, setGuests] = useState("60");
  const [design, setDesign] = useState<CakeDesign | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const generate = () => {
    if (!prompt.trim()) {
      toast.show("Describe your cake first");
      return;
    }
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDesign(designFromPrompt(prompt));
      setLoading(false);
      toast.show("New design ready");
    }, 1200);
  };
  const patch = (p: Partial<CakeDesign>) => design && setDesign({ ...design, ...p });

  return (
    <View style={{ flex: 1 }}>
      <Page>
        <BackHeader title="AI Designer" />
        <Card>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>What cake are you imagining?</Text>
          <TextInput accessibilityLabel="Describe your cake" multiline numberOfLines={4} placeholder="e.g. An elegant three-tier cake for an 18th birthday. The theme is butterflies. Use pink, white and gold." placeholderTextColor={c.muted} value={prompt} onChangeText={setPrompt} style={{ minHeight: 110, textAlignVertical: "top", borderWidth: 1, borderColor: "#D3C9BE", borderRadius: 14, padding: 12, fontSize: 16, color: c.ink, lineHeight: 22 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {OCCASIONS.map((o) => <Chip key={o} label={o} selected={occasion === o} onPress={() => setOccasion(o)} />)}
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: "500" }}>Guests</Text>
            <TextInput accessibilityLabel="Number of guests" keyboardType="number-pad" value={guests} onChangeText={(v) => setGuests(v.replace(/\D/g, "").slice(0, 4))} style={{ minHeight: 48, borderWidth: 1, borderColor: "#D3C9BE", borderRadius: 12, paddingHorizontal: 12, fontSize: 16, color: c.ink }} />
          </View>
          <Btn label="Add inspiration image" variant="ghost" onPress={() => toast.show("Image upload isn’t connected yet")} />
          <Btn label={loading ? "Designing…" : design ? "Generate again" : "Generate design"} disabled={loading} onPress={generate} />
        </Card>

        {loading ? (
          <Card><View accessibilityRole="progressbar" accessibilityLabel="Designing your cake" style={{ height: 300, alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Text style={{ fontWeight: "600", fontSize: 16 }}>Designing your cake…</Text>
            <View style={{ width: 180, height: 6, borderRadius: 3, backgroundColor: "#E9E3DC", overflow: "hidden" }}><View style={{ width: "60%", height: 6, backgroundColor: "#9C4257" }} /></View>
            <Text style={{ color: c.muted, textAlign: "center" }}>Reading your theme, colors and guest count.</Text>
          </View></Card>
        ) : design ? (
          <>
            <Card>
              <CakePreview design={design} label={`${design.tiers}-tier cake concept`} />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {[occasion, `${design.tiers} tiers`, `${guests || "—"} guests`].map((t) => <View key={t} style={{ backgroundColor: "#F1ECE5", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}><Text style={{ fontSize: 12 }}>{t}</Text></View>)}
              </View>
            </Card>
            <Card>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Main color · {SWATCHES.find((s) => s.hex === design.primary)?.name}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>{SWATCHES.map((s) => <Swatch key={s.id} name={s.name} hex={s.hex} selected={design.primary === s.hex} onPress={() => patch({ primary: s.hex })} />)}</View>
              <ToggleRow label="Gold butterflies × 8" value={design.butterflies} onChange={(v) => patch({ butterflies: v })} />
              <ToggleRow label="Sugar flowers × 6" value={design.flowers} onChange={(v) => patch({ flowers: v })} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", borderTopWidth: 1, borderTopColor: c.line, paddingTop: 12 }}>
                <Text style={{ color: c.muted }}>Estimated price</Text><Text style={{ ...heading(26), fontWeight: "600" }}>{peso(estimatePesos(design))}</Text>
              </View>
              <Text style={{ fontSize: 12, lineHeight: 18, color: c.muted }}>AI-generated concept. Final design, availability and pricing are subject to bakery approval.</Text>
            </Card>
            <Btn label="Customize in 3D" onPress={() => router.push("/cake-builder")} />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Btn label="Save design" variant="ghost" style={{ flex: 1 }} onPress={() => toast.show("Saved to your designs")} />
              <Btn label="Submit for review" style={{ flex: 1, backgroundColor: "#9C4257" }} onPress={() => router.push("/orders")} />
            </View>
          </>
        ) : (
          <Card><Text style={{ color: c.muted, lineHeight: 22 }}>Describe the occasion, theme and colors. We’ll sketch a concept you can fine-tune, then our bakers review it before you pay.</Text></Card>
        )}
      </Page>
      {toast.node}
    </View>
  );
}
