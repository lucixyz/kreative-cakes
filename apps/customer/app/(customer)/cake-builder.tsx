import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { CakePreview, SWATCHES, estimatePesos, servesFor, type CakeDesign } from "../../src/components/CakePreview";
import { BackHeader, Card, Chip, Page, Swatch, ToggleRow, useToast } from "../../src/components/kit";
import { Btn, heading } from "../../src/components/ui";
import { c } from "../../src/theme";

type Tab = "structure" | "colors" | "decor" | "flavor" | "topper";
const TABS: [Tab, string][] = [["structure", "Structure"], ["colors", "Colors"], ["decor", "Decor"], ["flavor", "Flavor"], ["topper", "Topper"]];
const FLAVORS = ["Vanilla chiffon · strawberry cream", "Chocolate · ganache", "Ube · macapuno"];
const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

export default function CakeBuilder() {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("structure");
  const [design, setDesign] = useState<CakeDesign>({ tiers: 3, primary: SWATCHES[1].hex, butterflies: true, flowers: true, message: "Happy 18th" });
  const [flavor, setFlavor] = useState(FLAVORS[0]!);
  const patch = (p: Partial<CakeDesign>) => setDesign({ ...design, ...p });

  return (
    <View style={{ flex: 1 }}>
      <Page footer={
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text style={{ color: c.muted }}>Estimate</Text><Text style={{ ...heading(26), fontWeight: "600" }}>{peso(estimatePesos(design))}</Text>
          </View>
          <Btn label="Submit for review" onPress={() => router.push("/orders")} />
        </>
      }>
        <BackHeader title="Cake Builder" fallback="/ai-designer" />
        <Card>
          <CakePreview design={design} label={`${design.tiers}-tier cake preview`} />
          <Text style={{ textAlign: "center", color: c.muted, fontSize: 12 }}>Preview only. The 3D view arrives with the renderer.</Text>
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} accessibilityLabel="Builder categories">
          {TABS.map(([id, label]) => <Chip key={id} label={label} selected={tab === id} onPress={() => setTab(id)} />)}
        </ScrollView>

        <Card>
          {tab === "structure" ? (
            <>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Number of tiers</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {([1, 2, 3, 4] as const).map((n) => <Chip key={n} label={String(n)} selected={design.tiers === n} onPress={() => patch({ tiers: n })} />)}
              </View>
              <Text style={{ color: c.muted }}>Serves about {servesFor(design.tiers)}</Text>
            </>
          ) : null}
          {tab === "colors" ? (
            <>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Main color · {SWATCHES.find((s) => s.hex === design.primary)?.name}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>{SWATCHES.map((s) => <Swatch key={s.id} name={s.name} hex={s.hex} selected={design.primary === s.hex} onPress={() => patch({ primary: s.hex })} />)}</View>
            </>
          ) : null}
          {tab === "decor" ? (
            <>
              <ToggleRow label="Butterflies × 8" value={design.butterflies} onChange={(v) => patch({ butterflies: v })} />
              <ToggleRow label="Sugar flowers × 6" value={design.flowers} onChange={(v) => patch({ flowers: v })} />
            </>
          ) : null}
          {tab === "flavor" ? (
            <>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Flavor &amp; filling</Text>
              {FLAVORS.map((f) => <Chip key={f} label={f} selected={flavor === f} onPress={() => setFlavor(f)} />)}
            </>
          ) : null}
          {tab === "topper" ? (
            <>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>Topper text</Text>
              <TextInput accessibilityLabel="Topper text" maxLength={20} value={design.message ?? ""} onChangeText={(v) => patch({ message: v })} placeholder="e.g. Happy 18th" placeholderTextColor={c.muted} style={{ minHeight: 48, borderWidth: 1, borderColor: "#D3C9BE", borderRadius: 12, paddingHorizontal: 12, fontSize: 16, color: c.ink }} />
              <Text style={{ color: c.muted, fontSize: 12 }}>Up to 20 characters</Text>
            </>
          ) : null}
        </Card>
        <Btn label="Save design" variant="ghost" onPress={() => toast.show("Saved to your designs")} />
      </Page>
      {toast.node}
    </View>
  );
}
