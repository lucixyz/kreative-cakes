import { ActivityIndicator, Pressable, Text } from "react-native";
import { MIN_TOUCH, colors, radii, spacing } from "./tokens";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({ label, onPress, loading = false, variant = "primary", disabled = false }: Props) {
  const primary = variant === "primary";
  const inactive = loading || disabled;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={{
        minHeight: MIN_TOUCH,
        borderRadius: radii.md,
        paddingHorizontal: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: primary ? colors.primary : "transparent",
        borderWidth: primary ? 0 : 1,
        borderColor: colors.border,
        opacity: inactive ? 0.6 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.onPrimary : colors.text} />
      ) : (
        <Text style={{ color: primary ? colors.onPrimary : colors.text, fontWeight: "600" }}>{label}</Text>
      )}
    </Pressable>
  );
}
