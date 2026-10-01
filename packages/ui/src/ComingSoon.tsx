import { Text, View } from "react-native";
import { colors, spacing } from "./tokens";

/** Honest placeholder for routes that exist but are not built yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <View style={{ padding: spacing.lg, gap: spacing.sm }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: "600", color: colors.text }}>
        {title}
      </Text>
      <Text style={{ color: colors.textMuted }}>Coming soon — this section is not built yet.</Text>
    </View>
  );
}
