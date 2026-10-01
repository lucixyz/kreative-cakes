import { colors, spacing } from "@cakeshop/ui";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

export function AuthScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, alignItems: "center" }}>
      <View style={{ width: "100%", maxWidth: 420, gap: spacing.lg }}>
        <Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: "600", color: colors.text }}>
          {title}
        </Text>
        {children}
      </View>
    </ScrollView>
  );
}
