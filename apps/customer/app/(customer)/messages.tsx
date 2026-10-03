import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "../../src/components/kit";
import { RequireCustomer } from "../../src/components/RequireCustomer";
import { THREAD, type Msg } from "../../src/data/account";
import { c } from "../../src/theme";

export default function Messages() {
  const insets = useSafeAreaInsets();
  const [thread, setThread] = useState<Msg[]>(THREAD);
  const [draft, setDraft] = useState("");
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThread([...thread, { mine: true, text, when: "Just now" }]);
    setDraft("");
  };
  return (
    <RequireCustomer>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: c.cream }}>
        <View style={{ padding: 20, paddingTop: insets.top + 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: c.line }}>
          <BackHeader title="Kreative Cakes" subtitle="About CK-1042 · usually replies within an hour" fallback="/orders" />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} accessibilityLiveRegion="polite">
          {thread.map((m, i) => (
            <View key={i} style={{ alignSelf: m.mine ? "flex-end" : "flex-start", maxWidth: "80%", gap: 2, alignItems: m.mine ? "flex-end" : "flex-start" }}>
              <View style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomRightRadius: m.mine ? 4 : 16, borderBottomLeftRadius: m.mine ? 16 : 4, backgroundColor: m.mine ? c.ink : "#fff", borderWidth: m.mine ? 0 : 1, borderColor: c.line }}>
                <Text style={{ color: m.mine ? "#fff" : c.ink, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
              </View>
              <Text style={{ fontSize: 11, color: c.muted }}>{m.when}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={{ flexDirection: "row", gap: 8, padding: 12, paddingBottom: insets.bottom + 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: c.line }}>
          <TextInput accessibilityLabel="Write a message" placeholder="Message the bakery" placeholderTextColor={c.muted} value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send" style={{ flex: 1, minHeight: 48, borderWidth: 1, borderColor: "#D3C9BE", borderRadius: 24, paddingHorizontal: 16, fontSize: 16, color: c.ink }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={send} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}><Ionicons name="send" size={20} color="#fff" /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </RequireCustomer>
  );
}
