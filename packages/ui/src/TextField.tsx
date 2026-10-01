import { Text, TextInput, View, type TextInputProps } from "react-native";
import { MIN_TOUCH, colors, radii, spacing } from "./tokens";

type Props = Pick<
  TextInputProps,
  "value" | "onChangeText" | "onBlur" | "secureTextEntry" | "keyboardType" | "autoComplete" | "autoCapitalize" | "textContentType"
> & { label: string; error?: string | undefined };

export function TextField({ label, error, ...input }: Props) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={{
          minHeight: MIN_TOUCH,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.surface,
          color: colors.text,
        }}
        {...input}
      />
      {error ? (
        <Text accessibilityRole="alert" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
